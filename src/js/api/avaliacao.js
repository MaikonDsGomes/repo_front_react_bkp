import axios from "axios";

export async function buscarAvaliacoes() {
    try {
        const response = await axios.get(`http://localhost:8080/avaliacao`);
        console.log(response.data)
        // Formata apenas o campo dataHorario para DD/MM/YYYY, mantendo os outros campos
        const dataFormatada = response.data.map(avaliacao => {
            let data = new Date(avaliacao.dataHorario);
            let dia = String(data.getDate()).padStart(2, '0');
            let mes = String(data.getMonth() + 1).padStart(2, '0');
            let ano = data.getFullYear();
            return {
                ...avaliacao,
                dataHorario: `${dia}/${mes}/${ano}`
            };
        });
        return dataFormatada;


    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        throw error;
    }
}