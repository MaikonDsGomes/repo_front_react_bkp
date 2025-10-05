import { useState, useEffect } from "react";
import MenuConfig from "/src/components/MenuConfig.jsx";
import Popup from "../../components/Popup.jsx";
import { buscarDadosHistoricoPorIdAgendamento, realizarAvaliacao } from "../../js/api/maikon.js"
import { buscarAtendimentosPassados } from "../../js/api/caio";
import {mensagemSucesso, mensagemErro} from "../../js/utils.js"
import "../../css/popup/avaliarAtendimento.css"

function Card_historico({ idAgendamento, servico, statusAgendamento, preco, data, inicio, onDetalhes, onAvaliar }) {
  return (

    <div className="card_historico">
      <div className="esquerda">
        <div className="campos">
          <p className="semibold paragrafo-1">Serviço: </p>
          <p className="paragrafo-1"> {servico?.nome}</p>
        </div>
        <div className="campos" style={{ gap: "16px" }}>
          <p className="data" style={{ gap: "5px" }}>
            <img style={{ maxWidth: 24 }} src={"/src/assets/svg/time-sharp.svg"} alt="" />
            <span>{data}</span>
          </p>
          <p> {inicio}h</p>
        </div>
        <div className="campos" style={{ gap: "16px" }}>
          <div className="campos">
            <p className="semibold paragrafo-2">Status: </p>
            <p className="paragrafo-2">{statusAgendamento?.status}</p>
          </div>
          <div className="campos">
            <p className="semibold paragrafo-2">Valor: </p>
            <p className="paragrafo-2"> R${preco}</p>
          </div>
        </div>
      </div>
      <div className="direita">
        <button
          className="btn-rosa"
          onClick={() => {
            if (typeof onAvaliar === "function") onAvaliar(idAgendamento);
            else console.warn("onAvaliar não é função");
          }}
        >
          Avaliar
        </button>

        <button
          className="btn-branco"
          onClick={() => {
            // proteção caso onDetalhes não exista
            if (typeof onDetalhes === "function") onDetalhes(idAgendamento);
            else console.warn("onDetalhes não é função");
          }}
        >
          Detalhes
        </button>
      </div>
    </div>
  );
}

export default function ConfigHistorico() {

  const [usuario, setUsuario] = useState(null);
  const [atendimento, setAtendimento] = useState([]);

  const [dadosHistorico, setDadosHistorico] = useState([]);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [avaliacaoId, setAvaliacaoId] = useState(null);

  const abrirModalAvaliacao = (idAgendamento) => {
    setAvaliacaoId(idAgendamento);
    setModalAvaliacao(true);
  };



  // Busca os dados e garante que setamos um array (facilita render)
  const carregarDadosHistorico = async (idAgendamento) => {
    if (!idAgendamento) {
      console.warn("carregarDadosHistorico: idAgendamento ausente");
      return;
    }

    try {
      console.log("Buscando detalhes do agendamento:", idAgendamento);
      const data = await buscarDadosHistoricoPorIdAgendamento(idAgendamento);
      console.log("Resposta da API (detalhes):", data);

      const items = Array.isArray(data) ? data : [data]; // normaliza para array
      setDadosHistorico(items);
      setModalDetalhes(true); // abrir só depois de ter os dados
    } catch (error) {
      console.error("Erro ao carregar historico agendamentos:", error);
      setDadosHistorico(null);
      setModalDetalhes(false);
    }
  };


  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      setUsuario(usuarioObj);
    }
  }, []);

  useEffect(() => {
    if (usuario && usuario.id) {
      buscarAtendimentosPassados(usuario.id)
        .then(data => {
          if (Array.isArray(data)) {
            setAtendimento(data);
            console.log(data);
          } else {
            setAtendimento([]);
          }
        })
        .catch(error => {
          console.error("Erro ao carregar atendimentos passados:", error);
          setAtendimento([]);
        });
    }
  }, [usuario]);

  return (
    <MenuConfig>


      {modalDetalhes && (
        <VerDetalhesPop
          dados={dadosHistorico}
          onClose={() => {
            setModalDetalhes(false);
            setDadosHistorico(null);
          }}
        />
      )}

      {modalAvaliacao && (
        <AvaliarPop
          idAgendamento={avaliacaoId}
          onClose={() => setModalAvaliacao(false)}
          onConcluir={(id) => {
            console.log("Avaliação concluída para agendamento:", id);
            // aqui você pode chamar uma função para enviar a avaliação
            setModalAvaliacao(false);
          }}
        />
      )}


      <div className="config_section_container">
        <p className="titulo-1">Atendimentos passados:</p>
        <div className="config_historico_lista">
          {atendimento.length === 0 ? (
            <p className="paragrafo-2">Nenhum atendimento encontrado.</p>
          ) : (
            atendimento.map((dado, index) => (
              <Card_historico
                key={index}
                idAgendamento={dado.idAgendamento ?? dado.id ?? dado.agendamentoId}
                servico={dado.servico}
                statusAgendamento={dado.statusAgendamento}
                preco={dado.preco}
                data={dado.data ?? dado.dataHora ?? ""}
                inicio={dado.inicio}
                onDetalhes={carregarDadosHistorico}
                onAvaliar={abrirModalAvaliacao}
              />

            ))
          )}
        </div>
      </div>
    </MenuConfig>
  );
}

function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function VerDetalhesPop({ dados, onClose }) {
  // aceita null, array vazio, ou array com 1+ itens
  if (!dados || (Array.isArray(dados) && dados.length === 0)) return null;

  const items = Array.isArray(dados) ? dados : [dados];

  return (
    <Popup onClose={onClose}>
      <div className="calendario_box_popup_concluir_agendamento">
        <h1>Detalhes do atendimento</h1>

        {items.map((item, index) => {
          // status pode vir em formatos distintos:
          const status =
            item?.statusAgendamento?.status ??
            item?.statusAgendamento ??
            item?.status ??
            "—";

          // pega data/hora de várias propriedades possíveis
          const dataHoraRaw =
            item?.dataHora ?? item?.data ?? item?.dataAgendamento ?? "";
          const [datePart, timePart] = (dataHoraRaw || "").split("T");
          const dateText = datePart ? formatarDataBR(datePart) : (item?.data ?? "—");
          const timeText = timePart ? `${timePart.slice(0, 5)}h` : (item?.inicio ? `${item.inicio}h` : "—");

          return (
            <div key={index} className="calendario_box_info_historico_detalhes_agendamento">
              <div>
                <span className="calendario_bolinha calendario_bolinha_cinza"></span>
              </div>

              <div className="calendario_box_infos_status_data">
                <h4>{status}</h4>
                <p>{dateText} {timeText}</p>
              </div>
            </div>
          );
        })}

        <button className="btn-rosa" onClick={() => onClose && onClose()}>Voltar</button>
      </div>
    </Popup>
  );
}


// Avaliação


function Star({ filled, onClick, onMouseEnter, onMouseLeave, label }) {
  // SVG com path que usa currentColor (assim CSS/inline style vai controlar a cor)
  return (
    <button
      type="button"
      className={`star-btn ${filled ? "filled" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </button>
  );
}

function StarRating({ value = 0, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" role="radiogroup" aria-label="Nota do serviço">
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = hover ? star <= hover : star <= value;
        return (
          <Star
            key={star}
            filled={filled}
            label={`${star} estrela${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
}

// Novo AvaliarPop usando StarRating
export function AvaliarPop({ idAgendamento, onClose }) {
  const [nota, setNota] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  useEffect(() => {
    // reset quando mudar o agendamento
    setNota(0);
    setDescricao("");
    setLoading(false);
  }, [idAgendamento]);

  const handleConcluir = async () => {
    if (!usuario || !usuario.id) {
      console.error("Usuário não encontrado no localStorage!");
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    const avaliacaoObj = {
      agendamento: { id: idAgendamento },
      usuario: { id: usuario.id },
      notaServico: nota,
      descricaoServico: descricao,
      dataHorario: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await realizarAvaliacao(avaliacaoObj); // conforme seu import/assinatura
      mensagemSucesso("Avaliação enviada com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      mensagemErro("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup onClose={onClose}>
      <div className="calendario_box_popup_concluir_agendamento">
        <h1>Publique como foi sua experiência</h1>

        <div className="conf_hist_estrelas_box">
          <label className="paragrafo-2">Nota do serviço:</label>
          <StarRating value={nota} onChange={setNota} />
        </div>

        <textarea 
          className="conf_hist_textarea"
          placeholder="Digite aqui sua avaliação"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>

        <div className="conf_hist_button_avaliar_pop_box">
          <button className="btn-rosa" onClick={handleConcluir} disabled={loading}>
            {loading ? "Enviando..." : "Concluir"}
          </button>

          <button className="btn-branco" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </Popup>
  );
}