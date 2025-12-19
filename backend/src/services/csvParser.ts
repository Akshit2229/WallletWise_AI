import Papa from 'papaparse';
import { Transaction, CSVColumnMapping, DataQualityReport } from '../types/aiTypes';

/**
 * Intelligent CSV Parser for Financial Transactions
 * Handles varying column names and formats
 */

/**
 * Fuzzy column name matching using keywords
 */
function findColumn(headers: string[], keywords: string[]): string | undefined {
    const normalized = headers.map(h => h.toLowerCase().trim());

    for (const keyword of keywords) {
        const match = normalized.find(h => h.includes(keyword.toLowerCase()));
        if (match) {
            return headers[normalized.indexOf(match)];
        }
    }
    return undefined;
}

/**
 * Intelligently map CSV columns to transaction fields
 */
export function detectColumnMapping(headers: string[]): CSVColumnMapping {
    return {
        dateColumn: findColumn(headers, [
            'date', 'transaction date', 'posted date', 'datetime', 'trans date', 'txn date'
        ]),
        categoryColumn: findColumn(headers, [
            'category', 'type', 'merchant category', 'expense category', 'merchant', 'description'
        ]),
        amountColumn: findColumn(headers, [
            'amount', 'value', 'total', 'sum', 'debit', 'credit', 'transaction amount'
        ]),
        typeColumn: findColumn(headers, [
            'transaction type', 'type', 'debit/credit', 'dr/cr', 'entry type'
        ]),
        descriptionColumn: findColumn(headers, [
            'description', 'details', 'note', 'memo', 'remarks', 'transaction details', 'merchant'
        ]),
        paymentMethodColumn: findColumn(headers, [
            'payment method', 'card type', 'mode', 'payment mode', 'instrument'
        ])
    };
}

/**
 * Determine transaction type from value or column
 */
function determineType(row: any, typeColumn?: string, amountColumn?: string): 'income' | 'expense' {
    // First try explicit type column
    if (typeColumn && row[typeColumn]) {
        const typeValue = row[typeColumn].toLowerCase();
        if (typeValue.includes('income') || typeValue.includes('credit') || typeValue.includes('cr')) {
            return 'income';
        }
        if (typeValue.includes('expense') || typeValue.includes('debit') || typeValue.includes('dr')) {
            return 'expense';
        }
    }

    // Try to infer from amount sign
    if (amountColumn && row[amountColumn]) {
        const amount = parseFloat(row[amountColumn].toString().replace(/[^0-9.-]/g, ''));
        if (amount < 0) {
            return 'expense';
        }
        if (amount > 0) {
            return 'income';
        }
    }

    // Default to expense
    return 'expense';
}

/**
 * Normalize payment method to match database constraints
 */
function normalizePaymentMethod(value: any): string | undefined {
    if (!value) return undefined;

    const normalized = value.toString().toLowerCase().trim();

    // Map various payment method names to database values
    if (normalized.includes('upi')) return 'upi';
    if (normalized.includes('cash')) return 'cash';
    if (normalized.includes('netbanking') || normalized.includes('net banking') ||
        normalized.includes('bank transfer') || normalized.includes('neft') ||
        normalized.includes('imps') || normalized.includes('rtgs')) return 'netbanking';
    if (normalized.includes('card') || normalized.includes('debit') ||
        normalized.includes('credit')) return 'card';

    // Default to 'other' for unrecognized methods
    return 'other';
}

/**
 * Parse and normalize amount value
 */
function parseAmount(value: any): number {
    if (!value) return 0;

    // Remove currency symbols, commas, and spaces
    const cleaned = value.toString().replace(/[$₹,\s]/g, '');
    const amount = parseFloat(cleaned);

    return isNaN(amount) ? 0 : Math.abs(amount);
}

/**
 * Validate and parse date
 */
function parseDate(value: any): string | null {
    if (!value) return null;

    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;

        // Return in YYYY-MM-DD format
        return date.toISOString().split('T')[0];
    } catch {
        return null;
    }
}

/**
 * Parse CSV file content into transactions
 */
export function parseCSV(fileContent: string): {
    transactions: Transaction[];
    qualityReport: DataQualityReport;
    mapping: CSVColumnMapping;
} {
    const qualityIssues: string[] = [];
    const transactions: Transaction[] = [];
    let rowsWithErrors = 0;

    // Parse CSV
    const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
    });

    if (parseResult.errors.length > 0) {
        qualityIssues.push(`CSV parsing errors: ${parseResult.errors.length} issues found`);
    }

    const rows = parseResult.data as any[];
    const headers = parseResult.meta.fields || [];

    if (rows.length === 0) {
        qualityIssues.push('CSV file is empty or has no valid data rows');
        return {
            transactions: [],
            qualityReport: {
                issues: qualityIssues,
                missingColumns: [],
                rowsWithErrors: 0,
                totalRows: 0
            },
            mapping: {}
        };
    }

    // Detect column mapping
    const mapping = detectColumnMapping(headers);
    const missingColumns: string[] = [];

    // Check for critical missing columns
    if (!mapping.dateColumn) {
        missingColumns.push('date');
        qualityIssues.push('No date column detected - transactions may have missing dates');
    }
    if (!mapping.amountColumn) {
        missingColumns.push('amount');
        qualityIssues.push('No amount column detected - cannot determine transaction amounts');
    }
    if (!mapping.categoryColumn) {
        missingColumns.push('category');
        qualityIssues.push('No category column detected - will use "Uncategorized" as default');
    }

    // Process each row
    rows.forEach((row, index) => {
        try {
            const date = mapping.dateColumn ? parseDate(row[mapping.dateColumn]) : null;
            const amount = mapping.amountColumn ? parseAmount(row[mapping.amountColumn]) : 0;
            const category = mapping.categoryColumn ? row[mapping.categoryColumn]?.trim() : 'Uncategorized';
            const description = mapping.descriptionColumn
                ? row[mapping.descriptionColumn]?.trim()
                : (category || 'Transaction');
            const type = determineType(row, mapping.typeColumn, mapping.amountColumn);
            const paymentMethod = mapping.paymentMethodColumn
                ? normalizePaymentMethod(row[mapping.paymentMethodColumn])
                : undefined;

            // Validate required fields
            if (!date) {
                rowsWithErrors++;
                return;
            }
            if (amount === 0) {
                rowsWithErrors++;
                return;
            }

            transactions.push({
                type,
                amount,
                category: category || 'Uncategorized',
                description: description || 'Transaction',
                date,
                payment_method: paymentMethod,
                note: ''
            });
        } catch (error) {
            rowsWithErrors++;
        }
    });

    if (rowsWithErrors > 0) {
        const errorPercentage = ((rowsWithErrors / rows.length) * 100).toFixed(1);
        qualityIssues.push(`${rowsWithErrors} rows (${errorPercentage}%) could not be processed due to missing or invalid data`);
    }

    if (transactions.length === 0) {
        qualityIssues.push('No valid transactions could be extracted from the CSV file');
    }

    return {
        transactions,
        qualityReport: {
            issues: qualityIssues,
            missingColumns,
            rowsWithErrors,
            totalRows: rows.length
        },
        mapping
    };
}

/**
 * Validate CSV file before processing
 */
export function validateCSVFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
        return { valid: false, error: 'File must be a CSV file' };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { valid: false, error: 'File size must be less than 5MB' };
    }

    return { valid: true };
}
