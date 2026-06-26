import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // New state to handle the custom success modal
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8081/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log(response.data);

            const token = response.data.data;

            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);

            // Instead of the native alert, we save the role and show the modal
            setUserRole(decoded.role);
            setShowModal(true);

        } catch (error) {
            alert(
                error.response?.data?.message || "Login Failed"
            );
        }
    };

    // This handles the navigation after they click "Continue" on the modal
    const handleModalContinue = () => {
        setShowModal(false);
        if (userRole === "ADMIN") {
            navigate("/admin");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <>
            <style>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                .login-card {
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    max-width: 400px;
                }
                .login-title {
                    margin-top: 0;
                    margin-bottom: 24px;
                    text-align: center;
                    color: #111827;
                    font-size: 24px;
                    font-weight: 600;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .input-group label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #4b5563;
                }
                .login-input {
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    transition: all 0.2s ease-in-out;
                    color: #1f2937;
                }
                .login-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
                .login-button {
                    margin-top: 8px;
                    padding: 12px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease-in-out;
                }
                .login-button:hover {
                    background-color: #2563eb;
                }
                .login-button:active {
                    background-color: #1d4ed8;
                }

                /* --- Custom Modal Styles --- */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-card {
                    background: white;
                    padding: 32px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    width: 90%;
                    max-width: 320px;
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .modal-icon {
                    font-size: 48px;
                    margin: 0;
                    margin-bottom: 16px;
                }
                .modal-title-text {
                    margin: 0 0 8px 0;
                    color: #111827;
                    font-size: 20px;
                    font-weight: 600;
                }
                .modal-subtitle-text {
                    margin: 0 0 24px 0;
                    color: #6b7280;
                    font-size: 15px;
                }
                .modal-continue-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #10b981;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease-in-out;
                }
                .modal-continue-button:hover {
                    background-color: #059669;
                }
            `}</style>

            {/* Custom Modal Overlay */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <p className="modal-icon">✅</p>
                        <h3 className="modal-title-text">Login Successful</h3>
                        <p className="modal-subtitle-text">Welcome back to your account!</p>
                        <button className="modal-continue-button" onClick={handleModalContinue}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Welcome Back</h2>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="login-input"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="login-input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="login-button" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}