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
  const json = await response.json();
  console.log('File uploaded successfully');
  console.log(json);
  return json;
}

export async function fetchReceipts() {
  const response = await fetch(`${API_URL}/receipts`);
  if (!response.ok) {
    throw new Error('Failed to fetch receipts');
  }
  return await response.json();
}

export async function saveReceipt(data) {
  const response = await fetch(`${API_URL}/save-receipt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save receipt');
  }
  const json = await response.json();
  console.log('Receipt saved successfully');
  console.log(json);
  return json;
}

export async function fetchReceiptSummaries() {
  const response = await fetch(`${API_URL}/receipts/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch receipt summaries');
  }
  const json = await response.json();
  console.log('Receipt summaries fetched successfully');
  console.log(json);
  return json;
}

export async function fetchReceiptById(id) {
  const response = await fetch(`${API_URL}/receipts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch receipt details');
  }
  return await response.json();
}

export async function deleteReceiptById(id) {
  const response = await fetch(`${API_URL}/receipts/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete receipt');
  }
  return await response.json();
} 