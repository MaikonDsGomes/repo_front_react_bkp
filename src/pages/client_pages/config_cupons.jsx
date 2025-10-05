
import MenuConfig from "/src/components/MenuConfig.jsx";

function CardCupom({ titulo, descricao, codigo, desconto, usos }) {
  return (
    <div className="card_cupom">
      <div className="superiro">
        <p className="titulo paragrafo-2">{titulo}</p>
        <p className="descricao">{descricao}</p>
        <hr />
      </div>
      <div className="inferior">
        <div className="info_cupom_box">
          <p className="paragrafo-2">
            <img src="/src/assets/svg/key.svg" alt="" /> Código: {codigo}
          </p>
          <p className="paragrafo-2">
            <img src="/src/assets/svg/cash-sharp.svg" alt="" /> Desconto: {desconto}
          </p>
          <p className="">
            <img src="/src/assets/svg/refresh-cw.svg" alt="" />Usos disponíveis: {usos}
          </p>
        </div>
      </div>
    </div>
  );
}


export default function Config_cupons() {
  const lista = [
    {
      titulo: "Primeira compra!",
      descricao: "Bem vinda a Salon Time! Esse é o nosso presentinho por ter se cadastrado no site :)",
      codigo: "EXEMPLO10",
      desconto: "10%",
      usos: 1,
    },
    {
      titulo: "Indique uma amiga!",
      descricao: "Ganhe desconto indicando uma amiga para a Salon Time.",
      codigo: "AMIGA20",
      desconto: "20%",
      usos: 2,
    },
  ];

  return (
    <MenuConfig>
      <h1>CUPONS Disponíveis:</h1>
      <p className="paragrafo-1 desc_principal">
        Lembre-se de manter os dados de perfil sempre atualizados! Assim você tem mais chances de receber um desconto!
      </p>
      <div className="cards_pai">
        {lista.map((item, idx) => (
          <CardCupom key={idx} {...item} />
        ))}
      </div>
    </MenuConfig>
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
//     <title>Salon Time | Perfil</title>
// </head>

// <body>

//     <!-- NAVBAR INSTITUCIONAL -->
//     <nav class="nav_institucional_pai">
//         <div class="nav_institucional_coluna">
//             <p class="paragrafo-2 underline-hover" onclick="navegar('./index.html')">Página Inicial</p>
//             <p class="paragrafo-2 underline-hover" onclick="navegar('./servicos.html')">Serviços</p>
//         </div>
//         <div class="nav_institucional_coluna">
//             <img src="../../assets/svg/logo_black.svg" alt="logo" style="height: 50px;">
//         </div>
//         <div class="nav_institucional_coluna">
//             <button class="btn-rosa" onclick="navegar('./servicos.html')" style="min-width: 110px;">Voltar</button>
//         </div>
//     </nav>

//     <dev class="config_section_pai">
//         <!-- COMPONENTE - NAVBAR LATERAL -->
//         <div class="config_navbar_pai">
//             <div class="config_navbar_filho">
//                 <div class="config_navbar_column">
//                     <button class="btn-navbar" onclick="navegar('./config_perfil.html')">
//                             <img style="max-width: 24px;" src="../../assets/svg/nav_config/icon_home.svg"
//                             alt="">Perfil</button>
//                     <button class="btn-navbar" onclick="navegar('./config_historico.html')">
//                             <img style="max-width: 24px;" src="../../assets/svg/nav_config/icon_folders.svg"
//                             alt="">Meu Histórico</button>
//                     <button class="btn-navbar-ativo" onclick="navegar('./config_cupons.html')">
//                             <img style="max-width: 24px;" src="../../assets/svg/nav_config/icon_cupom.svg"
//                             alt="">CUPONS</button>
//                 </div>
//                 <button onclick="logout()" class="btn-sair"><img style="max-width: 24px;" src="../../assets/svg/nav_config/icon_exit.svg"
//                         alt="">Sair</button>
//             </div>
//         </div>

//         <div class="config_section_filho">

//             <h1>CUPONS Disponíveis:</h1>


//             <p class="paragrafo-1 desc_principal">Lembre-se de manter os dados de perfil sempre atualizados! Assim você
//                 tem mais chances de receber um desconto!</p>

//             <div class="cards_pai">
//                 <div class="card_cupom">
//                     <div class="superiro">
//                         <p class="titulo paragrafo-2">Primeira compra!</p>
//                         <p class="descricao">Bem vinda a Salon Time! Esse é o nosso presentinho por ter se cadastrado no
//                             site :)</p>
//                         <hr>
//                     </div>
//                     <div class="inferior">
//                         <div class="info_cupom_box">
//                             <p class="paragrafo-2"><img src="../../assets/svg/key.svg" alt=""> Código: EXEMPLO10</p>
//                             <p class="paragrafo-2"><img src="../../assets/svg/cash-sharp.svg" alt=""> Desconto: 10%</p>
//                             <p class=""><img src="../../assets/svg/refresh-cw.svg" alt="">Usos disponíveis: 1</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="card_cupom">
//                     <div class="superiro">
//                         <p class="titulo paragrafo-2">Primeira compra!</p>
//                         <p class="descricao">Bem vinda a Salon Time! Esse é o nosso presentinho por ter se cadastrado no
//                             site :)</p>
//                         <hr>
//                     </div>
//                     <div class="inferior">
//                         <div class="info_cupom_box">
//                             <p class="paragrafo-2"><img src="../../assets/svg/key.svg" alt=""> Código: EXEMPLO10</p>
//                             <p class="paragrafo-2"><img src="../../assets/svg/cash-sharp.svg" alt=""> Desconto: 10%</p>
//                             <p class=""><img src="../../assets/svg/refresh-cw.svg" alt="">Usos disponíveis: 1</p>
//                         </div>
//                     </div>
//                 </div>


//             </div>
//         </div>
//     </dev>
//     <!-- COMPONENTE FOOTER -->
//     <footer class="footer_pai">
//         <div class="footer_linha1">
//             <img src="../../assets/svg/logo_white.svg" alt="logo" style="height: 45px;">
//             <div class="footer_linha1_social">
//                 <img src="../../assets/svg/icon_facebook.svg" alt="icon-social">
//                 <img src="../../assets/svg/icon_instagram3.svg" alt="icon-social">
//                 <img src="../../assets/svg/icon_linkedin.svg" alt="icon-social">
//             </div>
//         </div>
//         <div class="footer_linha2"></div>
//         <p class="paragrafo-2" style="color: var(--rosa-4);">@Copyright2025 Todos os direitos reservados.</p>
//     </footer>

// </body>

// </html>