import { useEffect, useState } from "react";

export default function Popup({ children }) {
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    // Ativa a classe "ativo" após o render
    const timeout = setTimeout(() => setAnimar(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="popup-overlay">
      <div className={`popup ${animar ? "ativo" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export function PopupAlerta({ mensagem, funcao, onClose }) {

  return (
    <Popup>
      <>
        <div className="popup_alerta_titulo">
          <img src="/src/assets/svg/icon_alert.svg" alt="icon-alert" />
          <p className="subtitulo semibold">Atenção!</p>
        </div>
          <p className="paragrafo-2" style={{ textAlign: "center" }}>{mensagem}</p>
        <div className="btn-juntos">
          <button className="btn-rosa" onClick={funcao}>Sim</button>
          <button className="btn-branco" onClick={onClose}>Não</button>
        </div>
      </>
    </Popup>
  );
}

