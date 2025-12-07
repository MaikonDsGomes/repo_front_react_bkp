import api from "./api_port";

export async function buscarCancelamentosDashboard() {
  try {
    const response = await api.get("http://localhost:8080/cancelamentos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cancelamentos do dashboard:", error);
    throw error;
  }
}

export async function buscarAvaliacoes() {
  try {
    const response = await api.get("http://localhost:8080/avaliacao");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    throw error;
  }
}

export async function buscarServicos() {
  try {
    const response = await api.get("http://localhost:8080/servicos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
}

export async function buscarServicosDesativados() {
  try {
    const response = await api.get("http://localhost:8080/servicos/listar-desativados");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços desativados:", error);
    throw error;
  }
}

export async function criarServico(dadosServico) {
  try {
    const servicoData = {
      nome: dadosServico.nome,
      preco: parseFloat(dadosServico.preco),
      tempo: dadosServico.tempo,
      status: dadosServico.status || "ATIVO",
      simultaneo: Boolean(dadosServico.simultaneo),
      descricao: dadosServico.descricao || ''
    };

    const response = await api.post("http://localhost:8080/servicos", servicoData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw error;
  }
}

export const atualizarServico = async (id, dadosServico, arquivo = null) => {
  try {
    // Preparar objeto base do serviço
    const servicoData = {
      nome: dadosServico.nome,
      preco: parseFloat(dadosServico.preco),
      tempo: dadosServico.tempo,
      status: dadosServico.status,
      simultaneo: Boolean(dadosServico.simultaneo),
      descricao: dadosServico.descricao || ''
    };

    // Se tem arquivo, converte para Base64 e adiciona ao objeto
    if (arquivo) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Pegar apenas a parte Base64, removendo o prefixo data:image/*;base64,
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(arquivo);
      });
      
      // Adiciona o Base64 ao objeto de serviço
      servicoData.foto = base64;
    }
    
    // Enviar como JSON puro em vez de FormData
    const response = await api.put(`http://localhost:8080/servicos/${id}`, servicoData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw error;
  }
};

export async function buscarFuncionariosCompetentes(servicoId) {
  try {
    const response = await api.get(`http://localhost:8080/funcionario-competencia/servico/${servicoId}`);
    console.log("Funcionários competentes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionários competentes:", error);
    throw error;
  }
}

export async function buscarKPI(mesSelecionado, anoSelecionado) {
  try {
    // backend expects /dashboard/kpi/{ano}/{mes}
    const response = await api.get(
      `http://localhost:8080/dashboard/kpi/${anoSelecionado}/${mesSelecionado}`
    );
    console.log("KPI Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPI:", error);
    throw error;
  }
}

export async function buscarKPIUsuarios(mesSelecionado, anoSelecionado) {
  try {
    // backend expects /dashboard/kpi-usuarios/{ano}/{mes}
    const response = await api.get(
      `http://localhost:8080/dashboard/kpi-usuarios/${anoSelecionado}/${mesSelecionado}`
    );
    console.log("KPI Usuários Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPI de usuários:", error);
    throw error;
  }
}

export async function buscarAtendimentoGrafico(mesSelecionado, anoSelecionado) {
  try {
    // backend expects /dashboard/atendimento-grafico/{ano}/{mes}
    const response = await api.get(
      `http://localhost:8080/dashboard/atendimento-grafico/${anoSelecionado}/${mesSelecionado}`
    );
    console.log("Atendimento Gráfico Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de atendimento para gráfico:", error);
    throw error;
  }
}

export async function buscarAtendimentoServico(mesSelecionado, anoSelecionado) {
  try {
    // backend expects /dashboard/atendimento-servico/{ano}/{mes}
    const response = await api.get(
      `http://localhost:8080/dashboard/atendimento-servico/${anoSelecionado}/${mesSelecionado}`
    );
    console.log("Atendimento por Serviço Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de atendimento por serviço:", error);
    throw error;
  }
}

export async function buscarKPIPersonalizado(dataInicio, dataFim) {
  try {
    const response = await api.get(
      `http://localhost:8080/dashboard/kpi-personalizado/${dataInicio}/${dataFim}`
    );
    console.log("KPI Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPI:", error);
    throw error;
  }
}

export async function buscarKPIUsuariosPersonalizado(dataInicio, dataFim) {
  try {
    const response = await api.get(
      `http://localhost:8080/dashboard/kpi-usuarios-personalizado/${dataInicio}/${dataFim}`
    );
    console.log("KPI Usuários Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPI de usuários:", error);
    throw error;
  }
}

export async function buscarAtendimentoGraficoPersonalizado(dataInicio, dataFim) {
  try {
    const response = await api.get(
      `http://localhost:8080/dashboard/atendimento-grafico-personalizado/${dataInicio}/${dataFim}`
    );
    console.log("Atendimento Gráfico Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de atendimento para gráfico:", error);
    throw error;
  }
}

export async function buscarAtendimentoServicoPersonalizado(dataInicio, dataFim) {
  try {
    const response = await api.get(
      `http://localhost:8080/dashboard/atendimento-servico-personalizado/${dataInicio}/${dataFim}`
    );
    console.log("Atendimento por Serviço Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de atendimento por serviço:", error);
    throw error;
  }
}