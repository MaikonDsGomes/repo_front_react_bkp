export async function perguntarIA(pergunta) {
  if (!pergunta || !pergunta.trim()) {
    throw new Error("Pergunta vazia. Informe um contexto ou pergunta.");
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const resp = await fetch(`${baseUrl}/api/ai/perguntar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Falha IA (${resp.status}): ${text}`);
  }
  const data = await resp.json();
  return data.resposta;
}
