import MenuDash from "../../components/MenuDash"
import NavCalendario from "../../components/NavCalendario"
import Popup from "../../components/Popup";
import { useState, useEffect } from "react";
import { buscarFuncionamento, buscarHorarioExcecao } from "../../js/api/caio";

function HorarioPadrao(funcionamento) {
  return (
    <div className="configuracao_line_box">
      <div className="configuracao_box_info">
        <div>
          <p className="paragrafo-1 calendario_config_semana semibold">
            {funcionamento.diaSemana}
          </p>
        </div>

        <div className="configuracao_ajuste_gap_box">
          <div>
            <button className={funcionamento.aberto == 1 ? "configuracao_button_verde" : "configuracao_button_vermelho"}>
              {funcionamento.aberto == 1 ? "Aberto" : "Fechado"}
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
            <a href="#">Editar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorarioExcecao(funcionamento) {
  return (
    <div className="configuracao_box_info">
      <div className="configuracao_ajuste_gap_box">
        <div>
          <button className={funcionamento.aberto == 1 ? "configuracao_button_verde" : "configuracao_button_vermelho"}>
            {funcionamento.aberto == 1 ? "Aberto" : "Fechado"}
          </button>
        </div>
        <div className="configuracao_capacidade_box">
          <img src="/src/assets/svg/capacidade_icon.svg" alt="" />
          <p>Capacidade: {funcionamento.capacidade ? funcionamento.capacidade : "0"}</p>
        </div>

        <div className="configuracao_horarios_box">
          <div className="configuracao_horario_mini_box">
            <p>{funcionamento.dataInicio ? funcionamento.dataInicio : "dd/mm/yy"}</p>
            <img src="/src/assets/svg/log-in.svg" alt="" />
          </div>
          <div className="configuracao_seta_cinza_box">
            <img
              src="/src/assets/svg/seta_para_direita_icon.svg"
              alt=""
            />
          </div>
          <div className="configuracao_horario_mini_box">
            <p>{funcionamento.dataFim ? funcionamento.dataFim : "dd/mm/yy"}</p>
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
          <a href="#">Editar</a>
        </div>
      </div>
    </div>
  );
}

export default function Calendario_configuracoes() {
  const [funcionamento, setFuncionamento] = useState([]);
  const [funcionamentoExcecao, setFuncionamentoExcecao] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [popupCadastroExcecao, setPopupCadastroExcecao] = useState(false);
  const [novoHorarioExcecao, setNovoHorarioExcecao] = useState({});

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      setUsuario(usuarioObj);
    }
  }, []);

  useEffect(() => {
    if (usuario && usuario.id) {
      buscarFuncionamento()
        .then(data => {
          if (Array.isArray(data)) {
            setFuncionamento(data.filter(item => item.funcionario?.id === usuario.id));
          } else {
            setFuncionamento([]);
          }
        })
        .catch(error => {
          console.error("Erro ao carregar horarios de funcionamento:", error);
          setFuncionamento([]);
        });
    }
  }, [usuario]);

  const handleOpenPopupCadastroExcecao = () => {
    setPopupCadastroExcecao(true);
  };

  const confirmarCadastroExcecao = () => {
    try {
      cadastrarExcecao(novoHorarioExcecao);
      mensagemSucesso(`Exceção cadastrada com sucesso!`)
    } catch (error) {
      mensagemErro("Erro ao cadastrar exceção. Tente novamente mais tarde.");
      return
    }
    setPopupCadastroExcecao(false);
  }

  useEffect(() => {
    if (usuario && usuario.id) {
      buscarHorarioExcecao()
        .then(data => {
          if (Array.isArray(data)) {
            // setFuncionamentoExcecao(data.filter(item => item.funcionario?.id === usuario.id));
            setFuncionamentoExcecao(data);
          } else {
            setFuncionamentoExcecao([]);
          }
        })
        .catch(error => {
          console.error("Erro ao carregar horarios de excecao:", error);
          setFuncionamentoExcecao([]);
        });
    }
  }, [usuario]);

  return (
    <>

      {/* NAVBAR LATERAL */}
      <MenuDash>
        <NavCalendario />

        {/* HORÁRIOS PADRÃO */}
        <div className="dash_section_container">
          <h1 className="supertitulo-1">Horários Padrão:</h1>
        </div>

        {/* Exemplo de dia da semana (pode repetir para os outros dias) */}
        <div className="dash_section_container">
          {funcionamento.map((func, index) => (
            <HorarioPadrao key={index} {...func} />
          ))}
        </div>
        {/* HORÁRIOS DE EXCEÇÃO */}
        <div className="dash_section_container horario_excecao_titulo_box">
          <h1>Horários de Exceção:</h1>
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
            />
          ) : null}
        </div>

        <div className="dash_section_container">
          <div className="configuracao_line_execao_box">
            {funcionamentoExcecao.map((funcExcecao, index) => (
              <HorarioExcecao key={index} {...funcExcecao} />
            ))}
          </div>
        </div>

      </MenuDash >
    </>
  );
}

function PopupCadastrarExcecao({ novoHorarioExcecao, setPopupCadastroExcecao }) {
  return(
    <Popup>
      <p className="paragrafo-1 semibold">Preencha os campos abaixo:</p>
      <div className="btn-juntos">
        <button className="btn-rosa" onClick={() => cadastrarExcecao(novoHorarioExcecao)}>Concluir</button>
        <button className="btn-branco" onClick={() => setPopupCadastroExcecao(false)}>Cancelar</button>
      </div>
    </Popup>
  );
}