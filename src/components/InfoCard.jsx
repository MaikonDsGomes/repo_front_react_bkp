import React from "react";

/**
 * InfoCard - Reusable card component for displaying various types of information
 * 
 * @param {Object} props
 * @param {string} props.title - Title to display at the top of the card
 * @param {string|React.ReactNode} props.description - Description content
 * @param {Array} props.infoItems - Array of info items to display (icon, label, value)
 * @param {React.ReactNode} props.customContent - Optional custom content to render in the middle section
 * @param {Object} props.buttons - Configuration for action buttons
 * @param {Function} props.onPrimaryClick - Function to call when primary button is clicked
 * @param {Function} props.onSecondaryClick - Function to call when secondary button is clicked
 */
export default function InfoCard({
  title,
  description,
  infoItems = [],
  customContent,
  buttons = {
    primary: { text: "Editar", width: "120px" },
    secondary: { text: "Desativar", width: "120px", dynamic: false, condition: null }
  },
  onPrimaryClick,
  onSecondaryClick
}) {
  const getSecondaryButtonText = () => {
    if (!buttons.secondary.dynamic) return buttons.secondary.text;
    return buttons.secondary.condition ? "Desativar" : "Ativar";
  };

  return (
    <>
      <div className="dash_servico_servico">
        <div className="dash_servico_servico_nome">
          <h1 className="paragrafo-1 branco semibold">{title}</h1>
        </div>
        <div className="dash_servico_servico_util">
          {description && (
            <div className="dash_servico_servico_descricao">
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>
          )}
          
          {customContent && customContent}
          
          {infoItems.map((item, index) => (
            <div key={index} className="dash_servico_servico_info_filho">
              {item.icon && <img src={item.icon} alt="" />}
              {item.label && <p>{item.label}</p>}
              {item.value && <p>{item.value}</p>}
            </div>
          ))}
          
          <div className="dash_servico_servico_button btn-juntos">
            <button 
              className="btn-rosa" 
              style={{ width: buttons.primary.width }}
              onClick={onPrimaryClick}
            >
              {buttons.primary.text}
            </button>
            <button 
              className="btn-branco" 
              style={{ width: buttons.secondary.width }}
              onClick={onSecondaryClick}
            >
              {getSecondaryButtonText()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}