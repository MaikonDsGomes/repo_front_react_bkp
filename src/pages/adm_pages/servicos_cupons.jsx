import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import NavServicos from "../../components/NavServicos";

function CupomCard({ cupom }) {
  return (
    <>
      <div className="dash_servico_servico">
        <div className="dash_servico_servico_nome">
          <h1 className="paragrafo-1 branco semibold">Nome do CUPOM</h1>
        </div>
        <div className="dash_servico_servico_util">
          <div className="dash_servico_servico_descricao">
            <p>Descrição do CUPOM</p>
            <p>Descrição do CUPOM</p>
            <p>Descrição do CUPOM</p>
          </div>
          <div className="dash_servico_cupom">
            <div className="dash_servico_input_pai">
              <p>Data de Início</p>
              <input type="date" className="dash_servico_input_cupom" />
            </div>
            <div className="dash_servico_input_pai">
              <p>Data de Fim</p>
              <input type="date" className="dash_servico_input_cupom" />
            </div>
          </div>
          <div className="dash_servico_servico_info_filho">
            <img src="/src/assets/svg/key.svg" alt="" />
            <p>Código: EXEMPLO 10</p>
          </div>
          <div className="dash_servico_servico_info_filho">
            <img src="/src/assets/svg/cash-sharp.svg" alt="" />
            <p>Desconto: 10%</p>
          </div>
          <div className="dash_servico_servico_button btn-juntos">
            <button className="btn-rosa" style={{ width: "120px"}}>Editar</button>
            <button className="btn-branco" style={{ width: "120px"}}>Desativar</button>
          </div>
        </div>
      </div>
    </>
  )
}


export default function Servicos_cupons() {
  return (
    <>
      <MenuDash>
        {/* COMPONENTE - MINI */}
        <NavServicos />
        <div className="dash_section_container">
          <div className="dash_servico_section_2">
            <h1>Gerenciar CUPONS</h1>
            <button className="btn-rosa">
              <img
                src="/src/assets/vector/icon_sum/jam-icons/Vector.svg"
                alt=""
              />
              Criar CUPOM
            </button>
          </div>
          <div className="dash_servico_servico_pai">
            <CupomCard />
          </div>
        </div>
      </MenuDash>
    </>
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
//     <script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_AQUI"></script>
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
//                     <button class="btn-navbar" onclick="navegar('./calendario_visao_geral.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_house_outline.svg" alt="">Calendário</button>
//                     <button class="btn-navbar-ativo" onclick="navegar('./servicos_servicos.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_tesoura_filled.svg" alt="">Serviços</button>
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
//                 <p class="paragrafo-2 mini_nav_filho" onclick="navegar('./servicos_servicos.html')">Serviços</p>
//                 <p class="paragrafo-2 mini_nav_filho_ativo" onclick="navegar('./servicos_cupons.html')">CUPONS</p>
//             </div>

//             <div class="dash_section_container">
//                 <div class="dash_servico_section_2">
//                     <h1>Gerenciar CUPONS</h1>
//                     <button class="btn-rosa"><img
//                             src="../../assets/vector/icon_sum/jam-icons/outline & logos/Vector.svg" alt="">Criar
//                         CUPOM</button>
//                 </div>
//                 <div class="dash_servico_servico_pai">
//                     <div class="dash_servico_servico">
//                         <div class="dash_servico_servico_nome">
//                             <h1 class="paragrafo-1 branco">Nome do CUPOM</h1>
//                         </div>
//                         <div class="dash_servico_servico_util">
//                             <div class="dash_servico_servico_descricao">
//                                 <p>Descrição do CUPOM</p>
//                                 <p>Descrição do CUPOM</p>
//                                 <p>Descrição do CUPOM</p>
//                             </div>
//                             <div class="dash_servico_cupom">
//                                 <div class="dash_servico_input_pai">
//                                     <p>Data de Início</p>
//                                     <input type="date" class="dash_servico_input_cupom">
//                                 </div>
//                                 <div class="dash_servico_input_pai">
//                                     <p>Data de Fim</p>
//                                     <input type="date" class="dash_servico_input_cupom">
//                                 </div>
//                             </div>
//                             <div class="dash_servico_servico_info_filho">
//                                 <img src="../../assets/svg/key.svg" alt="">
//                                 <p>Código: </p>
//                                 <p>EXEMPLO10</p>
//                             </div>
//                             <div class="dash_servico_servico_info_filho">
//                                 <img src="../../assets/svg/cash-sharp.svg" alt="">
//                                 <p>Desconto: </p>
//                                 <p>10%</p>
//                             </div>
//                             <div class="dash_servico_servico_button btn-juntos">
//                                 <button class="btn-rosa">Editar</button>
//                                 <button class="btn-branco">Desativar</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </dev>
// </body>