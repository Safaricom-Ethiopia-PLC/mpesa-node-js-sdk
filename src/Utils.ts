/**
 * Utilities for SDK Development
 * This file contains common utilities for input validation,
 * date/time formatting, string manipulation and more
 */

/**
 * Input Validation Utility
 */
export class Validator {
    /**
     * Validates that a required field is present and non-empty.
     * @param value - The value to validate.
     * @param fieldName - The name of the field for error messages.
     */
    static validateRequired(value: unknown, fieldName: string): void {
        if (value === undefined || value === null || value === '') {
            throw new Error(`${fieldName} is required.`);
        }
    }

    /**
     * Validates that a value is a positive number.
     * @param value - The value to validate.
     * @param fieldName - The name of the field for error messages.
     */
    static validatePositiveNumber(value: unknown, fieldName: string): void {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error(`${fieldName} must be a positive number.`);
        }
    }

    /**
     * Validates that a URL is properly formatted.
     * @param url - The URL to validate.
     * @param fieldName - The name of the field for error messages.
     */
    static validateURL(url: string, fieldName: string): void {
        const urlRegex = /^(https?:\/\/)?([\w.-]+)+(\.[a-z]{2,})+(:[0-9]{1,5})?(\/[\w#!:.?+=&%@!-]*)?$/i;
        if (!urlRegex.test(url)) {
            throw new Error(`${fieldName} must be a valid URL.`);
        }
    }
}

/**
 * Date/Time Utility
 */
export class DateTimeUtil {
    /**
     * Formats a Date object into the required API format (YYYYMMDDHHmmss).
     * @param date - The date to format.
     * @returns The formatted date string.
     */
    static formatToApiTimestamp(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return (
            date.getFullYear().toString() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds())
        );
    }

    /**
     * Calculates the expiration time given a number of seconds.
     * @param expiresInSeconds - The expiration duration in seconds.
     * @returns The expiration timestamp as a Date object.
     */
    static calculateExpiryTime(expiresInSeconds: number): Date {
        return new Date(Date.now() + expiresInSeconds * 1000);
    }
}

/**
 * String Utility
 */
export class StringUtil {
    /**
     * Encodes a string to Base64.
     * @param value - The string to encode.
     * @returns The Base64-encoded string.
     */
    static toBase64(value: string): string {
        return Buffer.from(value).toString('base64');
    }

    /**
     * Truncates a string to the specified length, adding "..." if truncated.
     * @param value - The string to truncate.
     * @param maxLength - The maximum allowed length.
     * @returns The truncated string.
     */
    static truncate(value: string, maxLength: number): string {
        return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
    }
}

/**
 * Exponential Backoff Utility
 */
export class RetryUtil {
    /**
     * Calculates the delay for a retry attempt using exponential backoff.
     * @param attempt - The current retry attempt (0-indexed).
     * @param baseDelay - The base delay in milliseconds (default: 100ms).
     * @returns The calculated delay in milliseconds.
     */
    static calculateBackoffDelay(attempt: number, baseDelay: number = 100): number {
        return Math.pow(2, attempt) * baseDelay;
    }
}

export const Utils = {
    Validator,
    DateTimeUtil,
    StringUtil,
    RetryUtil,
};
