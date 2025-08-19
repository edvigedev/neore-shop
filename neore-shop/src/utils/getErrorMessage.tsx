/**
 * Translates various error types into a consistent, user-friendly string.
 * @param error The error caught.
 * @returns
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Response) {
    switch (error.status) {
      case 400: // Bad Request
      case 404: // Not Found
        return 'The resource you requested could not be found. Please try again.';
      case 401: // Unauthorized
        return 'Invalid credentials provided. Please try again.';
      case 403: // Forbidden
        return "You don't have permission to access this resource. Please contact support.";
      case 500: // Internal Server Error
        return 'There was a problem with the server. Please try again later.';
      default:
        return `An unexpected server error occurred (Status: ${error.status}). Please try again.`;
    }
  }

  // Case 2: The error is a standard JavaScript Error object (e.g., network failure)
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('failed to fetch')) {
      return 'A network error occurred. Please check your internet connection and try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
