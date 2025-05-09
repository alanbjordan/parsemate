// Service to handle API requests to the backend

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function uploadReceipt(file, parsedData) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(parsedData));

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('File upload failed');
  }
  return await response.json();
}

export async function fetchReceipts() {
  const response = await fetch(`${API_URL}/receipts`);
  if (!response.ok) {
    throw new Error('Failed to fetch receipts');
  }
  return await response.json();
} 