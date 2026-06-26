import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
  });

  const [modal, setModal] = useState({ isOpen: false, message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/api/auth/register", formData);
      setModal({ isOpen: true, message: response.data.message, type: "success" });
    } catch (error) {
      setModal({ 
        isOpen: true, 
        message: error.response?.data?.message || "Registration Failed", 
        type: "error" 
      });
    }
  };

  const handleModalClose = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") navigate("/login");
  };

  return (
    <>
      <style>{`
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; font-family: -apple-system, sans-serif; padding: 20px; }
        .auth-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .auth-title { margin: 0 0 24px; text-align: center; color: #111827; font-size: 24px; font-weight: 700; }
        .form-group { display: flex; flex-direction: column; gap: 16px; }
        .input-box { padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; }
        .btn-main { padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-main:hover { background: #2563eb; }
        .link-text { text-align: center; margin-top: 16px; font-size: 14px; color: #6b7280; }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; padding: 32px; border-radius: 12px; text-align: center; max-width: 320px; width: 90%; }
        .modal-btn { width: 100%; padding: 10px; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; }
      `}</style>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p style={{fontSize: '40px'}}>{modal.type === "success" ? "✅" : "❌"}</p>
            <h3>{modal.type === "success" ? "Registered!" : "Error"}</h3>
            <p>{modal.message}</p>
            <button className="modal-btn" style={{background: modal.type === "success" ? "#10b981" : "#ef4444"}} onClick={handleModalClose}>Okay</button>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <form className="form-group" onSubmit={handleSubmit}>
            <input className="input-box" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input className="input-box" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input className="input-box" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <select className="input-box" name="role" value={formData.role} onChange={handleChange}>
              <option value="STUDENT">STUDENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button className="btn-main" type="submit">Register</button>
          </form>
          <p className="link-text">Already have an account? <Link to="/login" style={{color: '#3b82f6'}}>Login here</Link></p>
        </div>
      </div>
    </>
  );
}