import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/main.css";
// import "./js/main.js"

console.log("React carregou main.jsx");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
