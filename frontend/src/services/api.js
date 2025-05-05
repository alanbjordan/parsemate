// Service to handle API requests to the backend

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
    // credentials: 'include', // Uncomment if backend requires cookies/auth
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
} 