import { mensagemErro, mensagemSucesso } from '../utils';

function cadastrarCliente() {

  const nome = document.getElementById("cadastro_form_nome").value;
  const email = document.getElementById("cadastro_form_email").value;
  const telefone = document.getElementById("cadastro_form_telefone").value;
  const senha = document.getElementById("cadastro_form_senha").value;
  const senhaConfirmar = document.getElementById("cadastro_form_confirmar").value;

  const validar = validarCamposCadastro(nome, telefone, email, senha, senhaConfirmar);

  if (validar != true) {
    mensagemErro(validar)
    console.log(validar)
  } else {
    //nome = formatarNomeInput(nome)

    fetch("http://localhost:8080/usuarios/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, senha, telefone })
    })
      .then(resposta => resposta.json())
      .then(dados => {
        mensagemSucesso("Cadastro realizado com sucesso!");
        loginComParametroPosCad(email, senha);
      })
      .catch(erro => {
        console.error("Erro no cadastro:", erro);
        mensagemErro("Erro ao cadastrar. Tente novamente.");
      });

  }

}

function loginComParametroPosCad(email, senha) {

  fetch("http://localhost:8080/usuarios/login", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  })
    .then(resposta => resposta.json())
    .then(dados => {
      if (dados) {

        localStorage.setItem("usuario", JSON.stringify(dados));
        localStorage.setItem('isLoggedIn', '1')

        if (dados.tipoUsuario.descricao == "CLIENTE") {

          console.log("Cliente logado:", dados.nome);
          mensagemSucesso("Login realizado com sucesso!")

          setTimeout(function () {
            window.location.href = "/html/client_pages/servicos.html";
          }, 1500);

        } else if (dados.tipoUsuario.descricao == "FUNCIONARIO" || dados.tipoUsuario.descricao == "ADMINISTRADOR") {
          console.log("Fun ou administrador logado:", dados.nome);
          mensagemSucesso("Login realizado com sucesso!")
          window.location.href = "/html/adm_pages/calendario_visao_geral.html";
        }


        console.log("Usuário logado:", dados.nome);

      } else {
        mensagemErro("E-mail ou senha inválidos.");

      }
    })
    .catch(erro => {
      mensagemErro("E-mail ou senha inválidos.");
      console.error("Erro no login:", erro);
    });
}


// cliente.js
export function login(email, senha, navigate) {


  return fetch("http://localhost:8080/usuarios/login", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  })
    .then(resposta => resposta.json())
    .then(dados => {
      if (dados) {
        localStorage.setItem("usuario", JSON.stringify(dados));
        localStorage.setItem("usuarioLogado", "1");
        
        // if (dados.tipoUsuario.descricao === "CLIENTE") {
        //   console.log("Cliente logado:", dados.nome);

        // } else if (
        //   dados.tipoUsuario.descricao === "FUNCIONARIO" ||
        //   dados.tipoUsuario.descricao === "ADMINISTRADOR"
        // ) {
        //   console.log("Fun ou administrador logado:", dados.nome);
        //   mensagemSucesso("Login realizado com sucesso!");
        //   window.location.href = "/html/adm_pages/calendario_visao_geral.html";
        // }

        if (dados.tipoUsuario.descricao === "CLIENTE") {
          // Espera um tempo se quiser mostrar mensagem
          mensagemSucesso("Login realizado com sucesso!");
          setTimeout(() => {
            navigate("/servicos"); // <- navega para a rota do cliente
          }, 1500);
        } else if (
          dados.tipoUsuario.descricao === "FUNCIONARIO" ||
          dados.tipoUsuario.descricao === "ADMINISTRADOR"
        ) {
          mensagemSucesso("Login realizado com sucesso!");
          setTimeout(() => {
            navigate("/adm/calendario-visao-geral"); // <- navega para a rota do admin
          }, 1500);
        }
      } else {
        mensagemErro("E-mail ou senha inválidos.");
      }
    })
    .catch((erro) => {
      mensagemErro("E-mail ou senha inválidos.");
      console.error("Erro no login:", erro);
    });
}



export function logout(navigate) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  console.log(usuario.id)


  fetch(`http://localhost:8080/usuarios/logoff/${usuario.id}`, {
    method: "PATCH"
  })
    .then(resposta => resposta.json())
    .then(dados => {
      console.log("Limpando console")
      localStorage.clear();
      navigate("/")
    })
    .catch(erro => {
      console.error("Erro no login:", erro);
    });


}