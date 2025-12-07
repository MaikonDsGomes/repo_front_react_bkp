import MenuDash from "../../components/MenuDash"
import NavCalendario from "../../components/NavCalendario"
import Popup from "../../components/Popup";
import { useState, useEffect } from "react";
import { buscarFuncionamento, buscarHorarioExcecao, cadastrarExcecao, editarExcecao, deletarExcecao, editarFuncionamento } from "../../js/api/caio";
import { mensagemErro, mensagemSucesso, formatarDataBR } from "../../js/utils";

export default function Calendario_configuracoes() {

  const [funcionamento, setFuncionamento] = useState([]);
  const [funcionamentoExcecao, setFuncionamentoExcecao] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const [popupEditarPadrao, setPopupEditarPadrao] = useState(false);
  const [popupCadastroExcecao, setPopupCadastroExcecao] = useState(false);
  const [popupEditarExcecao, setPopupEditarExcecao] = useState(false);

  const [excecaoEditando, setExcecaoEditando] = useState(null);
  const [novoHorarioExcecao, setNovoHorarioExcecao] = useState({});
  const [funcionamentoEditando, setFuncionamentoEditando] = useState(null);
  const [novoHorarioPadrao, setNovoHorarioPadrao] = useState({});

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      setUsuario(usuarioObj);
    }
  }, []);

  function listarPadrao(){
    buscarFuncionamento()
        .then(data => {
          if (Array.isArray(data)) {
            // Mantém campo aberto como 0/1
            const adaptado = data.map(item => ({
              ...item,
              aberto: item.aberto === true ? 1 : item.aberto === false ? 0 : item.aberto
            }));
            setFuncionamento(adaptado.filter(item => item.funcionario?.id === usuario.id));
            console.log(adaptado.filter(item => item.funcionario?.id === usuario.id));
          } else {
            setFuncionamento([]);
          }
        })
        .catch(error => {
          console.error("Erro ao carregar horarios de funcionamento:", error);
          setFuncionamento([]);
        });
  }


  useEffect(() => {
    if (usuario && usuario.id) {
      listarPadrao();
    }
  }, [usuario]);
  
  function listarExcecao(){
    buscarHorarioExcecao()
        .then(data => {
          if (Array.isArray(data)) {
            // Mantém campo aberto como 0/1
            const adaptado = data.map(item => ({
              ...item,
              aberto: item.aberto === true ? 1 : item.aberto === false ? 0 : item.aberto
            }));
            setFuncionamentoExcecao(adaptado.filter(item => item.funcionario?.id === usuario.id));
            console.log(adaptado.filter(item => item.funcionario?.id === usuario.id));
          } else {
            setFuncionamentoExcecao([]);
          }
        })
        .catch(error => {
          console.error("Erro ao carregar horarios de exceção:", error);
          setFuncionamentoExcecao([]);
        });
  }

  useEffect(() => {
    if (usuario && usuario.id) {
      listarExcecao();
    }
  }, [usuario]);


  const handleOpenPopupEditarPadrao = (func) => {
    setFuncionamentoEditando(func);
    setNovoHorarioPadrao({ ...func });
    setPopupEditarPadrao(true);
  };
  const handleOpenPopupCadastroExcecao = () => {
    setNovoHorarioExcecao({});
    setPopupCadastroExcecao(true);
  };
  const handleOpenPopupEditarExcecao = (excecao) => {
    setExcecaoEditando(excecao);
    setNovoHorarioExcecao({ ...excecao });
    setPopupEditarExcecao(true);
  };


  const confirmarEdicaoExcecao = async () => {
    const { id, aberto, capacidade, dataInicio, dataFim, inicio, fim } = novoHorarioExcecao;
    const valid = validateHorario(novoHorarioExcecao, "excecao");
    if (!valid.ok) {
      setPopupEditarExcecao(false);
      mensagemErro(valid.mensagem);
      return;
    }
    const dados = {
      ...novoHorarioExcecao,
      capacidade: aberto === 1 ? Number(capacidade) : 0,
      funcionario: { id: usuario.id }
    };
    console.log("Dados para edição de exceção:", dados);
    try {
      await editarExcecao(id, dados);
      setPopupEditarExcecao(false);
      mensagemSucesso("Exceção editada com sucesso!");
      setNovoHorarioExcecao({});
      setExcecaoEditando(null);
      // Atualiza lista após edição
      listarExcecao();
    } catch (error) {
      setPopupEditarExcecao(false);
      mensagemErro("Erro ao editar exceção. Tente novamente mais tarde.");
    }
  };

  const confirmarCadastroExcecao = async () => {
    const valid = validateHorario(novoHorarioExcecao, "excecao");
    if (!valid.ok) {
      setPopupCadastroExcecao(false);
      mensagemErro(valid.mensagem);
      return;
    }
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
      // Atualiza lista após cadastro
      listarExcecao();
    } catch (error) {
      setPopupCadastroExcecao(false);
      mensagemErro("Erro ao cadastrar exceção. Tente novamente mais tarde.");
    }
  };

  const confirmarDelecaoExcecao = async () => {
    if (!novoHorarioExcecao.id) return;
    if (window.confirm("Tem certeza que deseja excluir esta exceção?")) {
      try {
        await deletarExcecao(novoHorarioExcecao.id);
        setPopupEditarExcecao(false);
        mensagemSucesso("Exceção excluída com sucesso!");
        setNovoHorarioExcecao({});
        setExcecaoEditando(null);
        // Atualiza lista após exclusão
        listarExcecao();
      } catch (error) {
        console.error("Erro ao excluir exceção:", error);
        mensagemErro("Erro ao excluir exceção. Tente novamente mais tarde.");
      }
    }
  };

  const confirmarEdicaoPadrao = async () => {
    const valid = validateHorario(novoHorarioPadrao, "padrao");
    if (!valid.ok) {
      setPopupEditarPadrao(false);
      mensagemErro(valid.mensagem);
      return;
    }
    const { id, aberto, capacidade, inicio, fim } = novoHorarioPadrao;
    const dados = {
      ...novoHorarioPadrao,
      capacidade: aberto === 1 ? Number(capacidade) : 0,
      inicio: aberto === 1 ? inicio : null,
      fim: aberto === 1 ? fim : null,
    };
    try {
      await editarFuncionamento(id, dados);
      setPopupEditarPadrao(false);
      mensagemSucesso("Horário padrão editado com sucesso!");
      setNovoHorarioExcecao({});
      setFuncionamentoEditando(null);
      // Atualiza lista após edição
      listarPadrao();
    } catch (error) {
      setPopupEditarPadrao(false);
      mensagemErro("Erro ao editar horário padrão. Tente novamente mais tarde.");
    }
  };


  return (
    <>

      {/* NAVBAR LATERAL */}
      <MenuDash>
        <NavCalendario />

        {/* HORÁRIOS PADRÃO */}
        <div className="dash_section_container">
          <h1 className="titulo-1">Horários Padrão:</h1>
        </div>

        {/* Exemplo de dia da semana (pode repetir para os outros dias) */}
        <div className="dash_section_container">
          {funcionamento.map((func, index) => (
            <HorarioPadrao key={index} {...func} onEditar={() => handleOpenPopupEditarPadrao(func)} />
          ))}
        </div>
        {popupEditarPadrao && funcionamentoEditando && (
          <PopupEditarPadrao
            setPopupEditarPadrao={setPopupEditarPadrao}
            setFuncionamentoEditando={setFuncionamentoEditando}
            setNovoHorarioPadrao={setNovoHorarioPadrao}
            novoHorarioPadrao={novoHorarioPadrao}
            onConfirm={confirmarEdicaoPadrao}
          />
        )}
        {/* HORÁRIOS DE EXCEÇÃO */}
        <div className="dash_section_container horario_excecao_titulo_box">
          <h1 className="subtitulo bold">Horários de Exceção:</h1>
          <button className="btn-rosa" onClick={handleOpenPopupCadastroExcecao}>
            <img
              src="/src/assets/vector/icon_sum/jam-icons/Vector.svg"
              alt=""
            />
            Criar Exceção
          </button>
          {popupCadastroExcecao == true ? (
            <PopupCadastrarExcecao
              novoHorarioExcecao={novoHorarioExcecao}
              setPopupCadastroExcecao={setPopupCadastroExcecao}
              onConfirm={confirmarCadastroExcecao}
              setNovoHorarioExcecao={setNovoHorarioExcecao}
            />
          ) : null}
        </div>

        {/* <p>O post de horario excecao precisa esperar o id como parametro para carregar o funcionario</p> */}

        <div className="dash_section_container">
          {funcionamentoExcecao.length > 0 ? funcionamentoExcecao.map((funcExcecao, index) => (
            <HorarioExcecao key={index} {...funcExcecao} onEditar={() => handleOpenPopupEditarExcecao(funcExcecao)} />
          )) : <p className="paragrafo-2">Nenhum horário de exceção cadastrado.</p>}
        </div>
        {popupEditarExcecao && excecaoEditando && (
          <PopupEditarExcecao
            setPopupEditarExcecao={setPopupEditarExcecao}
            setExcecaoEditando={setExcecaoEditando}
            setNovoHorarioExcecao={setNovoHorarioExcecao}
            novoHorarioExcecao={novoHorarioExcecao}
            onConfirm={confirmarEdicaoExcecao}
            onConfirmDelete={confirmarDelecaoExcecao}
          />
        )}

      </MenuDash >
    </>
  );
}

function HorarioPadrao(funcionamento) {
  return (
    <div className="configuracao_line_box">
      <div className="configuracao_box_info">
        <div style={{minWidth:"190px"}}>
          <p className="paragrafo-1 calendario_config_semana semibold">
            {traduzirDia(funcionamento.diaSemana)}
          </p>
        </div>

        <div className="configuracao_ajuste_gap_box">
          <div>
            <button className={funcionamento.aberto === 1 ? "configuracao_button_verde" : "configuracao_button_vermelho"}>
              {funcionamento.aberto === 1 ? "Aberto" : "Fechado"}
            </button>
          </div>

          <div className="configuracao_capacidade_box">
            <img src="/src/assets/svg/capacidade_icon.svg" alt="" />
            <p>Capacidade: {funcionamento.capacidade ? funcionamento.capacidade : "0"}</p>
          </div>

          <div className="configuracao_horarios_box">
            <div className="configuracao_horario_mini_box">
              <p>{funcionamento.inicio ? funcionamento.inicio : "00:00"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
            <div className="configuracao_seta_cinza_box">
              <img
                src="/src/assets/svg/seta_para_direita_icon.svg"
                alt=""
              />
            </div>
            <div className="configuracao_horario_mini_box">
              <p>{funcionamento.fim ? funcionamento.fim : "00:00"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
          </div>

          <div>
            <a onClick={funcionamento.onEditar}>Editar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupEditarPadrao({ novoHorarioPadrao, setPopupEditarPadrao, onConfirm, setNovoHorarioPadrao, setFuncionamentoEditando }) {
  // Garante que o state seja controlado e editável
  const handleChange = (field, value) => {
    setNovoHorarioPadrao(prev => ({ ...prev, [field]: value }));
  };
  return (
    <Popup>
      <p className="paragrafo-1 semibold">Editar Horário Padrão:</p>
      <div className="line">
        <div className="input_pai">
          <p className="paragrafo-2">Status:</p>
          <select
            name="status"
            className="select"
            style={{ width: '100%' }}
            value={novoHorarioPadrao.aberto !== 1 && novoHorarioPadrao.aberto !== 0 ? "#" : (novoHorarioPadrao.aberto === 1 ? "aberto" : "fechado")}
            onChange={e => handleChange('aberto', e.target.value === "aberto" ? 1 : 0)}
          >
            <option value="" disabled>Selecione uma opção</option>
            <option value="aberto">Aberto</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
        <div className="input_pai">
          <p>Capacidade:</p>
          <input
            type="number"
            name="capacidade"
            className="input"
            placeholder="Digite o número"
            min="0"
            value={novoHorarioPadrao.capacidade === undefined ? '' : novoHorarioPadrao.capacidade}
            onChange={e => handleChange('capacidade', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="line">
        <div className="input_pai">
          <p>Hora Início:</p>
          <input
            type="time"
            name="horaInicio"
            className="input"
            value={novoHorarioPadrao.inicio || ''}
            onChange={e => handleChange('inicio', e.target.value)}
          />
        </div>
        <div className="input_pai">
          <p>Hora Fim:</p>
          <input
            type="time"
            name="horaFim"
            className="input"
            value={novoHorarioPadrao.fim || ''}
            onChange={e => handleChange('fim', e.target.value)}
          />
        </div>
      </div>

      <div className="btn-line">
        <button className="btn-link" onClick={() => { setPopupEditarPadrao(false); setFuncionamentoEditando(null); }}>Cancelar</button>
        <button className="btn-rosa" onClick={onConfirm}>Salvar</button>
      </div>
    </Popup>
  );
}

function HorarioExcecao(funcionamento) {
  return (
    <div className="configuracao_line_execao_box">
      <div className="configuracao_box_info">
        <div className="configuracao_ajuste_gap_box">
          <div>
            <button className={funcionamento.aberto === 1 ? "configuracao_button_verde" : "configuracao_button_vermelho"}>
              {funcionamento.aberto === 1 ? "Aberto" : "Fechado"}
            </button>
          </div>
          <div className="configuracao_capacidade_box">
            <img src="/src/assets/svg/capacidade_icon.svg" alt="" />
            <p>Capacidade: {funcionamento.capacidade ? funcionamento.capacidade : "0"}</p>
          </div>

          <div className="configuracao_horarios_box">
            <div className="configuracao_horario_mini_box">
              <p>{formatarDataBR(funcionamento.dataInicio)  ? formatarDataBR(funcionamento.dataInicio) : "dd/mm/yy"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
            <div className="configuracao_seta_cinza_box">
              <img
                src="/src/assets/svg/seta_para_direita_icon.svg"
                alt=""
              />
            </div>
            <div className="configuracao_horario_mini_box">
              <p>{ formatarDataBR(funcionamento.dataFim) ? formatarDataBR(funcionamento.dataFim) : "dd/mm/yy"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
          </div>

          <div className="configuracao_horarios_box">
            <div className="configuracao_horario_mini_box">
              <p>{funcionamento.inicio ? funcionamento.inicio : "00:00"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
            <div className="configuracao_seta_cinza_box">
              <img
                src="/src/assets/svg/seta_para_direita_icon.svg"
                alt=""
              />
            </div>
            <div className="configuracao_horario_mini_box">
              <p>{funcionamento.fim ? funcionamento.fim : "00:00"}</p>
              <img src="/src/assets/svg/log-in.svg" alt="" />
            </div>
          </div>

          <div>
            <a onClick={funcionamento.onEditar}>Editar</a>
          </div>
        </div>
      </div>
    </div >
  );
}

function PopupCadastrarExcecao({ novoHorarioExcecao, setPopupCadastroExcecao, onConfirm, setNovoHorarioExcecao }) {
  return (
    <Popup>
      <p className="paragrafo-1 semibold">Preencha os campos abaixo:</p>
      <div className="line">
        <div className="input_pai">
          <p className="paragrafo-2">Status:</p>
          <select name="status" id="" className="select" style={{ width: '100%' }} value={novoHorarioExcecao.aberto === undefined ? "" : (novoHorarioExcecao.aberto === 1 ? "aberto" : "fechado")}  onChange={(e) => setNovoHorarioExcecao({ ...novoHorarioExcecao, aberto: e.target.value === "aberto" ? 1 : 0 })}>
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

function PopupEditarExcecao({ novoHorarioExcecao, setPopupEditarExcecao, onConfirm, onConfirmDelete, setNovoHorarioExcecao, setExcecaoEditando }) {

  // Garante que o state seja controlado e editável
  const handleChange = (field, value) => {
    setNovoHorarioExcecao(prev => ({ ...prev, [field]: value }));
  };
  return (
    <Popup>
      <p className="paragrafo-1 semibold">Editar Horário de Exceção:</p>
      <div className="line">
        <div className="input_pai">
          <p className="paragrafo-2">Status:</p>
          <select
            name="status"
            className="select"
            style={{ width: '100%' }}
            value={novoHorarioExcecao.aberto === undefined ? "" : (novoHorarioExcecao.aberto === 1 ? "aberto" : "fechado")}
            onChange={e => handleChange('aberto', e.target.value === "aberto" ? 1 : 0)}
          >
            <option value="" disabled>Selecione uma opção</option>
            <option value="aberto">Aberto</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
        <div className="input_pai">
          <p>Capacidade:</p>
          <input
            type="number"
            name="capacidade"
            className="input"
            placeholder="Digite o número"
            min="0"
            value={novoHorarioExcecao.capacidade === undefined ? 0 : novoHorarioExcecao.capacidade}
            onChange={e => handleChange('capacidade', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="line">
        <div className="input_pai">
          <p>Data Início:</p>
          <input
            type="date"
            name="dataInicio"
            className="input"
            value={novoHorarioExcecao.dataInicio || ''}
            onChange={e => handleChange('dataInicio', e.target.value)}
          />
        </div>
        <div className="input_pai">
          <p>Data Fim:</p>
          <input
            type="date"
            name="dataFim"
            className="input"
            value={novoHorarioExcecao.dataFim || ''}
            onChange={e => handleChange('dataFim', e.target.value)}
          />
        </div>
      </div>

      <div className="line">
        <div className="input_pai">
          <p>Hora Início:</p>
          <input
            type="time"
            name="horaInicio"
            className="input"
            value={novoHorarioExcecao.inicio || ''}
            onChange={e => handleChange('inicio', e.target.value)}
          />
        </div>
        <div className="input_pai">
          <p>Hora Fim:</p>
          <input
            type="time"
            name="horaFim"
            className="input"
            value={novoHorarioExcecao.fim || ''}
            onChange={e => handleChange('fim', e.target.value)}
          />
        </div>
      </div>

      <div className="btn-line">
        <button className="btn-link" onClick={() => setPopupEditarExcecao(false)}>Cancelar</button>
        <button className="btn-vermelho" onClick={onConfirmDelete}>Excluir</button>
        <button className="btn-verde" onClick={onConfirm}>Salvar</button>
      </div>
    </Popup>
  );
}

// Validação centralizada para horários padrão e exceção
function validateHorario(obj, tipo) {
  // tipo: "excecao" ou "padrao"
  const { aberto, capacidade, dataInicio, dataFim, inicio, fim } = obj;

  console.log("Formulario enviado:", obj);
  // Aceita aberto como 0 ou 1
  if ((aberto !== 0 && aberto !== 1) || capacidade < 0 || (aberto === 1 && (!inicio || !fim)))  {
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

const diasSemanaPt = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function traduzirDia(diaIngles) {
  if (!diaIngles) return "";
  return diasSemanaPt[diaIngles.toUpperCase()] || diaIngles;
}