declare global {
  interface Window {
    __env?: {
      API_URL?: string;
    };
  }
}

export function getApiUrl(): string {
  const envUrl = window.__env?.API_URL ?? 'http://localhost:3000';
  return /^https?:\/\//i.test(envUrl) ? envUrl : `https://${envUrl}`;
}
