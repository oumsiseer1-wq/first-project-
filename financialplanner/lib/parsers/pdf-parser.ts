import { ParsedTransaction } from '../types';


export interface PDFParseResult {
  transactions: ParsedTransaction[];
  errors: string[];
}

function looksLikeScannedPdf(text: string): boolean {
  return text.trim().length === 0;
}

function parseDate(value: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  const parts = value.split('/');
  if (parts.length === 3) {
    const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  }

  return null;
}

function parseAmount(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[$,£€\s]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : Math.abs(parsed);
}

function parsePDFText(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('transaction') || lower.includes('date') || lower.includes('merchant')) continue;

    const parts = line.split(/\s{2,}|	+/).filter(Boolean);
    if (parts.length < 2) continue;

    const maybeDate = parseDate(parts[0]);
    if (!maybeDate) continue;

    const amountText = parts[parts.length - 1];
    const amount = parseAmount(amountText);
    if (!amount) continue;

    const merchant = parts.slice(1, -1).join(' ').replace(/\s+/g, ' ').trim() || 'Unknown';
    const type: 'debit' | 'credit' = amountText.includes('-') ? 'debit' : 'debit';

    transactions.push({
      id: `${maybeDate}-${merchant}-${amount}`,
      date: maybeDate,
      merchant,
      amount,
      type,
      description: merchant,
      category: undefined,
    });
  }

  return transactions;
}

export async function parsePDF(file: File): Promise<PDFParseResult> {
  const errors: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamically import pdfjs to avoid server-side DOM dependencies
    const pdfjsLib = await import('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const transactions: ParsedTransaction[] = [];

    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => (item && item.str) ? String(item.str) : '').join(' ');

      if (looksLikeScannedPdf(text)) {
        errors.push('Scanned image-only PDFs are not supported yet. Please upload a text-based PDF or CSV file instead.');
        return { transactions: [], errors };
      }

      transactions.push(...parsePDFText(text));
    }

    return { transactions, errors };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse PDF';
    errors.push(`Unable to read the PDF file: ${message}`);
    return { transactions: [], errors };
  }
}
