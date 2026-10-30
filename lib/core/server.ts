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

/**
 * PATCH request — sends a partial body to the server.
 * Matches: app.patch('/app/course/:id', ...) which does $set: req.body
 * Server responds: { success: boolean, message: string, result: ... }
 * Throws with the server's message on non-2xx (e.g. 404 "Course not found").
 */
export const serverPatch = async <T = unknown, U = unknown>(
  path: string,
  data: U
): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (json as { message?: string })?.message || `Server responded with status ${res.status}`
    );
  }

  return json as T;
};

/**
 * Body-less DELETE — matches Express endpoints that only read req.params
 * and never expect a request body (e.g. DELETE /app/course/:id).
 * Parses the JSON response { message: string } and throws on non-2xx.
 */
export const serverDelete = async (path: string): Promise<{ message: string }> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    // intentionally no body — server uses req.params.id only
  });

  const data = await res.json().catch(() => ({ message: `Status ${res.status}` }));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message || `Server responded with status ${res.status}`
    );
  }

  return data as { message: string };
};

export const serverFetch = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T | Record<string, never>> => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
      ...options,
    });
    return await res.json() as T;
  } catch (error) {
    console.error(error);
    return {};
  }
};
