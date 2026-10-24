const baseUrl = process.env.NEXT_BASE_URL || 'http://localhost:5000';

export const serverMutation = async <T = unknown, U = unknown>(
  path: string, 
  data: U, 
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string })?.message || `Server responded with status ${res.status}`
    );
  }

  return res.json() as Promise<T>;
};

export const serverFetch = async <T = unknown>(path: string): Promise<T | Record<string, never>> => {
  try {
    const res = await fetch(`${baseUrl}${path}`);
    return await res.json() as T;
  } catch (error) {
    console.error(error);
    return {};
  }
};