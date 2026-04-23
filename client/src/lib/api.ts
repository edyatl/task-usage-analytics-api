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
    let message = response.statusText;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') message = body.detail;
    } catch {
      // body is not JSON, keep statusText
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export { apiFetch };
