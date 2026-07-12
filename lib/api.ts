//WEEKLY-COURSES/lib/api.ts
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sistema-educativo-fastapi.onrender.com';
  //const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Obtenemos el token guardado en el login
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // NUEVO: Si el endpoint ya empieza con http, vamos directo. Si no, usamos el Gateway.
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/';
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}