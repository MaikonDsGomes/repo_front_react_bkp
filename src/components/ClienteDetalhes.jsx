import { useEffect, useState } from "react";
import { 
  agendamentosPassadosUsuario, 
  listarUsuarioPorId, 
  getFotoPerfilUsuario,
  buscarDadosHistoricoPorIdAgendamento
} from "../js/api/kaua";
import { mensagemErro, mensagemSucesso, formatarDataBR} from "../js/utils";
import ConcluirAgendamentoPop from "./ConcluirAgendamentoPop";
import "../css/popup/detalhesAgendamento.css";
import Popup from "./Popup";
import "../css/pages/adm_pages/usuarios/clienteDetalhes.css";

export default function ClienteDetalhes({ idCliente, onClose }) {
  const [cliente, setCliente] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [popupConcluir, setPopupConcluir] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [dadosHistorico, setDadosHistorico] = useState([]);
  const [fotoCliente, setFotoCliente] = useState("/src/assets/img/foto_perfil.png");
  const [loading, setLoading] = useState(true);

  const carregarDadosHistorico = (idAgendamento) => {
      if (idAgendamento) {
        buscarDadosHistoricoPorIdAgendamento(idAgendamento)
          .then(data => setDadosHistorico(data))
          .catch(error => console.error("Erro ao carregar historico agendamentos:", error));
      }
    };

  useEffect(() => {
    if (idCliente) buscarDadosCliente();
  }, [idCliente]);

  const buscarDadosCliente = async () => {
    setLoading(true);
    try {
      const dadosCliente = await listarUsuarioPorId(idCliente);
      setCliente(dadosCliente);

      const historico = await agendamentosPassadosUsuario(idCliente);
      setAgendamentos(historico);

      // Buscar foto do cliente
      const blob = await getFotoPerfilUsuario(idCliente);
      if (blob && blob.size > 0) {
        const url = URL.createObjectURL(blob);
        setFotoCliente(url);
      } else {
        setFotoCliente("/src/assets/img/foto_perfil.png");
      }
    } catch (error) {
      mensagemErro("Erro ao carregar informações do cliente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="cliente-detalhes-overlay">
      <div className="cliente-detalhes-card">
        {/* <button className="btn-fechar" onClick={onClose}>✖</button> */}

        <div className="cliente-info-header">
          <img
            src={`http://localhost:8080/usuarios/foto/${idCliente}`}
            onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
            alt={`Foto de ${cliente?.nome}`}
            className="foto-cliente"
          />
          <div className="cliente-info">
            <h3 className="bold">{cliente.nome}</h3>
            <div className="info"><img src="/src/assets/svg/icon_mail.svg" alt="" /> {cliente.email}</div>
            <div className="info"><img src="/src/assets/svg/icon_phone.svg" alt="" /> {cliente.telefone}</div>
            <div className="info"><img src="/src/assets/svg/icon_aniver.svg" alt="" /> {cliente.dataNascimento}</div>
            <div className="info"><img src="/src/assets/svg/icon_cpf.svg" alt="" /> {cliente.cpf}</div>
          </div>
        </div>

        <h4>Atendimentos Passados:</h4>
        <div className="agendamentos-lista">
          {agendamentos.length > 0 ? (
            agendamentos.map((ag) => (
              <div key={ag.id} className="agendamento-card">
                <div>
                  <p><strong>Serviço:</strong> {ag.servico?.nome || "Não informado"}</p>
                  <p><strong>Data:</strong> {`${ag.data} ${ag.fim}` || "dd/mm/yy 00:00"}</p>
                  <p>
                    <strong>Status:</strong> {ag.statusAgendamento?.status || "Desconhecido"}{" "}
                    <strong>Valor:</strong> R${ag.preco?.toFixed(2) || "0,00"}
                  </p>
                </div>

                <div className="botoes-agendamento">
                  <button className="btn-rosa" onClick={() => setPopupConcluir(ag)}>Concluir</button>
                  <button className="btn-branco" onClick={() => {
                    carregarDadosHistorico(ag.id)
                    setModalDetalhes(true);
                  }}>Detalhes</button>
                </div>
              </div>
            ))
          ) : (
            <p className="italic">Nenhum atendimento encontrado.</p>
          )}
        </div>

        <button className="btn-rosa" onClick={onClose}>Sair</button>
      </div>

      {popupConcluir && (
        <ConcluirAgendamentoPop
          dados={popupConcluir}
          onClose={() => setPopupConcluir(null)}
          atualizarAgendamentos={buscarDadosCliente}
        />
      )}

      {modalDetalhes && (
        <VerDetalhesPop
          dados={dadosHistorico}
          onClose={() => {
            setModalDetalhes(false);
            setDadosHistorico(null);
          }}
        />
      )}
    </div>
  );
}

function VerDetalhesPop({ dados, onClose }) {
  if (!dados || dados.length === 0) return null;

  console.log("Dados do histórico para detalhes:", dados);

  return (
    <Popup>
      <div className="calendario_box_popup_concluir_agendamento">
        <h1>Detalhes do atendimento</h1>

        {dados.map((item, index) => (
          <div key={index} className="calendario_box_info_historico_detalhes_agendamento">
            <div>
              <span className="calendario_bolinha calendario_bolinha_cinza"></span>
            </div>

            <div className="calendario_box_infos_status_data">
              <h4>{item.statusAgendamento}</h4>
              <p>{formatarDataBR(item.dataHora.split("T")[0])} {item.dataHora.split("T")[1]?.slice(0, 5)}h</p>
            </div>
          </div>
        ))}

        <button className="btn-rosa" onClick={onClose}>Voltar</button>
      </div>
    </Popup>
  );
}