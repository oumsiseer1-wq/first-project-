import { parseCSV } from '../parsers/csv-parser';
import { parsePDF } from '../parsers/pdf-parser';
import { normalizeTransactions } from '../parsers/normalizer';
import { NormalizedData, ParsedTransaction } from '../types';

export interface ParsedStatementResult {
  transactions: ParsedTransaction[];
  normalized: NormalizedData;
  source: 'csv' | 'pdf';
  warnings: string[];
}

export async function parseStatement(file: File): Promise<ParsedStatementResult> {
  const isCSV = file.name.toLowerCase().endsWith('.csv');
  const warnings: string[] = [];

  if (isCSV) {
    const result = await parseCSV(file);
    if (result.errors.length > 0) {
      warnings.push(...result.errors);
    }

    const normalized = normalizeTransactions(result.transactions);
    return {
      transactions: normalized.transactions,
      normalized,
      source: 'csv',
      warnings,
    };
  }

  const result = await parsePDF(file);
  if (result.errors.length > 0) {
    throw new Error(result.errors[0]);
  }

  const normalized = normalizeTransactions(result.transactions);
  return {
    transactions: normalized.transactions,
    normalized,
    source: 'pdf',
    warnings,
  };
}
