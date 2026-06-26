import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", { email, password });
            const token = response.data.data;
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);
            setShowModal(true);
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <>
            <style>{`
                .auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; padding: 20px; font-family: sans-serif; }
                .auth-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
                .title { font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px; }
                .input-group { margin-bottom: 20px; }
                .input-field { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; }
                .btn-primary { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-primary:hover { background: #2563eb; }
                .auth-link { text-align: center; margin-top: 16px; font-size: 14px; color: #6b7280; }

                /* --- Improved Modal Styles --- */
                .modal-overlay { 
                    position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); 
                    display: flex; align-items: center; justify-content: center; z-index: 1000; 
                }
                .modal-card { 
                    background: white; padding: 32px; border-radius: 16px; text-align: center; 
                    width: 90%; max-width: 320px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-icon { font-size: 48px; margin-bottom: 16px; }
                .btn-continue { 
                    width: 100%; padding: 12px; background: #10b981; color: white; border: none; 
                    border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 20px; 
                }
                .btn-continue:hover { background: #059669; }
            `}</style>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-icon">✅</div>
                        <h3 style={{ margin: '0 0 10px' }}>Login Successful</h3>
                        <p style={{ color: '#6b7280', marginBottom: 0 }}>Welcome back to your portal.</p>
                        <button 
                            className="btn-continue"
                            onClick={() => userRole === "ADMIN" ? navigate("/admin") : navigate("/dashboard")}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <div className="auth-wrapper">
                <div className="auth-card">
                    <h2 className="title">Welcome Back</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn-primary" type="submit">Login</button>
                    </form>
                    <p className="auth-link">Don't have an account? <Link to="/register" style={{color: '#3b82f6'}}>Register here</Link></p>
                </div>
            </div>
        </>
    );
}