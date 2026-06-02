import React from "react"; // Importon React
import { Navigate } from "react-router-dom"; // Importon Navigate për redirect

function RoleRoute({ children, allowedRoles }) { // Merr children dhe rolet e lejuara
  const user = JSON.parse(localStorage.getItem("jobvalleyUser")); // Merr user-in nga localStorage

  if (!user || !user.isLoggedIn) { // Nëse user nuk është login
    return <Navigate to="/login" replace />; // E çon te login
  }

  if (!allowedRoles.includes(user.role)) { // Nëse roli nuk lejohet
    return <Navigate to="/" replace />; // E kthen te Home
  }

  return children; // Nëse çdo gjë është OK, hap faqen
}

export default RoleRoute; // Eksporton RoleRoute