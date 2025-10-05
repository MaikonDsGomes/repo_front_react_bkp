import axios from "axios";

export async function buscarInfoSalao() {
  try {
    const response = await axios.get(`http://localhost:8080/info-salao`);
    console.log(response.data)
    // Formata o campo telefone para (XX) XXXXX-XXXX, mantendo os outros campos
    let data = response.data;
     // Se vier array, pega o primeiro objeto
    if (Array.isArray(data)) {
      data = data[0] || {};
    }
    if (data && data.telefone) {
      // Remove tudo que não for número
      let tel = data.telefone.replace(/\D/g, "");
      if (tel.length === 11) {
        data.telefone = `(${tel.slice(0,2)}) ${tel.slice(2,7)}-${tel.slice(7)}`;
      }
    }
    return data;    

  } catch (error) {
    console.error("Erro ao buscar informações do salão:", error);
    throw error;
  }
}