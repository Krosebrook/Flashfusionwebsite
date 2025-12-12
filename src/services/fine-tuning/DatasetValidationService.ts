/**
 * Dataset Validation Service
 * Comprehensive validation and preprocessing for training datasets
 */

import type {
  Dataset,
  DatasetValidation,
  ValidationError,
  ValidationWarning,
  DatasetStatistics,
  DatasetFormat,
  TokenDistribution
} from '../../types/fine-tuning';

export class DatasetValidationService {
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly MIN_RECORDS = 10;
  private readonly MAX_RECORDS = 1000000;
  private readonly RECOMMENDED_MIN_RECORDS = 100;

  /**
   * Validate a dataset file before training
   */
  async validateDataset(
    file: File,
    format: DatasetFormat
  ): Promise<DatasetValidation> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // File size validation
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push({
        message: `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
        severity: 'critical'
      });
    }

    // Read and parse file
    const content = await this.readFile(file);
    const records = await this.parseDataset(content, format);

    // Record count validation
    if (records.length < this.MIN_RECORDS) {
      errors.push({
        message: `Dataset must contain at least ${this.MIN_RECORDS} records. Found: ${records.length}`,
        severity: 'critical'
      });
    }

    if (records.length < this.RECOMMENDED_MIN_RECORDS) {
      warnings.push({
        message: `Dataset contains ${records.length} records. Recommended: at least ${this.RECOMMENDED_MIN_RECORDS} records for better results`,
        suggestion: 'Consider adding more training examples for improved model performance'
      });
    }

    if (records.length > this.MAX_RECORDS) {
      errors.push({
        message: `Dataset exceeds maximum record count of ${this.MAX_RECORDS}. Found: ${records.length}`,
        severity: 'error'
      });
    }

    // Structure validation
    const structureValidation = this.validateStructure(records, format);
    errors.push(...structureValidation.errors);
    warnings.push(...structureValidation.warnings);

    // Content validation
    const contentValidation = this.validateContent(records);
    errors.push(...contentValidation.errors);
    warnings.push(...contentValidation.warnings);

    // Calculate statistics
    const statistics = this.calculateStatistics(records);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      statistics
    };
  }

  /**
   * Read file content
   */
  private async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Parse dataset based on format
   */
  private async parseDataset(content: string, format: DatasetFormat): Promise<any[]> {
    switch (format) {
      case 'jsonl':
        return this.parseJSONL(content);
      case 'json':
        return this.parseJSON(content);
      case 'csv':
        return this.parseCSV(content);
      case 'text':
        return this.parseText(content);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Parse JSONL format
   */
  private parseJSONL(content: string): any[] {
    const lines = content.trim().split('\n');
    const records: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const record = JSON.parse(line);
        records.push({ ...record, _line: i + 1 });
      } catch (error) {
        throw new Error(`Invalid JSON at line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return records;
  }

  /**
   * Parse JSON format
   */
  private parseJSON(content: string): any[] {
    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse CSV format
   */
  private parseCSV(content: string): any[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must contain headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record: any = { _line: i + 1 };

      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      records.push(record);
    }

    return records;
  }

  /**
   * Parse plain text format
   */
  private parseText(content: string): any[] {
    const lines = content.trim().split('\n');
    return lines.map((line, index) => ({
      text: line,
      _line: index + 1
    }));
  }

  /**
   * Validate dataset structure
   */
  private validateStructure(
    records: any[],
    format: DatasetFormat
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (records.length === 0) {
      errors.push({
        message: 'Dataset is empty',
        severity: 'critical'
      });
      return { errors, warnings };
    }

    // Check for required fields
    const firstRecord = records[0];
    const requiredFields = this.getRequiredFields(format);

    for (const field of requiredFields) {
      if (!(field in firstRecord)) {
        errors.push({
          line: 1,
          field,
          message: `Missing required field: ${field}`,
          severity: 'critical'
        });
      }
    }

    // Check field consistency
    const fieldSet = new Set(Object.keys(firstRecord));
    for (let i = 1; i < records.length; i++) {
      const recordFields = new Set(Object.keys(records[i]));
      
      // Check for missing fields
      for (const field of fieldSet) {
        if (!recordFields.has(field)) {
          warnings.push({
            line: records[i]._line,
            field,
            message: `Field ${field} missing in record`,
            suggestion: 'Ensure all records have consistent fields'
          });
        }
      }

      // Check for extra fields
      for (const field of recordFields) {
        if (!fieldSet.has(field) && field !== '_line') {
          warnings.push({
            line: records[i]._line,
            field,
            message: `Unexpected field ${field} in record`,
            suggestion: 'Remove inconsistent fields for better results'
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Get required fields based on format
   */
  private getRequiredFields(format: DatasetFormat): string[] {
    switch (format) {
      case 'jsonl':
      case 'json':
        return ['prompt', 'completion']; // Common for fine-tuning
      case 'csv':
        return ['input', 'output'];
      case 'text':
        return ['text'];
      default:
        return [];
    }
  }

  /**
   * Validate dataset content
   */
  private validateContent(
    records: any[]
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const record of records) {
      // Check for empty values
      const emptyFields = Object.entries(record)
        .filter(([key, value]) => key !== '_line' && (!value || value === ''))
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        warnings.push({
          line: record._line,
          message: `Empty fields detected: ${emptyFields.join(', ')}`,
          suggestion: 'Fill in empty fields or remove the record'
        });
      }

      // Check for excessively long content
      for (const [key, value] of Object.entries(record)) {
        if (key === '_line') continue;
        
        const content = String(value);
        if (content.length > 10000) {
          warnings.push({
            line: record._line,
            field: key,
            message: `Field ${key} exceeds recommended length (${content.length} characters)`,
            suggestion: 'Consider splitting long content into smaller chunks'
          });
        }
      }

      // Check for duplicates
      const contentHash = this.hashContent(record);
      if (this.isDuplicate(contentHash, records.indexOf(record), records)) {
        warnings.push({
          line: record._line,
          message: 'Duplicate or very similar record detected',
          suggestion: 'Remove duplicate records to improve training efficiency'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Calculate dataset statistics
   */
  private calculateStatistics(records: any[]): DatasetStatistics {
    const lengths: number[] = [];
    let validRecords = 0;
    let invalidRecords = 0;

    for (const record of records) {
      // Calculate content length
      const content = Object.entries(record)
        .filter(([key]) => key !== '_line')
        .map(([_, value]) => String(value))
        .join(' ');

      lengths.push(content.length);

      // Count valid/invalid
      if (this.isValidRecord(record)) {
        validRecords++;
      } else {
        invalidRecords++;
      }
    }

    const sortedLengths = lengths.sort((a, b) => a - b);
    const tokenDistribution = this.calculateTokenDistribution(sortedLengths);

    return {
      totalRecords: records.length,
      validRecords,
      invalidRecords,
      averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
      maxLength: Math.max(...lengths),
      minLength: Math.min(...lengths),
      tokenDistribution,
      uniqueTokens: this.estimateUniqueTokens(records)
    };
  }

  /**
   * Calculate token distribution percentiles
   */
  private calculateTokenDistribution(sortedLengths: number[]): TokenDistribution {
    const getPercentile = (p: number) => {
      const index = Math.floor(sortedLengths.length * p);
      return sortedLengths[index] || 0;
    };

    return {
      p50: getPercentile(0.50),
      p75: getPercentile(0.75),
      p90: getPercentile(0.90),
      p95: getPercentile(0.95),
      p99: getPercentile(0.99)
    };
  }

  /**
   * Estimate unique tokens in dataset
   */
  private estimateUniqueTokens(records: any[]): number {
    const uniqueTokens = new Set<string>();

    for (const record of records) {
      const content = Object.entries(record)
        .filter(([key]) => key !== '_line')
        .map(([_, value]) => String(value))
        .join(' ');

      // Simple tokenization (space-based)
      const tokens = content.toLowerCase().split(/\s+/);
      tokens.forEach(token => uniqueTokens.add(token));
    }

    return uniqueTokens.size;
  }

  /**
   * Check if record is valid
   */
  private isValidRecord(record: any): boolean {
    const values = Object.entries(record)
      .filter(([key]) => key !== '_line')
      .map(([_, value]) => value);

    return values.every(value => value !== null && value !== undefined && value !== '');
  }

  /**
   * Hash content for duplicate detection
   */
  private hashContent(record: any): string {
    const content = Object.entries(record)
      .filter(([key]) => key !== '_line')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, value]) => String(value))
      .join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  /**
   * Check if content is duplicate
   */
  private isDuplicate(hash: string, currentIndex: number, records: any[]): boolean {
    for (let i = 0; i < currentIndex; i++) {
      const otherHash = this.hashContent(records[i]);
      if (hash === otherHash) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clean and prepare dataset for training
   */
  async cleanDataset(records: any[]): Promise<any[]> {
    return records
      .filter(record => this.isValidRecord(record))
      .map(record => {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(record)) {
          if (key === '_line') continue;
          
          // Trim whitespace
          cleaned[key] = String(value).trim();
        }
        return cleaned;
      });
  }
}

export const datasetValidationService = new DatasetValidationService();
