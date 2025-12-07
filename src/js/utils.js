
import Swal from 'sweetalert2';

// Util - 1 - Redirecionar para página do botão.
function navegar(path) {
  window.location.href = path;
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function cpfMask(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (!d) return '';
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function phoneMask(value) {
  const d = onlyDigits(value).slice(0, 11); // limitar a 11 dígitos
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  // 11 ou mais -> formato móvel com 5 dígitos no bloco do meio
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

function caretPosFromDigits(newStr, digitsBeforeCursor) {
  if (digitsBeforeCursor <= 0) return 0;
  let digitsSeen = 0;
  for (let i = 0; i < newStr.length; i++) {
    if (/\d/.test(newStr[i])) digitsSeen++;
    if (digitsSeen === digitsBeforeCursor) return i + 1;
  }
  return newStr.length;
}

function setCaretPosition(el, pos) {
  try {
    el.setSelectionRange(pos, pos);
  } catch (e) {
  
  }
}

function attachMask(input, type) {
  if (!input || !('addEventListener' in input)) {
    throw new Error('attachMask: primeiro argumento precisa ser um input HTML');
  }
  const masker = type === 'cpf' ? cpfMask : type === 'phone' ? phoneMask : null;
  if (!masker) throw new Error("attachMask: 'type' precisa ser 'cpf' ou 'phone'");

  function onInput(e) {
    const el = e.target;
    const oldValue = el.value;
    const selectionStart = el.selectionStart || 0;

    // Quantos dígitos existiam antes do cursor na string antiga
    const digitsBeforeCursor = onlyDigits(oldValue.slice(0, selectionStart)).length;

    const newValue = masker(oldValue);
    el.value = newValue;

    // Calcula nova posição do cursor (baseada em dígitos)
    const newPos = caretPosFromDigits(newValue, digitsBeforeCursor);
    setCaretPosition(el, newPos);
  }

  // Limpar colagens: se o usuário colar, aplica a máscara completa
  function onPaste(e) {
    // delay para que o valor atualizado esteja disponível
    setTimeout(() => {
      input.value = masker(input.value);
    }, 0);
  }

  input.addEventListener('input', onInput);
  input.addEventListener('paste', onPaste);

  // Retorna função para remover os listeners caso necessário
  return () => {
    input.removeEventListener('input', onInput);
    input.removeEventListener('paste', onPaste);
  };
}

// export default { cpfMask, phoneMask, attachMask };

// Util - 2 - Formatar nome (Letra Maiúscula).
function formatarNomeInput(inputElement) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Util - 3 - Validar confirmação de senha.
function validarSenha(senha1, senha2) {
  if (senha1 = senha2) {
    return 'As senhas coincidem.'
  } else {
    return 'As senhas não coincidem'
  }
}

// Util - 4 - Chamar Pop Up
function abrirPopUp(elemento1, elemento2) {
  elemento1.style.display = 'none';
  elemento2.style.display = 'block';
}



function validarCamposCadastro(nome, telefone, email, senha, senhaConfirmar) {

  const regexTelefone = /^[0-9]{11}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nome.length === 0 || nome.length > 50) {
    return "O nome deve ter entre 1 e 50 caracteres.";
  }

  if (telefone.length != 11) {
    return "O telefone deve conter exatamente 11 dígitos numéricos.";
  }

  if (!regexEmail.test(email)) {
    return "E-mail inválido.";
  }

  if (senha.length === 0 || senha.length > 30) {
    return "A senha deve ter entre 1 e 30 caracteres.";
  }

  if (senha !== senhaConfirmar) {
    return "As senhas não coincidem.";
  }
  return true;
}

function verificarLoginIndex() {
  const status = localStorage.getItem('isLoggedIn');

  const btn_entrar = document.getElementById('btn_entrar');
  const btn_cadastrar = document.getElementById('btn_cadastrar');
  const btn_config = document.getElementById('btn_perfil');


  if (status == "1") {
    btn_entrar.style.display = 'none';
    btn_cadastrar.style.display = 'none';

    btn_config.style.display = 'flex';

  } else {
    btn_entrar.style.display = 'flex';
    btn_cadastrar.style.display = 'flex';
    btn_config.style.display = 'none';
  }

}

function verificarLoginServicos() {
  const status = localStorage.getItem('isLoggedIn');

  const btn_entrar = document.getElementById('btn_entrar');
  const btn_cadastrar = document.getElementById('btn_cadastrar');
  const btn_config = document.getElementById('btn_perfil');

  const section_home_servicos = document.getElementById('section_home_servicos');
  const section_proximos_atendimentos = document.getElementById('section_proximos_atendimentos');
  const section_marina_points = document.getElementById('section_marina_points');

  if (status == "1") {
    btn_entrar.style.display = 'none';
    btn_cadastrar.style.display = 'none';
    section_home_servicos.style.display = 'none';

    btn_config.style.display = 'flex';
    section_proximos_atendimentos.style.display = 'flex';
    section_marina_points.style.display = 'flex';
  } else {
    btn_entrar.style.display = 'flex';
    btn_cadastrar.style.display = 'flex';
    section_home_servicos.style.display = 'flex';

    btn_config.style.display = 'none';
    section_proximos_atendimentos.style.display = 'none';
    section_marina_points.style.display = 'none';
  }
}

// Util - 6 - Formatar data para padrão brasileiro (DD/MM/YYYY)
function formatarDataBR(data) {
  if (!data) return "Data inválida";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}


function mensagemErro(mensagem) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: mensagem,
  });
}
function mensagemSucesso(mensagem) {
  Swal.fire({
    title: mensagem,
    icon: "success",
    showConfirmButton: false,
    timer: 1500
  });
}

export {
  navegar,
  formatarDataBR,
  formatarNomeInput,
  validarSenha,
  abrirPopUp,
  cpfMask,
  phoneMask,
  attachMask,
  onlyDigits,
  validarCamposCadastro,
  verificarLoginIndex,
  verificarLoginServicos,
  mensagemErro,
  mensagemSucesso
}