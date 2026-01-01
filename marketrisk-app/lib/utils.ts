// Utility Functions for MarketRisk Application

import { clsx, type ClassValue } from 'clsx';
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

// =============================================
// Class Name Utilities
// =============================================
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// =============================================
// CUI (Romanian VAT ID) Utilities
// =============================================

/**
 * Validate Romanian CUI format
 * CUI can be 2-10 digits, optionally prefixed with RO
 */
export function validateCUI(cui: string): boolean {
  if (!cui) return false;

  // Remove RO prefix if present
  const cleanCUI = cui.toUpperCase().replace(/^RO/, '').trim();

  // Check if it's 2-10 digits
  const cuiRegex = /^\d{2,10}$/;
  return cuiRegex.test(cleanCUI);
}

/**
 * Format CUI for display (add RO prefix if not present)
 */
export function formatCUI(cui: string): string {
  if (!cui) return '';

  const cleanCUI = cui.toUpperCase().replace(/^RO/, '').trim();
  return `RO${cleanCUI}`;
}

/**
 * Clean CUI for API requests (remove RO prefix)
 */
export function cleanCUI(cui: string): string {
  if (!cui) return '';

  return cui.toUpperCase().replace(/^RO/, '').trim();
}

// =============================================
// Date Utilities (Romanian locale)
// =============================================

/**
 * Format date to Romanian locale
 */
export function formatDate(
  date: string | Date,
  formatString: string = 'dd.MM.yyyy'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString, { locale: ro });
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: string | Date,
  formatString: string = 'dd.MM.yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString, { locale: ro });
}

/**
 * Format relative time (e.g., "acum 2 ore")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { locale: ro, addSuffix: true });
}

/**
 * Format distance between two dates
 */
export function formatDateDistance(
  date1: string | Date,
  date2: string | Date
): string {
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return formatDistance(dateObj1, dateObj2, { locale: ro });
}

// =============================================
// Number Utilities
// =============================================

/**
 * Format number to Romanian locale
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format currency (EUR)
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000000) {
    return formatNumber(num / 1000000000, 1) + 'B';
  }
  if (num >= 1000000) {
    return formatNumber(num / 1000000, 1) + 'M';
  }
  if (num >= 1000) {
    return formatNumber(num / 1000, 1) + 'K';
  }
  return formatNumber(num);
}

// =============================================
// String Utilities
// =============================================

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

// =============================================
// Plan Limit Utilities
// =============================================

/**
 * Check if limit is unlimited (-1)
 */
export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

/**
 * Format limit for display
 */
export function formatLimit(limit: number): string {
  if (isUnlimited(limit)) return 'Nelimitat';
  return formatNumber(limit);
}

/**
 * Calculate usage percentage
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (isUnlimited(limit)) return 0;
  if (limit === 0) return 100;
  return Math.min(Math.round((used / limit) * 100), 100);
}

/**
 * Get usage color based on percentage
 */
export function getUsageColor(percentage: number): 'success' | 'warning' | 'danger' {
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  return 'success';
}

// =============================================
// Risk Score Utilities
// =============================================

/**
 * Get risk badge color class
 */
export function getRiskColorClass(level: string | null): string {
  if (!level) return 'bg-surface-bone text-text-muted';

  switch (level) {
    case 'GREEN':
      return 'bg-state-success-soft text-state-success';
    case 'YELLOW':
      return 'bg-state-warning-soft text-state-warning';
    case 'RED':
      return 'bg-state-danger-soft text-state-danger';
    default:
      return 'bg-surface-bone text-text-muted';
  }
}

/**
 * Get risk level emoji
 */
export function getRiskEmoji(level: string | null): string {
  if (!level) return '⚪';

  switch (level) {
    case 'GREEN':
      return '🟢';
    case 'YELLOW':
      return '🟡';
    case 'RED':
      return '🔴';
    default:
      return '⚪';
  }
}

// =============================================
// URL Utilities
// =============================================

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Parse query string to object
 */
export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

// =============================================
// Array Utilities
// =============================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// =============================================
// Error Handling
// =============================================

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'A apărut o eroare necunoscută';
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Network') ||
      error.message.includes('fetch') ||
      error.message.includes('ECONNREFUSED')
    );
  }
  return false;
}

// =============================================
// Local Storage Utilities
// =============================================

/**
 * Safe local storage get with fallback
 */
export function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe local storage set
 */
export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Remove from local storage
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// =============================================
// Debounce & Throttle
// =============================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
