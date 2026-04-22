async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path;

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions: RequestInit = { ...defaultOptions, ...options };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    try {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail || response.statusText);
    } catch {
      throw new Error(response.statusText);
    }
  }

  return response.json() as Promise<T>;
}

export { apiFetch };
