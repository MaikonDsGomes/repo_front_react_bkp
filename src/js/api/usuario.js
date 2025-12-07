import { mensagemErro, mensagemSucesso, validarCamposCadastro } from '../utils';

export function cadastrarCliente(form, navigate) {

  const nome = form.nome;
  const email = form.email;
  const telefone = form.telefone;
  const senha = form.senha;
  const senhaConfirmar = form.confirmar;

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
      .then(resposta => {
        if (resposta.status === 400) {
          mensagemErro("Usuário já cadastrado");
          throw new Error("Usuário já cadastrado");
        }
        return resposta.json();
      })
      .then(dados => {
        mensagemSucesso("Cadastro realizado com sucesso!");
        setTimeout(() => {
          login(email, senha, navigate, true);
        }, 1500);
      })
      .catch(erro => {
        console.error("Erro no cadastro:", erro);
        if (erro.message !== "Usuário já cadastrado") {
          mensagemErro("Erro ao cadastrar. Tente novamente.");
        }
      });


  }

}

export function login(email, senha, navigate, posCadastro = false) {

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

        if (dados.tipoUsuario.descricao === "CLIENTE") {
          // Espera um tempo se quiser mostrar mensagem
          if (posCadastro == false) {
            mensagemSucesso("Login realizado com sucesso!");
          }
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