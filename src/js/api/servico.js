import api from "./api_port";

export async function buscarServicos() {
  try {
    const response = await api.get(`http://localhost:8080/servicos`);
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}