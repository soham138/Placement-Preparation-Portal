import { useEffect, useState } from "react";
import axios from "axios";

export default function CodingLeaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8081/api/coding/leaderboard",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (Array.isArray(response.data)) {
                setLeaders(response.data);
            } else {
                setLeaders([]);
            }
        } catch (error) {
            console.log(error);
            setLeaders([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .lb-wrapper { min-height: 100vh; background-color: #f3f4f6; padding: 40px 20px; font-family: -apple-system, sans-serif; }
                .lb-container { max-width: 800px; margin: 0 auto; }
                
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
                
                /* Podium / Rank Styles */
                .rank-cell { font-weight: 800; font-size: 18px; width: 60px; }
                .rank-1 { color: #f59e0b; } /* Gold */
                .rank-2 { color: #6b7280; } /* Silver */
                .rank-3 { color: #92400e; } /* Bronze */
                
                .solved-badge { 
                    background: #dcfce7; color: #166534; padding: 4px 12px; 
                    border-radius: 99px; font-size: 12px; font-weight: 700; 
                }

                .loading-spinner { text-align: center; padding: 40px; color: #6b7280; }
            `}</style>

            <div className="lb-wrapper">
                <div className="lb-container">
                    <div className="page-header">
                        <h1 className="title">🏆 Coding Leaderboard</h1>
                        <p style={{ color: '#6b7280', marginTop: '8px' }}>Top performers based on solved challenges.</p>
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
                                        <th>Student Email</th>
                                        <th style={{ textAlign: 'center' }}>Problems Solved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaders.map((user, index) => (
                                        <tr key={index}>
                                            <td className={`rank-cell ${index < 3 ? `rank-${index + 1}` : ''}`}>
                                                #{index + 1}
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '15px', color: '#111827' }}>{user.email}</div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="solved-badge">{user.solved}</span>
                                            </td>
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