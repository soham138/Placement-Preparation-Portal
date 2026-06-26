import { useEffect, useState } from "react";
import axios from "axios";

export default function AptitudeHistory() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8081/api/aptitude/attempts",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setAttempts(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="history-wrapper">
                <div className="history-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="spinner"></div>
                    <p>Loading your attempt history...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .history-wrapper { min-height: 100vh; background: #f3f4f6; padding: 40px 20px; font-family: -apple-system, sans-serif; }
                .history-container { max-width: 1000px; margin: 0 auto; }
                
                .page-title { font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 24px; }
                
                /* Stats Header */
                .stats-bar { background: white; padding: 20px 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                .stat-text { font-size: 18px; color: #374151; font-weight: 600; }
                
                /* Modern Table */
                .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; overflow: hidden; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { background: #f9fafb; padding: 16px 24px; text-align: left; font-size: 13px; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
                .data-table td { padding: 16px 24px; border-bottom: 1px solid #e5e7eb; color: #1f2937; }
                .data-table tr:last-child td { border-bottom: none; }
                .data-table tr:hover { background: #f9fafb; }
                
                /* Badges */
                .badge { padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 700; }
                .badge-correct { background: #d1fae5; color: #065f46; }
                .badge-wrong { background: #fee2e2; color: #991b1b; }

                .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <div className="history-wrapper">
                <div className="history-container">
                    <h1 className="page-title">Aptitude History</h1>

                    <div className="stats-bar">
                        <p className="stat-text">Total Attempts: <strong>{attempts.length}</strong></p>
                    </div>

                    {attempts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                            <p>No attempts found.</p>
                        </div>
                    ) : (
                        <div className="table-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Question ID</th>
                                        <th>Selected Answer</th>
                                        <th>Result</th>
                                        <th>Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((attempt) => (
                                        <tr key={attempt.id}>
                                            <td>#{attempt.id}</td>
                                            <td>{attempt.questionId}</td>
                                            <td><span style={{ fontWeight: '600' }}>{attempt.selectedAnswer}</span></td>
                                            <td>
                                                <span className={`badge ${attempt.correct ? 'badge-correct' : 'badge-wrong'}`}>
                                                    {attempt.correct ? "✅ Correct" : "❌ Wrong"}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '14px', color: '#6b7280' }}>
                                                {new Date(attempt.attemptedAt).toLocaleString()}
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