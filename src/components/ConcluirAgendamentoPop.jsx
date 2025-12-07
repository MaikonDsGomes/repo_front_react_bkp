import { useState } from "react";
import Popup from "../components/Popup"; // se o seu wrapper estiver em outro local, ajuste o import
import { mensagemErro, mensagemSucesso, formatarDataBR } from "../js/utils";
import "../css/popup/concluirAgendamento.css";
import { concluirAgendamento } from "../js/api/agendamento";

export default function ConcluirAgendamentoPop({ dados, onClose, atualizarAgendamentos }) {
  if (!dados) return null;
  const [valorPago, setValorPago] = useState("");

  const dataFormatada = formatarDataBR(dados.data);

  return (
    <Popup>
      <div className="calendario_box_popup_concluir_agendamento">
        <div className="calendario_nome_cliente_box">
          <p className="paragrafo-1 semibold">{dados.usuario?.nome}</p>
        </div>

        <div className="calendario_box_info_concluir_agendamento" >
          <p><strong>Serviço:</strong> {dados.servico?.nome}</p>
          <p>
            <img src="/src/assets/svg/time-sharp.svg" alt=""/>{dataFormatada} {dados.inicio} horas
          </p>
          <p><strong>Valor:</strong> R${dados.preco}</p>
          <p><strong>Cupom:</strong> {dados.cupom?.descricao || "Sem cupom"}</p>
        </div>

        <div className="calendario_box_input_confirmar_agendamento">
          <label>Confirmar valor pago:</label>
          <input
            type="number"
            placeholder="Digite o valor"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
          />
        </div>

        <div className="button_box">
          <button
            className="btn-rosa"
            onClick={async () => {
              try {
                await concluirAgendamento(dados.id, valorPago);
                mensagemSucesso("Agendamento concluído com sucesso!");
                onClose();
                atualizarAgendamentos();
              } catch (err) {
                mensagemErro("Erro ao concluir agendamento");
              }
            }}
          >
            Concluir
          </button>

          <button className="btn-branco" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </Popup>
  );
}