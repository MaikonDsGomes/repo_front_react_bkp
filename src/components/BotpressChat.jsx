import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    // Cria dinamicamente o script do Botpress
    const script = document.createElement("script");
    script.src = "http://localhost:3000/assets/modules/channel-web/inject.js";
    script.async = true;

    // Quando o script carregar, inicializa o chat
    script.onload = () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          host: "http://localhost:3000",
          botId: "salnotimeatendimento", // verifique o ID do seu bot
          botName: "SalonTime",
          hideWidget: false,
          showCloseButton: true,
          enableReset: true,
        });
      }
    };

    // Adiciona o script ao body
    document.body.appendChild(script);

    // Cleanup: remove o script ao desmontar o componente
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Não renderiza nada explicitamente pois o widget é auto-renderizado
  return null;
}
