/**
 * Shared contract for POST /api/ai — use on both server responses and client parsing.
 * The API key never appears in these types (it stays server-only).
 */
export type ChatApiRequest = {
  message: string;
};

export type ChatApiSuccess = {
  message: string;
};

export type ChatApiError = {
  error: string;
};
