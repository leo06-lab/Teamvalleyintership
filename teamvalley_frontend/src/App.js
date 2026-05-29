import React from "react"; // Importon React për përdorimin e JSX
import Home from "./pages/Home"; // Importon faqen Home nga folderi pages
import NavbarComponent from "./components/NavbarComponent"; // Importon navbar-in
import "./styles/App.css"; // Importon CSS-in kryesor të aplikacionit

function App() { // Krijon komponentin kryesor App
  return ( // Kthen pamjen kryesore
    <div className="App"> {/* Mbështjell gjithë aplikacionin */}
      <NavbarComponent/>{/* Shfaq komponentin NavbarComponent ne browser */}
      <Home /> {/* Shfaq komponentin Home në browser */}
      
    </div>
  ); // Mbyll return
} // Mbyll komponentin App

export default App; 