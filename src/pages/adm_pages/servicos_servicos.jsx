import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import NavServicos from "../../components/NavServicos";
import { buscarServicos, buscarServicosDesativados, atualizarServico, buscarFuncionariosCompetentes, criarServico } from "../../js/api/elerson.js";
import InfoCard from "../../components/InfoCard.jsx";
import Popup from "../../components/Popup.jsx";
import { mensagemErro, mensagemSucesso } from "../../js/utils.js";

export default function Servicos_servicos() {
  const navigate = useNavigate();
  const [servicosAtivos, setServicosAtivos] = useState([]);
  const [servicosInativos, setServicosInativos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("ATIVO"); // "ATIVO" ou "INATIVO"
  const [loading, setLoading] = useState(true);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

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
    const servicosCompletos = [...servicosAtivos, ...servicosInativos];
    const servico = servicosCompletos.find(s => s.id === id);
    setServicoSelecionado(servico);
    setModalAberto(true);
  };

  const handleToggleServiceStatus = async (id) => {
    try {
      // Toggle service status (ATIVO/INATIVO)
      const servicosCompletos = [...servicosAtivos, ...servicosInativos];
      const servico = servicosCompletos.find(s => s.id === id);
      
      if (!servico) return;

      const novoStatus = servico.status === "ATIVO" ? "INATIVO" : "ATIVO";
      
      // Atualizar via API
      await atualizarServico(id, { ...servico, status: novoStatus });
      
      // Atualizar estados locais
      if (novoStatus === "INATIVO") {
        // Move de ativos para inativos
        setServicosAtivos(servicosAtivos.filter(s => s.id !== id));
        setServicosInativos([...servicosInativos, { ...servico, status: novoStatus }]);
      } else {
        // Move de inativos para ativos
        setServicosInativos(servicosInativos.filter(s => s.id !== id));
        setServicosAtivos([...servicosAtivos, { ...servico, status: novoStatus }]);
      }

      mensagemSucesso(`Serviço ${novoStatus === "ATIVO" ? "ativado" : "desativado"} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status do serviço:", error);
      mensagemErro("Erro ao atualizar status do serviço");
    }
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setServicoSelecionado(null);
  };

  const handleCloseModalCriar = () => {
    setModalCriarAberto(false);
  };

  // Handler for after a service is successfully updated
  const handleServicoAtualizado = (servicoAtualizado) => {
    // Atualizar no array apropriado baseado no status
    if (servicoAtualizado.status === "ATIVO") {
      setServicosAtivos(servicosAtivos.map(s =>
        s.id === servicoAtualizado.id ? servicoAtualizado : s
      ));
      // Remover dos inativos se estava lá
      setServicosInativos(servicosInativos.filter(s => s.id !== servicoAtualizado.id));
    } else {
      setServicosInativos(servicosInativos.map(s =>
        s.id === servicoAtualizado.id ? servicoAtualizado : s
      ));
      // Remover dos ativos se estava lá
      setServicosAtivos(servicosAtivos.filter(s => s.id !== servicoAtualizado.id));
    }
    handleCloseModal();
  };

  // Handler for after a service is successfully created
  const handleServicoCriado = (novoServico) => {
    // Adicionar no array apropriado baseado no status
    if (novoServico.status === "ATIVO") {
      setServicosAtivos([...servicosAtivos, novoServico]);
    } else {
      setServicosInativos([...servicosInativos, novoServico]);
    }
    handleCloseModalCriar();
  };

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        setLoading(true);
        const [ativos, inativos] = await Promise.all([
          buscarServicos(),
          buscarServicosDesativados()
        ]);
        setServicosAtivos(ativos);
        setServicosInativos(inativos);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        mensagemErro("Erro ao carregar serviços");
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
            <h1 className="titulo-1">Gerenciar Serviços</h1>
            <button className="btn-rosa" onClick={() => setModalCriarAberto(true)}>
              <img
                src="/src/assets/vector/icon_sum/jam-icons/Vector.svg"
                alt=""
              />
              Criar Serviço
            </button>
          </div>

          {/* Filtro de Status */}
          <div className="dash_servico_filtro" style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
            <button
              className={filtroStatus === "ATIVO" ? "btn-rosa" : "btn-branco"}
              onClick={() => setFiltroStatus("ATIVO")}
              style={{ minWidth: '120px' }}
            >
              Ativos ({servicosAtivos.length})
            </button>
            <button
              className={filtroStatus === "INATIVO" ? "btn-rosa" : "btn-branco"}
              onClick={() => setFiltroStatus("INATIVO")}
              style={{ minWidth: '120px' }}
            >
              Inativos ({servicosInativos.length})
            </button>
          </div>

          <div className="dash_servico_servico_pai">
            {loading ? (
              <p>Carregando serviços...</p>
            ) : (() => {
              const servicosExibidos = filtroStatus === "ATIVO" ? servicosAtivos : servicosInativos;
              
              return servicosExibidos.length > 0 ? (
                servicosExibidos.map((servico) => (
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
                      primary: { text: "Editar", width: "120px" }
                    }}
                    onPrimaryClick={() => handleEditService(servico.id)}
                  />
                ))
              ) : (
                <p>Nenhum serviço {filtroStatus === "ATIVO" ? "ativo" : "inativo"} encontrado.</p>
              );
            })()}
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

      {modalCriarAberto && (
        <CriarServico
          onClose={handleCloseModalCriar}
          onSave={handleServicoCriado}
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
          nome: item.funcionario.nome
          // A foto será buscada diretamente do endpoint via URL
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
      mensagemSucesso("Serviço atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      // Feedback visual de erro
      mensagemErro(`Erro ao atualizar serviço: ${error.message || "Erro desconhecido"}`);
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
                        src={`http://localhost:8080/usuarios/foto/${profissional.id}`}
                        onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
                        alt={profissional.nome}
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

function CriarServico({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tempo: "00:30:00",
    status: "ATIVO",
    preco: 0,
    simultaneo: false
  });
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Criar o serviço
      const novoServico = await criarServico(formData);
      
      // Notificar o componente pai sobre a criação bem-sucedida
      onSave(novoServico);
      
      // Feedback visual de sucesso
      mensagemSucesso("Serviço criado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      mensagemErro(`Erro ao criar serviço: ${error.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup style="width: auto;" onClose={onClose}>
      <div className="servico-form">
        <h2 style={{ fontSize: '22px' }}>Preencha os campos abaixo:</h2>

        <form onSubmit={handleSubmit}>
          <div className="input_pai">
            <label htmlFor="nome">Nome do Serviço</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Corte de Cabelo"
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
              placeholder="Descreva o serviço..."
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
              <label htmlFor="foto-criar" className="file-upload-label">
                <input
                  type="file"
                  id="foto-criar"
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

          <div className="btn-juntos" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn-verde" disabled={loading} style={{ minWidth: '50%' }}>
              {loading ? "Criando..." : "Criar"}
            </button>
            <button type="button" className="btn-branco" onClick={onClose} disabled={loading} style={{ minWidth: '50%' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
}