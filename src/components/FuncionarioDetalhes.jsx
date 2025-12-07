import { useEffect, useState } from "react";
import {
  listarUsuarioPorId,
  agendamentosPassadosFuncionario,
  listarServicosPorFuncionario,
  listarServicos,
  deletarServicoFuncionario,
  criarServicoFuncionario,
  getFotoPerfilUsuario,
  buscarDadosHistoricoPorIdAgendamento
} from "../js/api/kaua";
import { mensagemErro, mensagemSucesso, formatarDataBR } from "../js/utils";
import "../css/pages/adm_pages/usuarios/clienteDetalhes.css";
import ConcluirAgendamentoPop from "./ConcluirAgendamentoPop";
import "../css/popup/detalhesAgendamento.css";
import Popup from "./Popup";

export default function FuncionarioDetalhes({ idFuncionario, onClose }) {
  const [funcionario, setFuncionario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState("/src/assets/img/foto_perfil.png"); // 🔹 Fallback padrão
  const [agendamentos, setAgendamentos] = useState([]);
  const [todosServicos, setTodosServicos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [competenciasFuncionario, setCompetenciasFuncionario] = useState([]);
  const [popupConcluir, setPopupConcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [dadosHistorico, setDadosHistorico] = useState([]);

  const carregarDadosHistorico = (idAgendamento) => {
    if (idAgendamento) {
      buscarDadosHistoricoPorIdAgendamento(idAgendamento)
        .then(data => setDadosHistorico(data))
        .catch(error => console.error("Erro ao carregar historico agendamentos:", error));
    }
  };

  useEffect(() => {
    if (idFuncionario) {
      buscarDadosFuncionario();
    }
  }, [idFuncionario]);

  const buscarDadosFuncionario = async () => {
    setLoading(true);
    try {
      const dados = await listarUsuarioPorId(idFuncionario);
      setFuncionario(dados);

      // 🔹 Buscar foto de perfil do funcionário
      try {
        const blob = await getFotoPerfilUsuario(idFuncionario);
        const fotoUrl = URL.createObjectURL(blob);
        setFotoPerfil(fotoUrl);
      } catch {
        setFotoPerfil("/src/assets/img/foto_perfil.png");
      }

      const historico = await agendamentosPassadosFuncionario(idFuncionario);
      setAgendamentos(historico);

      const competencias = await listarServicosPorFuncionario(idFuncionario);
      setCompetenciasFuncionario(competencias);

      const idsSelecionados = competencias.map(c => c.servico.id);
      setServicosSelecionados(idsSelecionados);

      const todos = await listarServicos();
      setTodosServicos(todos);

    } catch (error) {
      mensagemErro("Erro ao carregar informações do funcionário.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarServicos = async () => {
    try {
      const idsNovos = servicosSelecionados.filter(id => !competenciasFuncionario.some(c => c.servico.id === id));
      for (let id of idsNovos) {
        await criarServicoFuncionario({ funcionario: idFuncionario, servico: id });
      }

      const idsRemover = competenciasFuncionario
        .filter(c => !servicosSelecionados.includes(c.servico.id))
        .map(c => c.id);
      for (let idComp of idsRemover) {
        await deletarServicoFuncionario(idComp);
      }

      mensagemSucesso("Serviços atualizados com sucesso!");
      buscarDadosFuncionario();
    } catch (error) {
      mensagemErro("Erro ao atualizar serviços do funcionário.");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="cliente-detalhes-overlay">
      <div className="cliente-detalhes-card">
        <button className="btn-fechar-detalhes-func" onClick={onClose}>✖</button>

        <div className="cliente-info-header">
          <img
            src={`http://localhost:8080/usuarios/foto/${idFuncionario}`}
            onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
            alt="Foto do funcionário"
            className="foto-cliente" />
          <div className="cliente-info">
            <h3 className="bold">{funcionario.nome}</h3>
            <div className="info"><img src="/src/assets/svg/icon_mail.svg" alt="" /> {funcionario.email}</div>
            <div className="info"><img src="/src/assets/svg/icon_phone.svg" alt="" /> {funcionario.telefone}</div>
            <div className="info"><img src="/src/assets/svg/icon_cpf.svg" alt="" /> {funcionario.cpf? funcionario.cpf : "CPF não informado"}</div>
          </div>
        </div>

        <h4>Serviços Liberados:</h4>
        <div className="servicos-lista">
          {todosServicos.map((s) => (
            <label key={s.id} className="servico-item">
              <input
                type="checkbox"
                checked={servicosSelecionados.includes(s.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setServicosSelecionados([...servicosSelecionados, s.id]);
                  } else {
                    setServicosSelecionados(servicosSelecionados.filter(id => id !== s.id));
                  }
                }}
              />
              {s.nome}
            </label>
          ))}
        </div>

        <button className="btn-verde" onClick={atualizarServicos}>Atualizar</button>

        <h4 style={{ marginTop: "20px" }}>Atendimentos Passados:</h4>
        <div className="agendamentos-lista">
          {agendamentos.length > 0 ? (
            agendamentos.map((ag) => (
              <div key={ag.id} className="agendamento-card">
                <div style={{ flexDirection: "column" }}>
                  <p><strong>Serviço:</strong> {ag.servico.nome}</p>
                  <p><strong>Data:</strong> {ag.data} {ag.fim}</p>
                  <p><strong>Status:</strong> {ag.statusAgendamento.status}</p>
                </div>

                <div className="botoes-agendamento">
                  {ag.statusAgendamento.status === "CONCLUIDO" ? null : (
                    <button className="btn-rosa" onClick={() => setPopupConcluir(ag)}>Concluir</button>
                  )}
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
        {/* <button className="btn-rosa" onClick={onClose}>Sair</button> */}
      </div>

      {popupConcluir && (
        <ConcluirAgendamentoPop
          dados={popupConcluir}
          onClose={() => setPopupConcluir(null)}
          atualizarAgendamentos={buscarDadosFuncionario}
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