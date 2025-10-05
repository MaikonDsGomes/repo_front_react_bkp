import axios from "axios";

// Buscar todos os cupons destinados
export async function buscarCuponsDestinados() {
  try {
    const response = await axios.get("http://localhost:8080/cupom-destinado");
    return response.data; // Lista de CupomDestinadoDto
  } catch (error) {
    console.error("Erro ao buscar cupons destinados:", error);
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

    const response = await axios.post(`http://localhost:8080/cupom-destinado`, body);

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

    const response = await axios.put(`http://localhost:8080/cupom-destinado/${id}`, body);

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error("Erro ao atualizar cupom destinado:", error);
    throw error;
  }
}

