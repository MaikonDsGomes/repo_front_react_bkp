// import { useState } from 'react';
// import { perguntarIA } from '../js/api/ai';

// export default function AnaliseIA({ contextoBase = '' }) {
//   const [contexto, setContexto] = useState(contextoBase);
//   const [resposta, setResposta] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [erro, setErro] = useState('');

//   async function handleAnalisar() {
//     setLoading(true);
//     setErro('');
//     setResposta('');
//     try {
//       const prompt = `Você é um assistente para análise de dados de um salão de beleza.\nDados:\n${contexto}\n\nObjetivo: gere uma análise clara e resumida, com insights acionáveis e sugestões práticas. Use bullets. Lembre-se que o texto da sua resposta será exibido diretamente dentro de uma textarea de um site, então evite formatações complexas.`;
//       const r = await perguntarIA(prompt);
//       setResposta(r);
//     } catch (e) {
//       setErro(e.message ?? 'Erro ao gerar análise');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="analise_ia_card">
//       <textarea
//         value={contexto}
//         onChange={(e) => setContexto(e.target.value)}
//         placeholder="Cole ou edite os dados/contexto aqui"
//         rows={6}
//         style={{ width: '100%' }}
//       />

//       <button onClick={handleAnalisar} disabled={loading}
//         style={{ padding:"8px 12px", background:"black", color:"white", borderRadius:"6px", width:"fit-content", cursor: loading?"not-allowed":"pointer" }}>
//         {loading ? 'Analisando...' : 'Analisar com IA'}
//       </button>

//       {erro && <p style={{ color: 'var(--vermelho)', whiteSpace:'pre-wrap' }}>{erro}</p>}
//       {resposta && (
//         <div style={{ whiteSpace: 'pre-wrap', border:'1px solid #eee', borderRadius:'6px', padding:'8px', background:'#fafafa', maxHeight:'180px'!important}}>
//           {resposta}
//         </div>
//       )}
//     </div>
//   );
// }
