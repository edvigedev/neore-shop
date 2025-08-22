import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../getErrorMessage';

describe('getErrorMessage', () => {
  describe('HTTP Response errors', () => {
    it('should handle HTTP 400 status', () => {
      const mockResponse = new Response('Bad Request', { status: 400 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe('The resource you requested could not be found. Please try again.');
    });

    it('should handle HTTP 404 status', () => {
      const mockResponse = new Response('Not Found', { status: 404 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe('The resource you requested could not be found. Please try again.');
    });

    it('should handle HTTP 401 status', () => {
      const mockResponse = new Response('Unauthorized', { status: 401 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe('Invalid credentials provided. Please try again.');
    });

    it('should handle HTTP 403 status', () => {
      const mockResponse = new Response('Forbidden', { status: 403 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe(
        "You don't have permission to access this resource. Please contact support."
      );
    });

    it('should handle HTTP 500 status', () => {
      const mockResponse = new Response('Internal Server Error', { status: 500 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe('There was a problem with the server. Please try again later.');
    });

    it('should handle unknown HTTP status codes', () => {
      const mockResponse = new Response('Teapot', { status: 418 });
      const result = getErrorMessage(mockResponse);
      expect(result).toBe('An unexpected server error occurred (Status: 418). Please try again.');
    });

    it('should handle HTTP 0 status (network error)', () => {
      const networkError = new Error('Network Error');
      const result = getErrorMessage(networkError);
      expect(result).toBe('Network Error');
    });
  });

  describe('JavaScript Error objects', () => {
    it('should handle network fetch errors', () => {
      const networkError = new Error('Failed to fetch');
      const result = getErrorMessage(networkError);
      expect(result).toBe(
        'A network error occurred. Please check your internet connection and try again.'
      );
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Something went wrong');
      const result = getErrorMessage(genericError);
      expect(result).toBe('Something went wrong');
    });

    it('should handle errors with different case variations', () => {
      const networkError = new Error('FAILED TO FETCH');
      const result = getErrorMessage(networkError);
      expect(result).toBe(
        'A network error occurred. Please check your internet connection and try again.'
      );
    });

    it('should handle errors with partial network error messages', () => {
      const networkError = new Error('Network request failed to fetch data');
      const result = getErrorMessage(networkError);
      expect(result).toBe(
        'A network error occurred. Please check your internet connection and try again.'
      );
    });
  });

  describe('Unknown error types', () => {
    it('should handle string errors', () => {
      const stringError = 'This is a string error';
      const result = getErrorMessage(stringError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle number errors', () => {
      const numberError = 42;
      const result = getErrorMessage(numberError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle null errors', () => {
      const nullError = null;
      const result = getErrorMessage(nullError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle undefined errors', () => {
      const undefinedError = undefined;
      const result = getErrorMessage(undefinedError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle object errors', () => {
      const objectError = { message: 'Custom error object' };
      const result = getErrorMessage(objectError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string errors', () => {
      const emptyStringError = '';
      const result = getErrorMessage(emptyStringError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle whitespace-only errors', () => {
      const whitespaceError = '   ';
      const result = getErrorMessage(whitespaceError);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle very long error messages', () => {
      const longError = new Error('A'.repeat(1000));
      const result = getErrorMessage(longError);
      expect(result).toBe('A'.repeat(1000));
    });

    it('should handle special characters in error messages', () => {
      const specialError = new Error('Error with special chars: !@#$%^&*()');
      const result = getErrorMessage(specialError);
      expect(result).toBe('Error with special chars: !@#$%^&*()');
    });
  });
});
