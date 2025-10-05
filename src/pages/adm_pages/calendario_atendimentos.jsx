import { useNavigate } from "react-router-dom";
import "../../css/popup/concluirAgendamento.css"
import React, { useEffect, useState } from "react";
import MenuDash from "/src/components/MenuDash.jsx";
import NavCalendario from "/src/components/NavCalendario.jsx";
import Popup from "../../components/Popup.jsx";
import "../../css/popup/detalhesAgendamento.css";
import Swal from 'sweetalert2';
import {mensagemSucesso, mensagemErro} from "../../js/utils.js"
import {buscarDadosHistoricoPorIdAgendamento} from "../../js/api/maikon.js"

import { buscarAtendimentosPassadosPorIdFuncionario, concluirAgendamento, buscarDetalhesAgendamento } from "../../js/api/agendamento";

export default function Calendario_atendimentos() {
  const navigate = useNavigate();

    const [agendamentos, setAgendamentos] = useState([]);
    const [dadosHistorico, setDadosHistorico] = useState([]);
    const [modalConcluir, setModalConcluir] = useState(false);
    const [modalDetalhes, setModalDetalhes] = useState(false);
    const [DadosHistoricoAgendamento, setDadosHistoricoAgendamento] = useState(null);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

    const carregarAgendamentos = () => {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (usuario?.id) {
        buscarAtendimentosPassadosPorIdFuncionario(usuario.id)
          .then(data => setAgendamentos(data))
          .catch(error => console.error("Erro ao carregar agendamentos:", error));
      }
    };

      const carregarDadosHistorico = (idAgendamento) => {
      if (idAgendamento) {
        buscarDadosHistoricoPorIdAgendamento(idAgendamento)
          .then(data => setDadosHistorico(data))
          .catch(error => console.error("Erro ao carregar historico agendamentos:", error));
      }
    };

    useEffect(() => {
      carregarAgendamentos();
    }, []);

  return (
    <MenuDash>
     
 <NavCalendario />
     
         {/* Pop up */}
      <ConcluirAgendamentoPop
        dados={agendamentoSelecionado}
        onClose={() => {
          setModalConcluir(false);
          setAgendamentoSelecionado(null);
        }}
        atualizarAgendamentos={carregarAgendamentos} // 👈 aqui
      />

      {modalDetalhes && (
        <VerDetalhesPop
          dados={dadosHistorico}
          onClose={() => {
            setModalDetalhes(false);
            setDadosHistorico(null);
          }}
        />
      )}


      

        {/* TÍTULO */}
        <div className="dash_section_container">
          <h1 className="supertitulo-1">Atendimentos Passados:</h1>
        </div>

        {/* CARD DE ATENDIMENTO */}
        {agendamentos.length > 0 ? (
          agendamentos.map((agendamento, index) => (
        <div key={index} className="dash_section_container">
          <div className="atendimento_passados_card_box card">
            <div className="info_box_atendimento_passados_card_box">
              <p className="paragrafo-1 semibold info">
                <img
                  src={agendamento.usuario.foto == null ? "/src/assets/img/usuario_foto_def.png" : `data:image/jpeg;base64,${agendamento.usuario.foto}`}
                  alt="foto cliente"
                  style={{ height: "45px", borderRadius: "50%" }}
                />

                <a>{agendamento.usuario.nome}</a>
              </p>
              <p className="paragrafo-1 semibold">
                Serviço: {agendamento.servico.nome}
              </p>
              <p className="paragrafo-2 info">
                <img
                  src="/src/assets/svg/time-sharp.svg"
                  alt="icone hora"
                  style={{ height: "24px" }}
                />
                {agendamento.data} {agendamento.inicio}
              </p>

              <div className="atendimentos_passados_infos">
                <p className="paragrafo-2">
                  <a className="semibold">Status:</a>{" "}
                  <i> {agendamento.statusAgendamento.status}</i>
                </p>
                <p className="paragrafo-2">
                  <a className="semibold">Valor:</a> <i>R${agendamento.preco}</i>
                </p>
              </div>
            </div>

            <div className="buttons_box_atendimento_passados_card_box">

             
           {(agendamento.statusAgendamento.status === "PAGAMENTO_PENDENTE" || agendamento.statusAgendamento.status == "AGENDADO") && (
             <button
                className="btn-rosa"
                onClick={() => {
                  setAgendamentoSelecionado(agendamento);
                  setModalConcluir(true);
                }}
              >
                Concluir
              </button>

            )}

              {(agendamento.statusAgendamento.status === "CONCLUIDO" || 
                agendamento.statusAgendamento.status === "CANCELADO") && (
                  <button 
                    className="btn-branco" 
                    onClick={() => {
                      carregarDadosHistorico(agendamento.id)
                      setModalDetalhes(true);
                    }}
                  >
                    Detalhes
                  </button>
              )}

            </div>
          </div>
        </div>
          ))
        ):(
          <p>Sem agendamentos passados</p>
        )}
    </MenuDash>
  );
}


//Colocar na utils
function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}


function ConcluirAgendamentoPop({ dados, onClose, atualizarAgendamentos  }) {
  if (!dados) return null;
  const [valorPago, setValorPago] = useState(""); 
   
  // const dataFormatada = new Date(dados.data).toLocaleDateString('pt-BR');
  const dataFormatada = formatarDataBR(dados.data); 
  return (
    <Popup>
      <>
        <div className="calendario_box_popup_concluir_agendamento">
          <div className="calendario_nome_cliente_box">
            <p className="paragrafo-1">{dados.usuario?.nome}</p>
          </div>
          <div className="calendario_box_info_concluir_agendamento">
            <p><strong>Servico:</strong> {dados.servico.nome}</p>
            <p><img src="/src/assets/svg/time-sharp.svg" alt="" />: {dataFormatada} {dados.inicio} horas</p>  
            <p><strong>Valor:</strong> R${dados.preco}</p>
            <p><strong>Cupom:</strong> {dados.cupom.descricao || "Sem cupom"}</p>
          </div>

          <div className="calendario_box_input_confirmar_agendamento">
            <label htmlFor="">Confirmar valor pago:</label>
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
                 
                  mensagemSucesso("Agendamento concluído com sucesso !")
                  
                  onClose(); // fecha o modal
                  atualizarAgendamentos(); // atualiza a lista no pai
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
      </>
    </Popup>
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
              <p>{formatarDataBR(item.dataHora.split("T")[0])} {item.dataHora.split("T")[1]?.slice(0,5)}h</p>
            </div>
          </div>
        ))}

        <button className="btn-rosa" onClick={onClose}>Voltar</button>
      </div>
    </Popup>
  );
}


// <!DOCTYPE html>
// <html lang="pt-br">

// <head> <!-- UTILIZAR ESSSA HEAD COMO PADRAO PARA AS OUTRAS TELAS -->
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <link rel="stylesheet" href="../../css/main.css" />
//     <script src="../../js/utils/utils_cliente_pages.js"></script>
//     <script src="../../js/api/cliente/cliente.js"></script>
//     <link rel="shortcut icon" href="../../assets/svg/logo_rosa.svg" type="image/x-icon" />
//     <title>Salon Time | Visão Geral</title>
// </head>

// <body>
//     <dev class="dash_section_pai">
//         <!-- COMPONENTE - NAVBAR LATERAL -->
//         <div class="dash_navbar_pai">
//             <div class="dash_navbar_filho">
//                 <img src="../../assets/svg/logo_black.svg" alt="icone" style="max-width: 169px;">
//                 <p class="paragrafo-e bold">Bem vinda Marina!</p>
//                 <div class="dash_navbar_column">
//                     <button class="btn-navbar-ativo" onclick="navegar('./calendario_visao_geral.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_house_filled.svg" alt="">Calendário</button>
//                     <button class="btn-navbar" onclick="navegar('./servicos_servicos.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_tesoura_outline.svg" alt="">Serviços</button>
//                     <button class="btn-navbar" onclick="navegar('./usuarios_clientes.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_user_outline.svg" alt="">Usuários</button>
//                     <button class="btn-navbar" onclick="navegar('./controlem_servicos.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_doc_outline.svg" alt="">Controle Mensal</button>
//                     <button class="btn-navbar" onclick="navegar('./perfil.html')"><img style="max-width: 24px;" 
//                             src="../../assets/svg/nav_dash/icon_smile_outline.svg" alt="">Perfil</button>
//                 </div>
//                 <button onclick="logout()" class="btn-sair"><img style="max-width: 24px;" src="../../assets/svg/nav_config/icon_exit.svg"
//                 alt="">Sair</button>
//             </div>
//         </div>

        
//         <div class="dash_section_filho">

//             <!-- COMPONENTE - MINI -->
//             <div class="mini_nav_pai">
//                 <p class="paragrafo-2 mini_nav_filho" onclick="navegar('./calendario_visao_geral.html')">Visão Geral</p>
//                 <p class="paragrafo-2 mini_nav_filho_ativo" onclick="navegar('./calendario_atendimentos.html')">Atendimentos Passados</p>
//                 <p class="paragrafo-2 mini_nav_filho" onclick="navegar('./calendario_configuracoes.html')">Configurações</p>
//             </div>

//             <div class="dash_section_container">
//                 <h1 class="supertitulo-1">Atendimentos Passados:</h1>
//             </div>

//             <div class="dash_section_container">
//                 <div class="atendimento_passados_card_box card">
//                     <div class="info_box_atendimento_passados_card_box">
//                         <p class="paragrafo-1 semibold info">
//                             <img src="../../assets/svg/perfil_foto.svg" style="height: 45px;">
//                             <a>Nome da Cliente</a>
//                         </p>
//                         <p class="paragrafo-1 semibold">Serviço: Luzes morena iluminada</p>
//                         <p class="paragrafo-2 info"><img src="../../assets/svg/time-sharp.svg" style="height: 24px;">dd/mm/yy 00:00</p>
                        
//                         <div class="atendimentos_passados_infos">
//                             <p class="paragrafo-2"><a class="semibold">Status:</a> <i>Pagamento em Aberto</i></p>
//                             <p class="paragrafo-2"><a class="semibold">Valor:</a> <i>R$000,00</i></p>
//                         </div>
//                     </div>
//                     <div class="buttons_box_atendimento_passados_card_box">
//                         <button class="btn-rosa">Concluir</button>
//                         <button class="btn-branco">Detalhes</button>
//                     </div>
//                 </div>
//             </div>            
//         </div>