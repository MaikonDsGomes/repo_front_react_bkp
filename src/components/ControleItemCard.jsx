import Estrelas from "./Estrelas";

export default function ControleItemCard({
  tipo = "avaliacao", // "avaliacao" | "cancelamento"
  fotoUrl,
  clienteNome,
  servicoNome,
  dataHoraISO,
  descricao,
  estrelas,           // usado quando tipo = "avaliacao"
  formatarDataHora,   // opcional
}) {
  const cardClass =
    tipo === "avaliacao"
      ? "section_controle_avaliacao_card"
      : "section_controle_cancelamento_card";

  const lineClass =
    tipo === "avaliacao"
      ? "section_controle_avaliacao_card_line"
      : "section_controle_cancelamento_card_line";

  const formatar = (iso) => {
    if (typeof formatarDataHora === "function") return formatarDataHora(iso);
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(2);
      const hh = d.getHours();
      const min = String(d.getMinutes()).padStart(2, "0");
      const sufixo = hh >= 12 ? "pm" : "am";
      const hh12 = ((hh + 11) % 12) + 1;
      return `${dd}/${mm}/${yy} ${String(hh12).padStart(2, "0")}:${min}${sufixo}`;
    } catch {
      return iso;
    }
  };

  return (
    <div className={`${cardClass} card`}>
      <div className={lineClass} style={{ alignItems: "center" }}>
        <img
        className="card-foto-cliente-dashboard" 
        src={`http://localhost:8080/usuarios/foto/${fotoUrl}`}
        onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
        alt="icon_perfil" />

        <p className="paragrafo-1 semibold">{clienteNome}</p>
        {tipo === "avaliacao" && typeof estrelas === "number" && (
          <Estrelas quantidade={estrelas} />
        )}
      </div>

      <div className={lineClass} style={{ gap: "24px" }}>
        <p className="paragrafo-2">
          <a className="semibold">Serviço:</a> {servicoNome}
        </p>
        <p className="paragrafo-2 italic">
          <a className="semibold">Data:</a> {formatar(dataHoraISO)}
        </p>
      </div>

      <div className={lineClass} style={{ flexDirection: "column", gap: 0 }}>
        <p className="paragrafo-2 semibold">Descrição:</p>
        <p className="paragrafo-2">{descricao}</p>
      </div>
    </div>
  );
}