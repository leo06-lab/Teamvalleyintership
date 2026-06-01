import React from "react"; // Importon React
import ReactDOM from "react-dom/client"; // Importon ReactDOM
import { BrowserRouter } from "react-router-dom"; // Importon BrowserRouter për navigim
import App from "./App"; // Importon App
import "./styles/App.css"; // Importon CSS-in kryesor
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Merr div-in root nga index.html

root.render( // Renderon aplikacionin
  <React.StrictMode> {/* Aktivizon kontrollin e React */}
    <BrowserRouter> {/* Mbështjell gjithë app-in me router */}
      <App /> {/* Shfaq App */}
    </BrowserRouter>
  </React.StrictMode>
);