import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
    const navigate = useNavigate();

    const [role, setRole] = useState("");

    const [stats, setStats] = useState({
        totalAttempts: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0
    });

    const [codingStats, setCodingStats] = useState({
        totalQuestions: 0,
        solvedQuestions: 0,
        completion: 0
    });

    const [aptitudeStats, setAptitudeStats] = useState({
        totalQuestions: 0
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log("DECODED JWT:", decoded);
            setRole(decoded.role);
            console.log("ROLE =", decoded.role);

            if (decoded.role === "ADMIN") {
                console.log("REDIRECTING TO ADMIN");
                navigate("/admin");
                return;
            }

            loadStats(token);
            loadCodingStats(token);
            loadAptitudeStats(token);

        } catch (error) {
            console.log("JWT ERROR:", error);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    const loadStats = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/aptitude/score",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadCodingStats = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/coding/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCodingStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAptitudeStats = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/aptitude/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAptitudeStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", {
            replace: true
        });
    };

    return (
        <>
            <style>{`
                .dashboard-wrapper {
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                
                /* Header */
                .dashboard-header {
                    background-color: #ffffff;
                    padding: 20px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .header-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .role-badge {
                    background-color: #e0e7ff;
                    color: #3730a3;
                    padding: 6px 14px;
                    border-radius: 9999px;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .btn-logout {
                    background-color: #ef4444;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-logout:hover {
                    background-color: #dc2626;
                }

                /* Main Content */
                .dashboard-content {
                    padding: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #374151;
                    margin: 0 0 20px 0;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 10px;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .stat-card {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    border: 1px solid #e5e7eb;
                    text-align: center;
                    transition: transform 0.2s;
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 8px 0;
                }
                .stat-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #6b7280;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .text-green { color: #10b981; }
                .text-red { color: #ef4444; }
                .text-blue { color: #3b82f6; }

                /* Modules Grid */
                .modules-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .module-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .module-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: #3b82f6;
                }
                .module-icon {
                    font-size: 32px;
                    background: #f3f4f6;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }
                .module-info h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                }
                .module-info p {
                    margin: 0;
                    font-size: 13px;
                    color: #6b7280;
                }
            `}</style>

            <div className="dashboard-wrapper">
                
                {/* --- HEADER --- */}
                <header className="dashboard-header">
                    <h1 className="header-title">Placement Preparation Portal</h1>
                    <div className="header-actions">
                        <span className="role-badge">Role: {role || "STUDENT"}</span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="dashboard-content">
                    
                    {/* --- APTITUDE STATS --- */}
                    <h2 className="section-title">Aptitude Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <p className="stat-value">{aptitudeStats.totalQuestions}</p>
                            <p className="stat-label">Total Questions</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value">{stats.totalAttempts}</p>
                            <p className="stat-label">Total Attempts</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value text-green">{stats.correctAnswers}</p>
                            <p className="stat-label">Correct</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value text-red">{stats.wrongAnswers}</p>
                            <p className="stat-label">Wrong</p>
                        </div>
                        <div className="stat-card" style={{ borderBottom: "4px solid #3b82f6" }}>
                            <p className="stat-value text-blue">{Number(stats.accuracy || 0).toFixed(2)}%</p>
                            <p className="stat-label">Accuracy</p>
                        </div>
                    </div>

                    {/* --- CODING STATS --- */}
                    <h2 className="section-title">Coding Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <p className="stat-value">{codingStats.totalQuestions}</p>
                            <p className="stat-label">Available Questions</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value text-green">{codingStats.solvedQuestions}</p>
                            <p className="stat-label">Questions Solved</p>
                        </div>
                        <div className="stat-card" style={{ borderBottom: "4px solid #10b981" }}>
                            <p className="stat-value text-green">{Number(codingStats.completion || 0).toFixed(2)}%</p>
                            <p className="stat-label">Completion Rate</p>
                        </div>
                    </div>

                    {/* --- MODULES NAVIGATION --- */}
                    <h2 className="section-title">Preparation Modules</h2>
                    <div className="modules-grid">
                        
                        <div className="module-card" onClick={() => navigate("/profile")}>
                            <div className="module-icon">👤</div>
                            <div className="module-info">
                                <h3>My Profile</h3>
                                <p>Manage your account details</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/aptitude")}>
                            <div className="module-icon">🧠</div>
                            <div className="module-info">
                                <h3>Aptitude Test</h3>
                                <p>Take an aptitude assessment</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/practice")}>
                            <div className="module-icon">🎯</div>
                            <div className="module-info">
                                <h3>Practice Mode</h3>
                                <p>Sharpen your aptitude skills</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/coding")}>
                            <div className="module-icon">💻</div>
                            <div className="module-info">
                                <h3>Coding Questions</h3>
                                <p>Solve programming challenges</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/notes")}>
                            <div className="module-icon">📚</div>
                            <div className="module-info">
                                <h3>Study Materials</h3>
                                <p>Access prep notes and guides</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/my-submissions")}>
                            <div className="module-icon">✅</div>
                            <div className="module-info">
                                <h3>My Submissions</h3>
                                <p>View your past coding solutions</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/history")}>
                            <div className="module-icon">📜</div>
                            <div className="module-info">
                                <h3>Attempt History</h3>
                                <p>Review your test history</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/coding-leaderboard")}>
                            <div className="module-icon">🏆</div>
                            <div className="module-info">
                                <h3>Coding Leaderboard</h3>
                                <p>See top coding performers</p>
                            </div>
                        </div>

                        <div className="module-card" onClick={() => navigate("/leaderboard")}>
                            <div className="module-icon">🏅</div>
                            <div className="module-info">
                                <h3>Aptitude Leaderboard</h3>
                                <p>See top aptitude performers</p>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}

export default Dashboard;