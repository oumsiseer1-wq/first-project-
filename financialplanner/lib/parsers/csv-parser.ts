import { ParsedTransaction } from '../types';

export interface CSVParseResult {
  transactions: ParsedTransaction[];
  errors: string[];
}

export async function parseCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const errors: string[] = [];
    const transactions: ParsedTransaction[] = [];

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          errors.push('CSV file is empty or has no data rows');
          resolve({ transactions, errors });
          return;
        }

        // Parse header to detect column mapping
        const headers = parseHeaders(lines[0]);
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          try {
            const transaction = parseCSVLine(lines[i], headers);
            if (transaction) {
              transactions.push(transaction);
            }
          } catch (err) {
            errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Parse error'}`);
          }
        }

        resolve({ transactions, errors });
      } catch (error) {
        errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        resolve({ transactions, errors });
      }
    };

    reader.onerror = () => {
      errors.push('Failed to read file');
      resolve({ transactions, errors });
    };

    reader.readAsText(file);
  });
}

function parseHeaders(headerLine: string): Record<string, number> {
  const headers = headerLine.split(',').map(h => h.toLowerCase().trim());
  const mapping: Record<string, number> = {};

  headers.forEach((header, index) => {
    // Map common column names
    if (header.includes('date')) mapping.date = index;
    else if (header.includes('merchant') || header.includes('description') || header.includes('payee')) mapping.merchant = index;
    else if (header.includes('amount')) mapping.amount = index;
    else if (header.includes('debit') || header.includes('withdrawal')) mapping.debit = index;
    else if (header.includes('credit') || header.includes('deposit')) mapping.credit = index;
    else if (header.includes('category')) mapping.category = index;
    else if (header.includes('balance')) mapping.balance = index;
  });

  return mapping;
}

function parseCSVLine(line: string, headers: Record<string, number>): ParsedTransaction | null {
  const values = parseCSVLineValues(line);
  
  // Extract date
  const dateValue = values[headers.date] || values[0];
  const date = parseDate(dateValue);
  if (!date) return null;

  // Extract amount
  let amount = 0;
  let type: 'debit' | 'credit' = 'debit';

  if (headers.amount !== undefined) {
    amount = parseAmount(values[headers.amount]);
    type = amount < 0 ? 'debit' : 'credit';
    amount = Math.abs(amount);
  } else {
    const debit = headers.debit !== undefined ? parseAmount(values[headers.debit]) : 0;
    const credit = headers.credit !== undefined ? parseAmount(values[headers.credit]) : 0;
    
    if (debit > 0) {
      amount = debit;
      type = 'debit';
    } else if (credit > 0) {
      amount = credit;
      type = 'credit';
    } else {
      // Fallback to third column
      amount = parseAmount(values[2] || '0');
      type = amount < 0 ? 'debit' : 'credit';
      amount = Math.abs(amount);
    }
  }

  if (amount === 0) return null;

  // Extract merchant/description
  const merchant = values[headers.merchant] || values[1] || 'Unknown';
  
  // Extract category if available
  const category = headers.category !== undefined ? values[headers.category] : undefined;
  
  // Extract balance if available
  const balance = headers.balance !== undefined ? parseAmount(values[headers.balance]) : undefined;

  return {
    id: `${date}-${merchant}-${amount}-${Math.random()}`,
    date,
    merchant: merchant.trim(),
    amount,
    type,
    category: category?.trim(),
    description: merchant.trim(),
    balance,
  };
}

function parseCSVLineValues(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

function parseDate(value: string): string | null {
  if (!value) return null;
  
  // Try common date formats
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  // Try DD/MM/YYYY
  const parts = value.split('/');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  }

  return null;
}

function parseAmount(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[$,£€\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}
