import React from "react";
import MenuDash from "../../components/MenuDash";

export default function Perfil() {
  return (
    <>
      <MenuDash>
       
          {/* Navbar lateral já está dentro do MenuDash */}

          
            {/* Dados pessoais */}
            <div className="dash_section_container">
              <div className="perfil_pai_box">
                <h1 className="supertitulo-1">Dados pessoais:</h1>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_nome_inp">Nome completo</label>
                  <input
                    id="inp_nome_inp"
                    placeholder="Digite seu nome completo"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_email_inp">Endereço de e-mail</label>
                  <input
                    id="inp_email_inp"
                    placeholder="Digite seu endereço de e-mail"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_tel_inp">Número de telefone</label>
                  <input
                    id="inp_tel_inp"
                    placeholder="Digite seu número de telefone"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_cpf_inp">CPF</label>
                  <input
                    id="inp_cpf_inp"
                    placeholder="Digite seu CPF"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <input className="btn-rosa" type="button" value="Atualizar" />
                </div>
              </div>
            </div>

            {/* Alterar senha */}
            <div className="dash_section_container">
              <div className="perfil_pai_box">
                <h1 className="supertitulo-1">Alterar senha:</h1>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_senha_inp">Senha atual</label>
                  <input
                    id="inp_senha_inp"
                    placeholder="Digite sua senha atual"
                    type="password"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_nova_senha_inp">Nova senha</label>
                  <input
                    id="inp_nova_senha_inp"
                    placeholder="Digite sua nova senha"
                    type="password"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_nova_senha_confirmacao_inp">
                    Confirmar nova senha
                  </label>
                  <input
                    id="inp_nova_senha_confirmacao_inp"
                    placeholder="Digite sua nova senha novamente"
                    type="password"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <input className="btn-rosa" type="button" value="Atualizar" />
                </div>
              </div>
            </div>

            {/* Informações do Salão */}
            <div className="dash_section_container">
              <div className="perfil_pai_box">
                <h1 className="supertitulo-1">Informações do Salão</h1>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_nome_salao_inp">Nome completo</label>
                  <input
                    id="inp_nome_salao_inp"
                    placeholder="Digite nome do salão"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_email_salao_inp">Endereço de e-mail</label>
                  <input
                    id="inp_email_salao_inp"
                    placeholder="Digite email do salão"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_numero_tel_salao_inp">
                    Número de telefone
                  </label>
                  <input
                    id="inp_numero_tel_salao_inp"
                    placeholder="Digite o número de telefone do salão"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_duplo_box perfil_log_box">
                  <div className="perfil_label_inp_duplo perfil_log">
                    <label htmlFor="inp_logradouro_salao_inp">Logradouro</label>
                    <input
                      id="inp_logradouro_salao_inp"
                      placeholder="Digite o logradouro do salão"
                      type="text"
                    />
                  </div>

                  <div className="perfil_label_inp_duplo perfil_num">
                    <label htmlFor="inp_numero_salao_inp">Número</label>
                    <input
                      id="inp_numero_salao_inp"
                      placeholder="Digite o número do salão"
                      type="text"
                    />
                  </div>
                </div>

                <div className="perfil_label_inp_duplo_box perfil_meio_meio_box">
                  <div className="perfil_label_inp_duplo">
                    <label htmlFor="inp_cidade_salao_inp">Cidade</label>
                    <input
                      id="inp_cidade_salao_inp"
                      placeholder="Digite a cidade onde o salão está"
                      type="text"
                    />
                  </div>

                  <div className="perfil_label_inp_duplo">
                    <label htmlFor="inp_estado_salao_inp">Estado</label>
                    <input
                      id="inp_estado_salao_inp"
                      placeholder="Digite o estado onde o salão está"
                      type="text"
                    />
                  </div>
                </div>

                <div className="perfil_label_inp_box">
                  <label htmlFor="inp_complemento_salao_inp">Complemento</label>
                  <input
                    id="inp_complemento_salao_inp"
                    placeholder="Digite o complemento do logradouro"
                    type="text"
                  />
                </div>

                <div className="perfil_label_inp_box">
                  <input className="btn-rosa" type="button" value="Atualizar" />
                </div>
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
//     <title>Salon Time | Perfil</title>
// </head>

// <body>
//     <dev class="dash_section_pai">
//         <!-- COMPONENTE - NAVBAR LATERAL -->
//         <div class="dash_navbar_pai">
//             <div class="dash_navbar_filho">
//                 <img src="../../assets/svg/logo_black.svg" alt="icone" style="max-width: 169px;">
//                 <p class="paragrafo-e bold">Bem vinda Marina!</p>
//                 <div class="dash_navbar_column">
//                     <button class="btn-navbar" onclick="navegar('./calendario_visao_geral.html')"><img
//                             style="max-width: 24px;" src="../../assets/svg/nav_dash/icon_house_outline.svg"
//                             alt="">Calendário</button>
//                     <button class="btn-navbar" onclick="navegar('./servicos_servicos.html')"><img
//                             style="max-width: 24px;" src="../../assets/svg/nav_dash/icon_tesoura_outline.svg"
//                             alt="">Serviços</button>
//                     <button class="btn-navbar" onclick="navegar('./usuarios_clientes.html')"><img
//                             style="max-width: 24px;" src="../../assets/svg/nav_dash/icon_user_outline.svg"
//                             alt="">Usuários</button>
//                     <button class="btn-navbar" onclick="navegar('./controlem_servicos.html')"><img
//                             style="max-width: 24px;" src="../../assets/svg/nav_dash/Icon_doc_outline.svg" alt="">Controle
//                         Mensal</button>
//                     <button class="btn-navbar-ativo" onclick="navegar('./perfil.html')"><img style="max-width: 24px;"
//                             src="../../assets/svg/nav_dash/icon_smile_filled.svg" alt="">Perfil</button>
//                 </div>
//                 <button onclick="logout()" class="btn-sair"><img style="max-width: 24px;"
//                         src="../../assets/svg/nav_config/icon_exit.svg" alt="">Sair</button>
//             </div>
//         </div>

//         </div>
//         <div class="dash_section_filho">

//             <div class="dash_section_container">
//                 <div class="perfil_pai_box">
//                     <h1 class="supertitulo-1">Dados pessoais:</h1>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_nome_inp">Nome completo</label>
//                         <input id="inp_nome_inp" placeholder="Digite seu nome completo" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_email_inp">Endereço de e-mail</label>
//                         <input id="inp_email_inp" placeholder="Digite seu endereço de e-mail" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_tel_inp">Número de telefone</label>
//                         <input id="inp_tel_inp" placeholder="Digite seu número de telefone" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_cpf_inp">CPF</label>
//                         <input id="inp_cpf_inp" placeholder="Digite seu CPF" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <input class="btn-rosa" type="button" value="Atualizar">
//                     </div>
//                 </div>
//             </div>

//             <div class="dash_section_container">
//                 <div class="perfil_pai_box">
//                     <h1 class="supertitulo-1">Alterar senha:</h1>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_senha_inp">Senha atual</label>
//                         <input id="inp_senha_inp" placeholder="Digite sua senha atual" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_nova_senha_inp">Nova senha</label>
//                         <input id="inp_nova_senha_inp" placeholder="Digite sua nova senha" type="password">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_nova_senha_confirmacao_inp">Confirmar nova senha</label>
//                         <input id="inp_nova_senha_confirmacao_inp" placeholder="Digite sua nova senha novamente"
//                             type="password">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <input class="btn-rosa" type="button" value="Atualizar">
//                     </div>
//                 </div>
//             </div>

//             <div class="dash_section_container">
//                 <div class="perfil_pai_box">
//                     <h1 class="supertitulo-1">Informações do Salão</h1>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_nome_salao_inp">Nome completo</label>
//                         <input id="inp_nome_salao_inp" placeholder="Digite nome do salão" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_email_salao_inp">Endereço de e-mail</label>
//                         <input id="inp_email_salao_inp" placeholder="Digite email do salão" type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_numero_tel_salao_inp">Número de telefone</label>
//                         <input id="inp_numero_tel_salao_inp" placeholder="Digite o número de telefone do salão"
//                             type="text">
//                     </div>
//                     <div class="perfil_label_inp_duplo_box perfil_log_box">
//                         <div class="perfil_label_inp_duplo perfil_log">
//                             <label for="inp_logradouro_salao_inp">Logradouro</label>
//                             <input id="inp_logradouro_salao_inp" placeholder="Digite o logradouro do salão" type="text">
//                         </div>
//                         <div class="perfil_label_inp_duplo perfil_num">
//                             <label for="inp_numero_salao_inp">Número</label>
//                             <input id="inp_numero_salao_inp" placeholder="Digite o número do salão" type="text">
//                         </div>
//                     </div>
//                     <div class="perfil_label_inp_duplo_box perfil_meio_meio_box">
//                         <div class="perfil_label_inp_duplo">
//                             <label for="inp_cidade_salao_inp">Cidade</label>
//                             <input id="inp_cidade_salao_inp" placeholder="Digite a cidade onde o salão está"
//                                 type="text">
//                         </div>
//                         <div class="perfil_label_inp_duplo">
//                             <label for="inp_estado_salao_inp">Estado</label>
//                             <input id="inp_estado_salao_inp" placeholder="Digite o estado onde o salão está"
//                                 type="text">
//                         </div>
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <label for="inp_complemento_salao_inp">Complemento</label>
//                         <input id="inp_complemento_salao_inp" placeholder="Digite o complemento do logradouro"
//                             type="text">
//                     </div>
//                     <div class="perfil_label_inp_box">
//                         <input class="btn-rosa" type="button" value="Atualizar">
//                     </div>
//                 </div>
//             </div>

//         </div>