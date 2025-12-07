import api from "./api_port";

// Atualizar cupom existente
export async function atualizarCupom(id, cupomData) {
  try {
    const body = {
      nome: cupomData.nome,
      descricao: cupomData.descricao,
      codigo: cupomData.codigo,
      ativo: cupomData.ativo,
      inicio: cupomData.inicio,
      fim: cupomData.fim,
      tipoDestinatario: cupomData.tipoDestinatario,
      desconto: cupomData.desconto
    };

    const response = await api.put(`http://localhost:8080/cupons/${id}`, body);
    return response.data;
  } catch (error) {
        console.error("Erro ao atualizar cupom:", error);
    throw error;
  }
}

// Buscar cupom por ID
export async function buscarCupom() {
  try {
    const response = await api.get(`http://localhost:8080/cupons`);
    return response.data; // Retorna o CupomDto
  } catch (error) {
     console.error("Erro ao buscar cupom:", error);
    throw error;
  }
}

// Criar novo cupom
export async function criarCupom(cupomData) {
  try {
    const body = {
      nome: cupomData.nome,
      descricao: cupomData.descricao,
      codigo: cupomData.codigo,
      ativo: cupomData.ativo ?? true,
      inicio: cupomData.inicio || null,
      fim: cupomData.fim || null,
      tipoDestinatario: cupomData.tipoDestinatario,
      desconto: cupomData.desconto ?? null
    };

    const response = await api.post('http://localhost:8080/cupons', body);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

// Desativar cupom
export async function desativarCupom(id) {
  try {
    const response = await api.patch(`http://localhost:8080/cupons/${id}/desativar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao desativar cupom:", error);
    throw error;
  }
}

// Criar um novo cupom destinado (POST)
export async function salvarCupomDestinado(cupom, usuario, usado = null) {
  try {
    const body = {
      cupom: cupom,
      usuario: usuario,
      usado: usado
    };

    const response = await api.post(`http://localhost:8080/cupom-destinado`, body);

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error("Erro ao salvar cupom destinado:", error);
    throw error;
  }
}

// Atualizar um cupom destinado (PUT)
export async function atualizarCupomDestinado(id, cupom, usuario, usado = null) {
  try {
    const body = {
      id: id,
      cupom: cupom,
      usuario: usuario,
      usado: usado
    };

    const response = await api.put(`http://localhost:8080/cupom-destinado/${id}`, body);

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error("Erro ao atualizar cupom destinado:", error);
    throw error;
  }
}