import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import NavServicos from "../../components/NavServicos";
import { buscarServicos, atualizarServico, buscarFuncionariosCompetentes } from "../../js/api/elerson.js";
import InfoCard from "../../components/InfoCard.jsx";
import Popup from "../../components/Popup.jsx";

export default function Servicos_servicos() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Formatar o tempo (00:45:00 -> 45min)
  const formatarTempo = (tempo) => {
    if (!tempo) return "";
    const [horas, minutos] = tempo.split(':').map(Number);
    if (horas > 0) {
      return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
    } else {
      return `${minutos}min`;
    }
  };

  // Formatar preço (40 -> R$ 40,00)
  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  // Handlers for button actions
  const handleEditService = (id) => {
    const servico = servicos.find(s => s.id === id);
    setServicoSelecionado(servico);
    setModalAberto(true);
  };

  const handleToggleServiceStatus = async (id) => {
    try {
      // Toggle service status (ATIVO/INATIVO)
      const servicosAtualizados = servicos.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === "ATIVO" ? "INATIVO" : "ATIVO"
          };
        }
        return s;
      });
      setServicos(servicosAtualizados);

      // API call to update status would go here
      // Example: await atualizarStatusServico(id, novoStatus);

    } catch (error) {
      console.error("Erro ao atualizar status do serviço:", error);
    }
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setServicoSelecionado(null);
  };

  // Handler for after a service is successfully updated
  const handleServicoAtualizado = (servicoAtualizado) => {
    setServicos(servicos.map(s =>
      s.id === servicoAtualizado.id ? servicoAtualizado : s
    ));
    handleCloseModal();
  };

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        setLoading(true);
        const dados = await buscarServicos();
        setServicos(dados);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarServicos();
  }, []);

  return (
    <>
      <MenuDash>
        <NavServicos />

        <div className="dash_section_container">
          <div className="dash_servico_section_2">
            <h1>Gerenciar Serviços</h1>
            <button className="btn-rosa" onClick={() => navigate("/adm/servicos/novo")}>
              <img
                src="/src/assets/vector/icon_sum/jam-icons/Vector.svg"
                alt=""
              />
              Criar Serviço
            </button>
          </div>

          <div className="dash_servico_servico_pai">
            {loading ? (
              <p>Carregando serviços...</p>
            ) : servicos.length > 0 ? (
              servicos.map((servico) => (
                <InfoCard
                  key={servico.id}
                  title={servico.nome}
                  description={servico.descricao}
                  infoItems={[
                    {
                      icon: "/src/assets/svg/time-sharp.svg",
                      label: "Tempo médio: ",
                      value: formatarTempo(servico.tempo)
                    },
                    {
                      icon: "/src/assets/svg/cash-sharp.svg",
                      label: "A partir de: R$",
                      value: formatarPreco(servico.preco)
                    },
                    {
                      icon: "/src/assets/svg/flag-sharp.svg",
                      label: "Status: ",
                      value: servico.simultaneo ? "Simultâneo" : "Individual"
                    },
                    {
                      icon: "/src/assets/svg/star.svg",
                      label: "Avaliação: ",
                      value: servico.mediaAvaliacao > 0
                        ? `${servico.mediaAvaliacao.toFixed(1)} / 5.0`
                        : "Sem avaliação"
                    }
                  ]}
                  buttons={{
                    primary: { text: "Editar", width: "120px" },
                    secondary: {
                      text: servico.status === "ATIVO" ? "Desativar" : "Ativar",
                      width: "120px",
                      dynamic: true,
                      condition: servico.status === "ATIVO"
                    }
                  }}
                  onPrimaryClick={() => handleEditService(servico.id)}
                  onSecondaryClick={() => handleToggleServiceStatus(servico.id)}
                />
              ))
            ) : (
              <p>Nenhum serviço encontrado.</p>
            )}
          </div>
        </div>
      </MenuDash>

      {modalAberto && servicoSelecionado && (
        <EditarServico
          servico={servicoSelecionado}
          onClose={handleCloseModal}
          onSave={handleServicoAtualizado}
        />
      )}
    </>
  );
}

function EditarServico({ servico, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: servico?.nome || "",
    descricao: servico?.descricao || "",
    tempo: servico?.tempo || "",
    status: servico?.status || "ATIVO",
    preco: servico?.preco || 0,
    simultaneo: servico?.simultaneo || false,
    profissionais: [] // Inicialmente vazio, será preenchido pelo efeito
  });
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState([]);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(true);

  // Efeito para carregar profissionais competentes
  useEffect(() => {
    const carregarProfissionais = async () => {
      try {
        setCarregandoProfissionais(true);
        // Buscar funcionários competentes para este serviço
        const funcionariosData = await buscarFuncionariosCompetentes(servico.id);

        // Mapear os dados para ter apenas as informações necessárias
        const funcionariosFormatados = funcionariosData.map(item => ({
          id: item.funcionario.id,
          nome: item.funcionario.nome,
          foto: item.funcionario.foto !== "null" ? item.funcionario.foto : '/src/assets/img/default-user.png'
          // Removido a propriedade selecionado
        }));

        // Definir funcionários disponíveis
        setProfissionaisDisponiveis(funcionariosFormatados);

        // Atualizar formData com IDs dos profissionais vinculados
        setFormData(prev => ({
          ...prev,
          profissionais: funcionariosFormatados.map(f => f.id) // Armazene apenas os IDs
        }));
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      } finally {
        setCarregandoProfissionais(false);
      }
    };

    if (servico?.id) {
      carregarProfissionais();
    }
  }, [servico?.id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "simultaneo" ? value === "true" : value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFotoSelecionada(e.target.files[0]);
    }
  };

  const toggleProfissional = (profissionalId) => {
    setFormData(prev => {
      // Verifica se o ID já existe no array de profissionais
      const jaSelecionado = prev.profissionais.includes(profissionalId);

      if (jaSelecionado) {
        // Remove o ID
        return {
          ...prev,
          profissionais: prev.profissionais.filter(id => id !== profissionalId)
        };
      } else {
        // Adiciona o ID
        return {
          ...prev,
          profissionais: [...prev.profissionais, profissionalId]
        };
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mostrar um indicador de carregamento
      // setLoading(true); // Se você quiser adicionar um estado de loading

      // Enviar dados atualizados para a API
      const servicoAtualizado = await atualizarServico(
        servico.id,
        formData,
        fotoSelecionada // Passa o arquivo se houver um novo
      );

      // Notificar o componente pai sobre a atualização bem-sucedida
      onSave(servicoAtualizado);

      // Feedback visual de sucesso (opcional)
      alert("Serviço atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      // Feedback visual de erro
      alert(`Erro ao atualizar serviço: ${error.message || "Erro desconhecido"}`);
    } finally {
      // Finalizar indicador de carregamento
      // setLoading(false);
    }
  };
  return (
    <Popup style="width: auto;" onClose={onClose}>
      <div className="servico-form">
        <h2 style={{ fontSize: '22px',}}>Altere os campos que deseja alterar</h2>

        <form onSubmit={handleSubmit}>
          <div className="input_pai">
            <label htmlFor="nome">Nome do Serviço</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome do serviço"
              value={formData.nome}
              onChange={handleChange}
              required
              className="input"
              style={{ width: '416px' }}
            />
          </div>
          <div className="input_pai">
            <label htmlFor="descricao">Descrição do Serviço</label>
            <textarea
              id="descricao"
              name="descricao"
              placeholder="Descrição do serviço"
              value={formData.descricao}
              onChange={handleChange}
              required
              className="input"
              style={{ width: '416px' }}
            />
          </div>
          <div className="btn-juntos">
            <div className="input_pai" style={{ width: '200px' }}>
              <label htmlFor="tempo">Tempo de duração</label>
              <input
                type="time"
                id="tempo"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                required
                className="input"
                style={{ width: '200px' }}
              />
            </div>

            <div className="input_pai" style={{ width: '200px' }}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
                style={{ width: '200px' }}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>
          </div>

          <div className="btn-juntos">
            <div className="input_pai" style={{ width: '200px' }}>
              <label htmlFor="preco">Valor inicial</label>
              <input
                type="number"
                id="preco"
                name="preco"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={formData.preco}
                onChange={handleChange}
                required
                className="input"

              />
            </div>

            <div className="input_pai" style={{ width: '200px' }}>
              <label htmlFor="simultaneo">Permite Simultâneo?</label>
              <select
                id="simultaneo"
                name="simultaneo"
                value={formData.simultaneo}
                onChange={handleChange}
                className="input"
                style={{ width: '200px' }}
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Adicione uma foto</label>
            <div className="file-upload">
              <label htmlFor="foto" className="file-upload-label">
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="custom-file-button">
                  <span>{fotoSelecionada ? fotoSelecionada.name : "Selecione uma foto"}</span>
                  <img
                    src="/src/assets/svg/upload-icon.svg"
                    alt="Selecionar arquivo"
                    className="upload-icon"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Profissionais capacitados</label>
            {carregandoProfissionais ? (
              <p>Carregando profissionais...</p>
            ) : (
              <div className="profissionais-list">
                {profissionaisDisponiveis.length > 0 ? (
                  profissionaisDisponiveis.map(profissional => (
                    <div
                      key={profissional.id}
                      className={`profissional-item ${formData.profissionais.includes(profissional.id) ? 'selected' : ''
                        }`}
                      onClick={() => toggleProfissional(profissional.id)}
                    >
                      <img
                        src={profissional.foto == null ? "/src/assets/img/usuario_foto_def.png" : `data:image/jpeg;base64,${profissional.foto}`}
                        className="profissional-avatar"
                      />
                      <span>{profissional.nome}</span>
                    </div>
                  ))
                ) : (
                  <p>Nenhum profissional capacitado encontrado.</p>
                )}
              </div>
            )}
          </div>

          <div className="btn-juntos">
            <button type="submit" className="btn-verde">Atualizar</button>
            <button className="btn-vermelho">Remover</button>
            <button type="button" className="btn-branco" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </Popup>
  );
}