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
  });
  console.log('new response: ', response);
  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const data = await response.json();
  console.log('Backend JSON data:', data);
  return data.parsed_data;
} 