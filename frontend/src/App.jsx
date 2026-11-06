import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';

export default function App() {
  const [status, setStatus] = useState('Checking backend...');

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`Backend says: ${data.status} (${data.service})`))
      .catch(() => setStatus('Backend is not reachable. Is it running on port 4000?'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>JanSeva AI</h1>
      <p>Your Voice. Your Rights. Your Government Benefits.</p>
      <p>{status}</p>
    </main>
  );
}