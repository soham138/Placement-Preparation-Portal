import { useEffect, useState } from "react";
import axios from "axios";

export default function MySubmissions() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/coding/submissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSubmissions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Helper function to color-code the status badge
    const getStatusClass = (status) => {
        const s = status?.toUpperCase() || "";
        if (s.includes("APPROV")) return "badge-APPROVED";
        if (s.includes("REJECT")) return "badge-REJECTED";
        if (s.includes("PENDING")) return "badge-PENDING";
        return "badge-DEFAULT";
    };

    return (
        <>
            <style>{`
                .submissions-wrapper {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    padding: 40px 20px;
                }
                .submissions-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                }
                
                /* Submission Card */
                .submission-card {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .submission-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .question-info {
                    margin: 0;
                    font-size: 16px;
                    color: #1f2937;
                    font-weight: 600;
                }
                
                /* Badges */
                .badge {
                    padding: 6px 14px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-APPROVED { background-color: #d1fae5; color: #065f46; }
                .badge-REJECTED { background-color: #fee2e2; color: #991b1b; }
                .badge-PENDING { background-color: #fef3c7; color: #92400e; }
                .badge-DEFAULT { background-color: #f3f4f6; color: #374151; }
                
                /* Code Block */
                .code-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4b5563;
                    margin-bottom: 8px;
                }
                .code-block {
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                    border: 1px solid #374151;
                }
                
                .empty-state {
                    text-align: center;
                    color: #6b7280;
                    padding: 60px 20px;
                    background: white;
                    border-radius: 12px;
                    border: 2px dashed #d1d5db;
                }
                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
            `}</style>

            <div className="submissions-wrapper">
                <div className="submissions-container">
                    <h1 className="page-title">My Coding Submissions</h1>

                    {submissions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💻</div>
                            <h3>No Submissions Yet</h3>
                            <p>You haven't submitted any coding solutions. Go to the Coding Questions section to get started!</p>
                        </div>
                    ) : (
                        submissions.map((s) => (
                            <div key={s.id} className="submission-card">
                                
                                <div className="card-header">
                                    <p className="question-info">
                                        Question ID: #{s.questionId}
                                    </p>
                                    <span className={`badge ${getStatusClass(s.status)}`}>
                                        {s.status || "UNKNOWN"}
                                    </span>
                                </div>

                                <div>
                                    <div className="code-label">Submitted Code:</div>
                                    <pre className="code-block">
                                        {s.code || "// No code provided"}
                                    </pre>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}