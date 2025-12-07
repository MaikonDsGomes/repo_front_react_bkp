import Popup from "../components/Popup";
import { formatarDataBR } from "../js/utils";

export default function VerDetalhesPop({ dados, onClose }) {
  console.log("DADOS RECEBIDOS EM VerDetalhesPop:", dados);

  if (!dados || dados.length === 0) return null;

  return (
    <Popup>
      <div className="calendario_box_popup_concluir_agendamento">
        <h1>Detalhes do atendimento</h1>

        {dados.map((item, index) => {
          const data = item.data
            ? formatarDataBR(item.data)
            : formatarDataBR(item.dataHora?.slice(0, 10));
          const hora = item.inicio
            ? item.inicio.slice(0, 5)
            : item.dataHora?.slice(11, 16);
          const status =
            item.statusAgendamento?.status ||
            item.statusAgendamento ||
            "Status não informado";

          return (
            <div
              key={index}
              className="calendario_box_info_historico_detalhes_agendamento"
            >
              <div>
                <span className="calendario_bolinha calendario_bolinha_cinza"></span>
              </div>

              <div className="calendario_box_infos_status_data">
                <h4>{status}</h4>
                <p>
                  {data} {hora}h
                </p>
              </div>
            </div>
          );
        })}

        <button className="btn-rosa" onClick={onClose}>
          Voltar
        </button>
      </div>
    </Popup>
  );
}