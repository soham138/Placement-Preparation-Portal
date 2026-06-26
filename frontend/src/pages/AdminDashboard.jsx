import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ADMIN DASHBOARD LOADED");
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <style>{`
                .admin-layout {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                .admin-header {
                    background-color: #ffffff;
                    padding: 16px 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .admin-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    color: #1f2937;
                }
                .logout-button {
                    background-color: #ef4444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .logout-button:hover {
                    background-color: #dc2626;
                }
                .admin-content {
                    padding: 40px 32px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }
                .dashboard-card {
                    background-color: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .dashboard-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: #3b82f6;
                }
                .card-icon {
                    font-size: 32px;
                    margin: 0;
                }
                .card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }
                .card-desc {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0;
                }
            `}</style>

            <div className="admin-layout">
                {/* Top Navigation Bar */}
                <header className="admin-header">
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </header>

                {/* Main Content Grid */}
                <main className="admin-content">
                    <div className="dashboard-grid">
                        
                        <button className="dashboard-card" onClick={() => navigate("/admin/questions")}>
                            <p className="card-icon">📝</p>
                            <h3 className="card-title">Aptitude Questions</h3>
                            <p className="card-desc">Manage and organize aptitude test questions.</p>
                        </button>

                        <button className="dashboard-card" onClick={() => navigate("/admin/coding-questions")}>
                            <p className="card-icon">💻</p>
                            <h3 className="card-title">Coding Questions</h3>
                            <p className="card-desc">Add, edit, or remove programming challenges.</p>
                        </button>

                        <button className="dashboard-card" onClick={() => navigate("/admin/profiles")}>
                            <p className="card-icon">🎓</p>
                            <h3 className="card-title">Student Profiles</h3>
                            <p className="card-desc">View and manage student information and details.</p>
                        </button>

                        <button className="dashboard-card" onClick={() => navigate("/admin/notes")}>
                            <p className="card-icon">📚</p>
                            <h3 className="card-title">Study Materials</h3>
                            <p className="card-desc">Upload, review, and manage educational notes.</p>
                        </button>

                        <button className="dashboard-card" onClick={() => navigate("/admin/submissions")}>
                            <p className="card-icon">✅</p>
                            <h3 className="card-title">Code Submissions</h3>
                            <p className="card-desc">Review and grade student coding solutions.</p>
                        </button>

                        <button className="dashboard-card" onClick={() => navigate("/admin/users")}>
                            <p className="card-icon">👥</p>
                            <h3 className="card-title">Manage Users</h3>
                            <p className="card-desc">Control access, roles, and user accounts.</p>
                        </button>

                    </div>
                </main>
            </div>
        </>
    );
}