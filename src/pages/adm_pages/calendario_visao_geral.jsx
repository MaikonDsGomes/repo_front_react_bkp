import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import NavCalendario from "../../components/NavCalendario";
import Calendario from "../../components/Calendario";
import "../../css/popup/realizarAgendamentoADM.css"
import Popup from "../../components/Popup.jsx";
import { mensagemErro, mensagemSucesso, formatarDataBR } from "../../js/utils.js"
import { buscarProximosAgendamentosFuncionario } from "../../js/api/agendamento";
import { listarServicos, listarClientes, listarPagamento, exibirHorariosDisponiveis, salvarAgendamento, reagendarAgendamento } from "../../js/api/maikon.js"
import { cancelarAgendamentoJS, enviarMotivoCancelar, cadastrarExcecao } from "../../js/api/caio.js"

export default function CalendarioVisaoGeral() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalRealizarAgendamento, setModalRealizarAgendamento] = useState(false);
  const [modalRealizarReagendamento, setModalRealizarReagendamento] = useState(false);
  const [dadosParaReagendar, setDadosParaReagendar] = useState(null);
  const [popupAlertaAberto, setPopupAlertaAberto] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
  const [popupMotivoCancelar, setPopupMotivoCancelar] = useState(false);

  const [novoHorarioExcecao, setNovoHorarioExcecao] = useState({});
  const [popupCadastroExcecao, setPopupCadastroExcecao] = useState(false);




  const confirmarCadastroExcecao = async () => {
    const valid = validateHorario(novoHorarioExcecao, "excecao");
    if (!valid.ok) {
      setPopupCadastroExcecao(false);
      mensagemErro(valid.mensagem);
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const { aberto, capacidade } = novoHorarioExcecao;
    const dados = {
      ...novoHorarioExcecao,
      capacidade: aberto === 1 ? Number(capacidade) : 0,
      funcionario: { id: usuario.id }
    };
    try {
      await cadastrarExcecao(dados);
      setPopupCadastroExcecao(false);
      mensagemSucesso(`Exceção cadastrada com sucesso!`);
      setNovoHorarioExcecao({});
    } catch (error) {
      setPopupCadastroExcecao(false);
      mensagemErro("Erro ao cadastrar exceção. Tente novamente mais tarde.");
    }
  };

  const carregarAgendamentos = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.id) {
      try {
        const data = await buscarProximosAgendamentosFuncionario(usuario.id);
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      }
    }
  };

  const handleCancelarClick = (agendamento) => {
    setAgendamentoParaCancelar(agendamento);
    setPopupAlertaAberto(true);
  };

  const handleMotivoCancelar = () => {
    setPopupMotivoCancelar(true);
  };

  const handleMotivoCancelarFalse = () => {
    setPopupMotivoCancelar(false);
  };

  const handleOpenPopupCadastroExcecao = () => {
    setNovoHorarioExcecao({});
    setPopupCadastroExcecao(true);
  };
  const confirmarMotivoCancelar = () => {
    (async () => {
      try {
        const descricao = document.getElementById("motivo-cancelamento").value;
        if (!descricao || descricao.trim() === "") {
          mensagemErro("Por favor, informe o motivo do cancelamento.");
          return;
        }
        await enviarMotivoCancelar({ descricao, agendamento: agendamentoParaCancelar });
        mensagemSucesso("Motivo de cancelamento enviado com sucesso!");
      } catch (error) {
        mensagemErro("Erro ao enviar motivo de cancelamento. Tente novamente mais tarde.");
        console.error(error);
      } finally {
        setPopupMotivoCancelar(false);
      }
    })();
  };

  const confirmarCancelamento = async () => {
    try {
      await cancelarAgendamentoJS(agendamentoParaCancelar.id);
      mensagemSucesso("Agendamento cancelado com sucesso!");

      setTimeout(() => {
        handleMotivoCancelar();
        carregarAgendamentos()
      }, 1500);

    } catch (error) {
      mensagemErro("Erro ao cancelar agendamento. Tente novamente mais tarde.");
    }
    setPopupAlertaAberto(false);
  };


  useEffect(() => {
    carregarAgendamentos();
  }, []);


  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.id) {
      buscarProximosAgendamentosFuncionario(usuario.id)
        .then(data => {
          setAgendamentos(data);
        })
        .catch(error => {
          console.error("Erro ao carregar agendamentos:", error);
        });
    }
  }, []); // 👈 useEffect fechado corretamente

  return (
    <>
      {/* NAVBAR LATERAL */}
      <MenuDash>
        {/* MINI NAV */}
        <NavCalendario />
        <div className="dash_section_container">
          <h1 className="titulo-1">Próximos atendimentos</h1>
        </div>

        {modalRealizarAgendamento && (
          <RealizarAgendamento
            onClose={() => setModalRealizarAgendamento(false)}
            onAgendamentoSalvo={carregarAgendamentos}
          />
        )}

        {popupMotivoCancelar && (
          <Popup>
            <p className="paragrafo-2 semibold">Pode nos dizer o motivo do cancelamento?</p>
            <textarea id="motivo-cancelamento" placeholder="Digite o motivo do cancelamento..." />
            <div className="btn-juntos">
              <button className="btn-rosa" onClick={() => confirmarMotivoCancelar()}>Enviar</button>
              <button className="btn-branco" onClick={() => handleMotivoCancelarFalse()}>Pular</button>
            </div>
          </Popup>
        )}

        {modalRealizarReagendamento && dadosParaReagendar && (
          <RealizarReagendamento
            onClose={() => {
              setModalRealizarReagendamento(false);
              setDadosParaReagendar(null);
            }}
            dadosAgendamento={dadosParaReagendar}
            onAgendamentoSalvo={carregarAgendamentos}
          />
        )}


        {/* CARDS DE AGENDAMENTO */}
        {agendamentos.length > 0 ? (
          agendamentos.map((agendamento, index) => (
            <div key={index} className="calendario_card_proximo_atendimento card">
              <div className="calendario_info_box_card_proximo_atendimento">
                <p className="titulo-1 semibold">{agendamento.usuario.nome}</p>
                <p className="subtitulo">
                  <span className="semibold">Serviço:</span> {agendamento.servico.nome}
                </p>
                <p className="subtitulo semibold info">
                  <img
                    src="/src/assets/svg/time-sharp.svg"
                    alt="icone tempo"
                    style={{ width: "38px", height: "38px" }}
                  />
                  {formatarDataBR(agendamento.data)}, Início {agendamento.inicio} - Fim {agendamento.fim}
                </p>
              </div>
              <div className="calendario_buttons_box_card_proximo_atendimento">
                <button
                  className="btn-rosa"
                  style={{ height: "60px" }}
                  onClick={() => {
                    setDadosParaReagendar(agendamento);
                    setModalRealizarReagendamento(true);
                  }}
                >
                  Reagendar
                </button>

                <button className="btn-branco" onClick={() => handleCancelarClick(agendamento)} style={{ height: "60px" }}>Cancelar</button>
                {popupAlertaAberto && (
                  <PopupAlerta
                    mensagem="Tem certeza que deseja cancelar o agendamento?"
                    funcao={confirmarCancelamento}
                    onClick={() => setPopupMotivoCancelar(true)}
                    onClose={() => setPopupAlertaAberto(false)}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Sem agendamentos próximos.</p>
        )}

        {/* BOTÕES FINAIS */}
        <div className="btn-juntos" style={{ flexDirection: "row", width: "100%" }}>

          <button
            className="btn-rosa"
            style={{ width: "100%" }}
            onClick={() => setModalRealizarAgendamento(true)}
          >
            Criar Agendamento
          </button>


          <button className="btn-branco" onClick={handleOpenPopupCadastroExcecao} style={{ width: "100%" }}>Criar Compromisso</button>
          {popupCadastroExcecao == true ? (
            <PopupCadastrarExcecao
              novoHorarioExcecao={novoHorarioExcecao}
              setPopupCadastroExcecao={setPopupCadastroExcecao}
              onConfirm={confirmarCadastroExcecao}
              setNovoHorarioExcecao={setNovoHorarioExcecao}
            />
          ) : null}
        </div>

        {/* CALENDÁRIO */}
        <Calendario />


      </MenuDash>
    </>
  );
}



function RealizarAgendamento({ onClose, onAgendamentoSalvo }) {
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [pagamentos, setPagamento] = useState([]);

  const [filtroCliente, setFiltroCliente] = useState("");

  const [dataSelecionada, setDataSelecionada] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
  const [cupomSelecionado, setCupomSelecionado] = useState("");

  // Simule aqui os imports reais
  // import { listarClientes, listarServicos, exibirHorariosDisponiveis } from '...'

  useEffect(() => {
    // Buscar serviços e clientes ao abrir o popup
    async function carregarDadosIniciais() {
      try {
        const servicosData = await listarServicos(); // Substitua pela sua função real
        const clientesData = await listarClientes(); // Substitua pela sua função real
        const pagamento = await listarPagamento(); // Substitua pela sua função real

        setServicos(servicosData);
        setClientes(clientesData);
        setPagamento(pagamento);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDadosIniciais();
  }, []);

  // Buscar horários disponíveis quando data e serviço forem selecionados
  useEffect(() => {

    console.log('Data selecionada:', dataSelecionada);
    console.log('Serviço selecionado:', servicoSelecionado);

    async function carregarHorarios() {
      if (dataSelecionada && servicoSelecionado) {
        try {
          const horariosDisponiveis = await exibirHorariosDisponiveis(servicoSelecionado, dataSelecionada);
          setHorarios(horariosDisponiveis);
        } catch (error) {
          console.error("Erro ao buscar horários:", error);
        }
      }
    }

    carregarHorarios();
  }, [dataSelecionada, servicoSelecionado]);

  return (
    <Popup>
      <div className="calendario_box_popup_realizar_agendamento_adm">
        <p className="paragrafo-1">Preencha os campos abaixo:</p>

        <div className="calendario_box_lbl_inp_popup">
          <label>Selecione a data que preferir</label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]}
          />


        </div>

        <div className="calendario_box_down_boxes_popup">
          <select
            value={servicoSelecionado}
            onChange={(e) => setServicoSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Serviço desejado</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>{servico.nome}</option>
            ))}
          </select>


          <div className="calendario_box_lbl_inp_popup">
            <label>Pesquisar cliente:</label>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            />
          </div>

          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Cliente</option>

            {clientes
              .filter((cliente) =>
                cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase())
              )
              .map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.email}
                </option>
              ))}
          </select>

          {/* <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome} - {cliente.email}</option>
            ))}
          </select> */}

          <label>Selecionar horários</label>
          <select
            value={horarioSelecionado}
            onChange={(e) => setHorarioSelecionado(e.target.value)}
            disabled={!horarios.length}
          >
            <option value="" disabled hidden>
              {dataSelecionada
                ? horarios.length
                  ? "Selecione um horário"
                  : "Nenhum horário disponível"
                : "Selecione uma data"}
            </option>

            {horarios.map((hora, i) => (
              <option key={i} value={hora.horario}>
                {hora.horario}
              </option>
            ))}
          </select>
          <label>Selecionar pagamento</label>

          <select
            value={pagamentoSelecionado}
            onChange={(e) => setPagamentoSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Pagamento</option>
            {pagamentos.map((pagamento, i) => (
              <option key={i} value={pagamento.id}>{pagamento.forma}</option>
            ))}
          </select>
        </div>

        <div className="calendario_box_lbl_inp_popup">
          <label htmlFor="">CUPOM de desconto:</label>
          <input value={cupomSelecionado} onChange={(e) => setCupomSelecionado(e.target.value)} type="text" placeholder="Insira o código do cupom" />
        </div>

        <div className="button_box">
          <button className="btn-rosa" onClick={async () => {
            try {
              await salvarAgendamento(clienteSelecionado, servicoSelecionado, cupomSelecionado, pagamentoSelecionado, dataSelecionada, horarioSelecionado);

              // 🔄 Atualiza a lista de agendamentos no pai (e o calendário se usar os mesmos dados)
              if (onAgendamentoSalvo) await onAgendamentoSalvo();

              onClose()
              mensagemSucesso("Agendamento realizado com sucesso!")

              setTimeout(() => {
                 window.location.reload();
              }, 1500);
             

            } catch (error) {
              // Caso o backend tenha respondido com status (ex: 404)
              if (error.response) {
                const status = error.response.status;
                const mensagem = error.response.data?.message || "Erro desconhecido.";

                if (status === 404) {
                  onClose()
                  mensagemErro("Cupom invalido"); // Exibe a mensagem do backend (ex: "Cupom inválido")
                  return;
                }
              }

              // Se for erro de rede, servidor fora do ar etc.
              if (error.request) {
                onClose()
                mensagemErro("Servidor indisponível. Tente novamente mais tarde.");
                return;
              }

              // Erro genérico inesperado
              console.error("Erro ao salvar agendamento:", error);
              onClose()
              mensagemErro("Erro ao realizar agendamento. Tente novamente mais tarde.");
            }

          }}>
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

function RealizarReagendamento({ onClose, dadosAgendamento, onAgendamentoSalvo }) {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  const servicoId = dadosAgendamento?.servico?.id;
  const agendamentoId = dadosAgendamento?.id;

  //🔁 Buscar horários quando data muda
  useEffect(() => {
    async function carregarHorarios() {
      if (dataSelecionada && servicoId) {
        try {
          const horariosDisponiveis = await exibirHorariosDisponiveis(servicoId, dataSelecionada);
          setHorarios(horariosDisponiveis);
        } catch (error) {
          console.error("Erro ao buscar horários:", error);
          mensagemErro("Erro ao buscar horários disponíveis.");
        }
      }
    }

    carregarHorarios();
  }, [dataSelecionada, servicoId]);

  const handleConfirmarReagendamento = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      mensagemErro("Selecione uma nova data e horário.");
      onClose()
      return;
    }

    console.log("###############3")
    console.log(agendamentoId, dataSelecionada, horarioSelecionado)
    console.log("###############3")
    try {
      await reagendarAgendamento(agendamentoId, dataSelecionada, horarioSelecionado);
      mensagemSucesso("Reagendamento realizado com sucesso!");
      if (onAgendamentoSalvo) await onAgendamentoSalvo();
      onClose();
    } catch (error) {
      console.error("Erro ao reagendar:", error);
      mensagemErro("Erro ao realizar reagendamento.");
      onClose()
    }
  };

  return (
    <Popup>
      <div className="calendario_box_popup_realizar_agendamento_adm">
        <h2 className="supertitulo-2">Reagendar Atendimento</h2>

        <p className="paragrafo-2">Cliente: <strong>{dadosAgendamento?.usuario?.nome}</strong></p>
        <p className="paragrafo-2">Serviço: <strong>{dadosAgendamento?.servico?.nome}</strong></p>

        <div className="calendario_box_lbl_inp_popup">
          <label>Nova data</label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="calendario_box_down_boxes_popup">
          <label>Horários disponíveis</label>
          <select
            value={horarioSelecionado}
            onChange={(e) => setHorarioSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Selecione o horário</option>
            {horarios.map((hora, i) => (
              <option key={i} value={hora.horario}>
                {hora.horario}
              </option>
            ))}
          </select>
        </div>

        <div className="button_box">
          <button className="btn-rosa" onClick={handleConfirmarReagendamento}>Confirmar</button>
          <button className="btn-branco" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </Popup>
  );
}

export function PopupAlerta({ mensagem, funcao, onClose }) {

  return (
    <Popup>
      <>
        <div className="popup_alerta_titulo">
          <img src="/src/assets/svg/icon_alert.svg" alt="icon-alert" />
          <p className="subtitulo semibold">Atenção!</p>
        </div>
        <p className="paragrafo-2" style={{ textAlign: "center" }}>{mensagem}</p>
        <div className="btn-juntos">
          <button style={{ width: '50%' }} className="btn-rosa" onClick={funcao}>Sim</button>
          <button style={{ width: '50%' }} className="btn-branco" onClick={onClose}>Não</button>
        </div>
      </>
    </Popup>
  );
}

function PopupCadastrarExcecao({ novoHorarioExcecao, setPopupCadastroExcecao, onConfirm, setNovoHorarioExcecao }) {
  return (
    <Popup>
      <p className="paragrafo-1 semibold">Preencha os campos abaixo:</p>
      <div className="line">
        <div className="input_pai">
          <p className="paragrafo-2">Status:</p>
          <select name="status" id="" className="select" style={{ width: '100%' }} value={novoHorarioExcecao.aberto === undefined ? "" : (novoHorarioExcecao.aberto === 1 ? "aberto" : "fechado")} onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, aberto: e.target.value === "aberto" ? 1 : 0 })}>
            <option value='' selected disabled>Selecione uma opção</option>
            <option value="aberto">Aberto</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
        <div className="input_pai">
          <p>Capacidade:</p>
          <input type="number" name="capacidade" className="input" placeholder="Digite o número" min="0" onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, capacidade: Number(e.target.value) })} />
        </div>
      </div>

      <div className="line">
        <div className="input_pai">
          <p>Data Início:</p>
          <input type="date" name="dataInicio" className="input" onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, dataInicio: e.target.value })} />
        </div>
        <div className="input_pai">
          <p>Data Fim:</p>
          <input type="date" name="dataFim" className="input" onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, dataFim: e.target.value })} />
        </div>
      </div>

      <div className="line">
        <div className="input_pai">
          <p>Hora Início:</p>
          <input type="time" name="horaInicio" className="input" onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, inicio: e.target.value })} />
        </div>
        <div className="input_pai">
          <p>Hora Fim:</p>
          <input type="time" name="horaFim" className="input" onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, fim: e.target.value })} />
        </div>
      </div>

      <div className="btn-line">
        <button className="btn-link" onClick={() => setPopupCadastroExcecao(false)}>Cancelar</button>
        <button className="btn-rosa" onClick={onConfirm}>Concluir</button>
      </div>
    </Popup>
  );
}
function validateHorario(obj, tipo) {
  // tipo: "excecao" ou "padrao"
  const { aberto, capacidade, dataInicio, dataFim, inicio, fim } = obj;

  console.log("Formulario enviado:", obj);
  // Aceita aberto como 0 ou 1
  if ((aberto !== 0 && aberto !== 1) || capacidade < 0 || (aberto === 1 && (!inicio || !fim))) {
    return { ok: false, mensagem: "Preencha todos os campos obrigatórios e use valores válidos." };
  }
  if (tipo === "excecao") {
    if (!dataInicio || !dataFim) {
      return { ok: false, mensagem: "Preencha todos os campos de data." };
    }
    if (new Date(dataFim) < new Date(dataInicio)) {
      return { ok: false, mensagem: "A data final deve ser igual ou posterior à data inicial." };
    }
    if (dataInicio === dataFim && fim <= inicio) {
      return { ok: false, mensagem: "O horário final deve ser maior que o horário inicial." };
    }
  } else {
    if (aberto === 1 && fim <= inicio) {
      return { ok: false, mensagem: "O horário final deve ser maior que o horário inicial." };
    }
    if (aberto === 1 && capacidade == 0) {
      return { ok: false, mensagem: "A capacidade deve ser maior que zero." };
    }
  }
  return { ok: true };
}
