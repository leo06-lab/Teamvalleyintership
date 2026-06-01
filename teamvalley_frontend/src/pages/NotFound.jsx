import React from "react"; // Importon React
import { Link } from "react-router-dom"; // Importon Link për navigim
import "../styles/NotFound.css"; // Importon CSS-in e NotFound

function NotFound() { // Krijon faqen NotFound
  return ( // Kthen pamjen
    <main className="notfound-page"> {/* Faqja kryesore 404 */}

      <section className="notfound-card"> {/* Karta kryesore */}

        <div className="notfound-number">404</div> {/* Numri 404 */}

        <span className="notfound-label">Page Not Found</span> {/* Label */}

        <h1>Oops! This page does not exist</h1> {/* Titulli */}

        <p>
          The page you are looking for may have been removed, renamed,
          or the link you entered is incorrect.
        </p> {/* Përshkrimi */}

        <div className="notfound-actions"> {/* Butonat */}
          <Link to="/" className="notfound-primary-btn">
            Back to Home
          </Link>

          <Link to="/jobs" className="notfound-secondary-btn">
            Find a Job
          </Link>
        </div>

      </section>

    </main>
  ); // Mbyll return
} // Mbyll komponentin

export default NotFound; // Eksporton NotFound