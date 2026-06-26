import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    
    // State to control our custom alert modal
    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "success" // 'success' | 'danger'
    });

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/coding/admin/submissions",
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

    const approveSubmission = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/api/coding/admin/submissions/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Trigger success modal instead of alert
            setModal({ isOpen: true, message: "Submission successfully Approved!", type: "success" });
            loadSubmissions();
        } catch (error) {
            console.log(error);
        }
    };

    const rejectSubmission = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/api/coding/admin/submissions/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Trigger danger/rejection modal instead of alert
            setModal({ isOpen: true, message: "Submission has been Rejected.", type: "danger" });
            loadSubmissions();
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

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    return (
        <>
            <style>{`
                .admin-wrapper {
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    padding: 40px 20px;
                }
                .admin-container {
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
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .user-info {
                    margin: 0;
                    font-size: 16px;
                    color: #1f2937;
                }
                
                /* Badges */
                .meta-info {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .badge {
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-question { background-color: #e0e7ff; color: #3730a3; }
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
                    margin: 0 0 20px 0;
                }
                
                /* Action Buttons */
                .btn-row {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-approve {
                    background-color: #10b981;
                    color: white;
                }
                .btn-approve:hover {
                    background-color: #059669;
                }
                .btn-reject {
                    background-color: #ef4444;
                    color: white;
                }
                .btn-reject:hover {
                    background-color: #dc2626;
                }
                
                .empty-state {
                    text-align: center;
                    color: #6b7280;
                    padding: 40px;
                    background: white;
                    border-radius: 12px;
                    border: 1px dashed #d1d5db;
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
                    margin: 0 0 16px 0;
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
                .modal-close-button {
                    width: 100%;
                    padding: 10px;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease-in-out;
                }
                .btn-success { background-color: #10b981; }
                .btn-success:hover { background-color: #059669; }
                .btn-danger-modal { background-color: #ef4444; }
                .btn-danger-modal:hover { background-color: #dc2626; }
            `}</style>

            {/* Custom Modal Overlay */}
            {modal.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <p className="modal-icon">{modal.type === "success" ? "✅" : "⚠️"}</p>
                        <h3 className="modal-title-text">
                            {modal.type === "success" ? "Action Successful" : "Action Completed"}
                        </h3>
                        <p className="modal-subtitle-text">{modal.message}</p>
                        <button 
                            className={`modal-close-button ${modal.type === "success" ? "btn-success" : "btn-danger-modal"}`} 
                            onClick={closeModal}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}

            <div className="admin-wrapper">
                <div className="admin-container">
                    <h1 className="page-title">Review Coding Submissions</h1>

                    {submissions.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Submissions Found</h3>
                            <p>There are currently no coding submissions to review.</p>
                        </div>
                    ) : (
                        submissions.map((submission) => {
                            const currentStatus = submission.status?.toUpperCase() || "";

                            return (
                                <div key={submission.id} className="submission-card">
                                    
                                    <div className="card-header">
                                        <p className="user-info">
                                            <strong>User:</strong> {submission.userEmail}
                                        </p>
                                        <div className="meta-info">
                                            <span className="badge badge-question">
                                                Question ID: {submission.questionId}
                                            </span>
                                            <span className={`badge ${getStatusClass(submission.status)}`}>
                                                {submission.status || "UNKNOWN"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="code-section">
                                        <div className="code-label">Submitted Code:</div>
                                        <pre className="code-block">
                                            {submission.code || "// No code submitted"}
                                        </pre>
                                    </div>

                                    {/* Smart Action Buttons */}
                                    <div className="btn-row">
                                        {currentStatus !== "APPROVED" && (
                                            <button
                                                className="btn btn-approve"
                                                onClick={() => approveSubmission(submission.id)}
                                            >
                                                ✔ Approve
                                            </button>
                                        )}
                                        
                                        {currentStatus !== "REJECTED" && (
                                            <button
                                                className="btn btn-reject"
                                                onClick={() => rejectSubmission(submission.id)}
                                            >
                                                ✖ Reject
                                            </button>
                                        )}
                                    </div>
                                    
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}