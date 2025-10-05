import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import NavCalendario from "../../components/NavCalendario";
import Calendario from "../../components/Calendario";
import "../../css/popup/realizarAgendamentoADM.css"
import Popup from "../../components/Popup.jsx";
import { mensagemErro, mensagemSucesso } from "../../js/utils.js"
import { buscarProximosAgendamentosFuncionario } from "../../js/api/agendamento";
import { listarServicos, listarClientes, listarPagamento, exibirHorariosDisponiveis, salvarAgendamento } from "../../js/api/maikon.js"

export default function CalendarioVisaoGeral() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalRealizarAgendamento, setModalRealizarAgendamento] = useState(false);


  // 👉 Função reutilizável para buscar agendamentos
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
          <h1 className="supertitulo-1">Próximos atendimentos</h1>
        </div>

        {modalRealizarAgendamento && (
          <RealizarAgendamento
            onClose={() => setModalRealizarAgendamento(false)}
            onAgendamentoSalvo={carregarAgendamentos} // 👈 aqui
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
                  {agendamento.data} - incio {agendamento.inicio} até {agendamento.fim}
                </p>
              </div>
              <div className="calendario_buttons_box_card_proximo_atendimento">
                <button className="btn-rosa" style={{ height: "60px" }}>Reagendar</button>
                <button className="btn-branco" style={{ height: "60px" }}>Cancelar</button>
              </div>
            </div>
          ))
        ) : (
          <p>Sem agendamentos próximos.</p>
        )}

        {/* CALENDÁRIO */}
        <Calendario />

        {/* BOTÕES FINAIS */}
        <div className="btn-juntos" style={{ flexDirection: "row", width: "100%" }}>

          <button
            className="btn-rosa"
            style={{ width: "100%" }}
            onClick={() => setModalRealizarAgendamento(true)}
          >
            Criar Agendamento
          </button>


          <button className="btn-branco" style={{ width: "100%" }}>Criar Compromisso</button>
        </div>
      </MenuDash>
    </>
  );
}



function RealizarAgendamento({ onClose, onAgendamentoSalvo }) {
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [pagamentos, setPagamento] = useState([]);

  const [dataSelecionada, setDataSelecionada] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");

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

          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome} - {cliente.email}</option>
            ))}
          </select>

          <select
            value={horarioSelecionado}
            onChange={(e) => setHorarioSelecionado(e.target.value)}
          >
            <option value="" disabled hidden>Selecione data e serviço</option>
            {horarios.map((hora, i) => (
              <option key={i} value={hora.horario}>{hora.horario}</option>
            ))}
          </select>

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
          <input type="text" placeholder="Insira o código do cupom" />
        </div>

        <div className="button_box">
          <button className="btn-rosa" onClick={async () => {
            try {
              await salvarAgendamento(clienteSelecionado, servicoSelecionado, pagamentoSelecionado, dataSelecionada, horarioSelecionado);

              // 🔄 Atualiza a lista de agendamentos no pai (e o calendário se usar os mesmos dados)
              if (onAgendamentoSalvo) await onAgendamentoSalvo();

              onClose()
              mensagemSucesso("Agendamento realizado com sucesso!")
            } catch (error) {
              console.error("Erro ao salvar agendamento:", error);
              onClose()
              mensagemErro("Erro ao salvar agendamento. Verifique os dados e tente novamente.");
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
