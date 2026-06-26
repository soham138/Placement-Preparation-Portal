import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8081/api/aptitude/leaderboard",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setLeaders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .lb-wrapper { min-height: 100vh; background-color: #f3f4f6; padding: 40px 20px; font-family: -apple-system, sans-serif; }
                .lb-container { max-width: 900px; margin: 0 auto; }
                
                .page-header { text-align: center; margin-bottom: 40px; }
                .title { font-size: 32px; font-weight: 800; color: #111827; margin: 0; }
                
                /* Table Card */
                .table-card { 
                    background: white; border-radius: 16px; overflow: hidden; 
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { background: #f9fafb; padding: 20px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
                .data-table td { padding: 20px; border-top: 1px solid #e5e7eb; color: #111827; font-weight: 500; }
                
                /* Rank Styles */
                .rank-cell { font-weight: 800; font-size: 18px; width: 60px; }
                .rank-1 { color: #f59e0b; } /* Gold */
                .rank-2 { color: #6b7280; } /* Silver */
                .rank-3 { color: #92400e; } /* Bronze */
                
                .score-badge { 
                    background: #dbeafe; color: #1e40af; padding: 4px 12px; 
                    border-radius: 99px; font-size: 13px; font-weight: 700; 
                }
                .accuracy-text { color: #059669; font-weight: 700; }

                .loading-spinner { text-align: center; padding: 40px; color: #6b7280; }
            `}</style>

            <div className="lb-wrapper">
                <div className="lb-container">
                    <div className="page-header">
                        <h1 className="title">🧠 Aptitude Leaderboard</h1>
                        <p style={{ color: '#6b7280', marginTop: '8px' }}>Top performers by aptitude score.</p>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading rankings...</div>
                    ) : leaders.length === 0 ? (
                        <div className="loading-spinner">No leaderboard data found.</div>
                    ) : (
                        <div className="table-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Email</th>
                                        <th>Score</th>
                                        <th>Attempts</th>
                                        <th>Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaders.map((user, index) => (
                                        <tr key={user.userEmail}>
                                            <td className={`rank-cell ${index < 3 ? `rank-${index + 1}` : ''}`}>
                                                #{index + 1}
                                            </td>
                                            <td>{user.userEmail}</td>
                                            <td><span className="score-badge">{user.correctAnswers}</span></td>
                                            <td>{user.totalAttempts}</td>
                                            <td className="accuracy-text">{user.accuracy.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}