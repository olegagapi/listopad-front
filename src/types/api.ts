/**
 * Standard Result type for API responses.
 * Used for explicit error handling throughout the application.
 */
export type Result<T> = { data: T; error: null } | { data: null; error: string };
