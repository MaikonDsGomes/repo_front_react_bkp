import MenuConfig from "/src/components/MenuConfig.jsx";
import { useState, useEffect } from "react";
import { buscarCupons } from "../../js/api/caio";

function CardCupom({ cupom, usado }) {
  return (
    <div className="card_cupom">
      <div className="superiro">
        <p className="titulo paragrafo-2">{cupom?.nome}</p>
        <p className="descricao">{cupom?.descricao}</p>
        <hr />
      </div>
      <div className="inferior">
        <div className="info_cupom_box">
          <p className="paragrafo-2">
            <img src="/src/assets/svg/key.svg" alt="" /> <span className="semibold">Código:</span> {cupom?.codigo}
          </p>
          <p className="paragrafo-2">
            <img src="/src/assets/svg/cash-sharp.svg" alt="" /> <span className="semibold">Desconto:</span> {cupom?.desconto}%
          </p>
          <p className="">
            <img src="/src/assets/svg/refresh-cw.svg" alt="" /> <span className="semibold">Usos disponíveis:</span> {usado == true ? "0" : "1"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Config_cupons() {
  
  const [cupons, setCupons] = useState([]);

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      buscarCupons(usuarioObj.id)
        .then(data => {
          if (data) {
            setCupons(data);
            console.log("Cupons carregados com sucesso!");
          }
        })
        .catch(error => {
          console.error("Erro ao buscar cupons:", error);
        });
    }
  }, []);

  return (
    <MenuConfig>
      <h1 className="titulo-1">CUPONS Disponíveis:</h1>
      <p className="paragrafo-1 desc_principal">
        Lembre-se de manter os dados de perfil sempre atualizados! Assim você tem mais chances de receber um desconto!
      </p>
      <div className="cards_pai">
        {cupons.length > 0 ? cupons.map((item, idx) => (
          <CardCupom key={idx} {...item} />
        )) : (
          <p className="paragrafo-2">Nenhum cupom disponível.</p>
        )}
      </div>
    </MenuConfig>
  );
}