import { useEffect, useState } from "react";
import axios from "axios";

export default function Coding() {
    const token = localStorage.getItem("token");

    const [questions, setQuestions] = useState([]);
    const [code, setCode] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState({});
    const [difficultyFilter, setDifficultyFilter] = useState("ALL");

    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "success"
    });

    useEffect(() => {
        loadQuestions();
        loadSubmissions();
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await axios.get("http://localhost:8081/api/coding", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data);
        } catch (err) {
            console.log("LOAD ERROR:", err);
        }
    };

    const loadSubmissions = async () => {
        try {
            const res = await axios.get("http://localhost:8081/api/coding/submissions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const map = {};
            res.data.forEach(s => { map[s.questionId] = s.status; });
            setSubmissionStatus(map);
        } catch (err) {
            console.log(err);
        }
    };

    const submitSolution = async (id) => {
        if (!code[id] || code[id].trim() === "") {
            setModal({ isOpen: true, message: "Please write some code first.", type: "error" });
            return;
        }

        try {
            const res = await axios.post(`http://localhost:8081/api/coding/${id}/submit`, 
                { code: code[id] }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModal({ isOpen: true, message: res.data.message || "Submitted!", type: "success" });
            loadSubmissions();
        } catch (err) {
            setModal({ isOpen: true, message: "Submission failed.", type: "error" });
        }
    };

    const closeModal = () => setModal({ ...modal, isOpen: false });

    const filteredQuestions = questions.filter(q => 
        difficultyFilter === "ALL" || q.difficulty === difficultyFilter
    );

    const getStatusClass = (status) => {
        const s = status?.toUpperCase() || "";
        if (s.includes("APPROV")) return "status-approved";
        if (s.includes("REJECT")) return "status-rejected";
        return "status-pending";
    };

    return (
        <>
            <style>{`
                .coding-wrapper { background: #f3f4f6; min-height: 100vh; padding: 40px 20px; }
                .container { max-width: 1100px; margin: 0 auto; }
                
                .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                .title { font-size: 32px; font-weight: 800; color: #111827; margin: 0; }
                
                .filter-group { background: white; padding: 6px; border-radius: 12px; border: 1px solid #e5e7eb; }
                .filter-select { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; color: #374151; outline: none; }
                
                .grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
                
                .card { 
                    background: white; border-radius: 16px; padding: 32px; 
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                }
                .q-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .q-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
                .badge { padding: 4px 14px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: #e0e7ff; color: #4338ca; }
                
                .description { color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
                
                .code-area { width: 100%; height: 160px; background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; margin-bottom: 16px; box-sizing: border-box; }
                
                .btn-submit { background: #3b82f6; color: white; width: 100%; padding: 14px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
                .btn-submit:disabled { background: #9ca3af; }
                
                .status-approved { color: #059669; font-weight: 700; margin-top: 12px; display: flex; align-items: center; }
                .status-rejected { color: #dc2626; font-weight: 700; margin-top: 12px; display: flex; align-items: center; }
                .status-pending { color: #d97706; font-weight: 700; margin-top: 12px; display: flex; align-items: center; }

                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-card { background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 300px; }
            `}</style>

            {modal.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card">
                        <h3>{modal.type === "success" ? "✅ Success" : "⚠️ Notice"}</h3>
                        <p>{modal.message}</p>
                        <button onClick={closeModal} style={{ width: '100%', padding: '10px' }}>Okay</button>
                    </div>
                </div>
            )}

            <div className="coding-page">
                <div className="container">
                    <div className="header-section">
                        <h1 className="title">Coding Challenges</h1>
                        <div className="filter-group">
                            <select className="filter-select" onChange={(e) => setDifficultyFilter(e.target.value)}>
                                <option value="ALL">All Difficulties</option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid">
                        {filteredQuestions.map((q) => {
                            const status = submissionStatus[q.id];
                            const isRejected = status === "REJECTED";
                            const isDisabled = status && !isRejected;

                            return (
                                <div key={q.id} className="card">
                                    <div className="q-header">
                                        <h2 className="q-title">{q.title}</h2>
                                        <span className="badge">{q.difficulty}</span>
                                    </div>
                                    <p className="description">{q.description}</p>
                                    <textarea 
                                        className="code-area"
                                        placeholder="Write your code here..."
                                        value={code[q.id] || ""}
                                        onChange={(e) => setCode({...code, [q.id]: e.target.value})}
                                        disabled={isDisabled}
                                    />
                                    <button 
                                        className="btn-submit" 
                                        onClick={() => submitSolution(q.id)}
                                        disabled={isDisabled}
                                    >
                                        {isRejected ? "Re-upload Solution" : (status || "Submit Solution")}
                                    </button>
                                    {status && (
                                        <div className={getStatusClass(status)}>
                                            {status === "APPROVED" ? "✅ Passed" : status === "REJECTED" ? "❌ Rejected" : "⏳ Pending"}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}