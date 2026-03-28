// pages/LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session/auth data
    // localStorage.removeItem('authToken');
    // sessionStorage.clear();
    
    // Redirect to login
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Logging out...</p>
    </div>
  );
}
