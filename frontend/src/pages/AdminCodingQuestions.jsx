import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCodingQuestions() {
    const token = localStorage.getItem("token");

    // --- NEW STATE FOR TABS ---
    // 'LIST' shows existing questions, 'FORM' shows the add/edit form
    const [activeTab, setActiveTab] = useState("LIST");

    const [questions, setQuestions] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        difficulty: "",
        topic: "",
        company: "",
        solution: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8081/api/coding",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuestions(res.data);
        } catch (err) {
            console.log("LOAD ERROR:", err);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveQuestion = async () => {
        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:8081/api/coding/admin/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Question Updated");
            } else {
                await axios.post(
                    "http://localhost:8081/api/coding/admin",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Question Added");
            }

            resetForm();
            loadQuestions();
            setActiveTab("LIST"); // Go back to the list after saving
        } catch (err) {
            console.log("SAVE ERROR:", err);
            alert("Operation Failed");
        }
    };

    const editQuestion = (q) => {
        setEditingId(q.id);

        setForm({
            title: q.title || "",
            description: q.description || "",
            difficulty: q.difficulty || "",
            topic: q.topic || "",
            company: q.company || "",
            solution: q.solution || ""
        });

        // Switch to the form tab automatically
        setActiveTab("FORM");
    };

    const deleteQuestion = async (id) => {
        if (!window.confirm("Delete this question?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8081/api/coding/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Question Deleted");
            loadQuestions();
        } catch (err) {
            console.log("DELETE ERROR:", err);
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            title: "",
            description: "",
            difficulty: "",
            topic: "",
            company: "",
            solution: ""
        });

        // Switch back to list if they cancel
        setActiveTab("LIST");
    };

    return (
        <>
            <style>{`
                .admin-wrapper {
                    min-height: 100vh;
                    background-color: #f8f9fa;
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
                
                /* --- Custom Tabs Layout --- */
                .tabs-header {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    border-bottom: 2px solid #e5e7eb;
                }
                .tab-btn {
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                    position: relative;
                    transition: color 0.2s;
                }
                .tab-btn:hover {
                    color: #374151;
                }
                .tab-btn.active {
                    color: #3b82f6;
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; /* Pull it down over the border */
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #3b82f6;
                    border-radius: 2px 2px 0 0;
                }

                /* --- Form Layout --- */
                .card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .form-col-full { grid-column: span 2; }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4b5563;
                }
                .form-input, .form-textarea, .form-select {
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                .code-font {
                    font-family: 'Courier New', Courier, monospace;
                    background-color: #f9fafb;
                }
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                /* --- List Layout --- */
                .list-filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .question-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    animation: fadeIn 0.3s ease;
                }
                .question-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 12px 0;
                }
                .badge-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }
                .badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    background-color: #f3f4f6;
                    color: #374151;
                }
                .badge-EASY { background-color: #d1fae5; color: #065f46; }
                .badge-MEDIUM { background-color: #fef3c7; color: #92400e; }
                .badge-HARD { background-color: #fee2e2; color: #991b1b; }
                
                .desc-box {
                    background-color: #f9fafb;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #f3f4f6;
                    font-size: 14px;
                    color: #4b5563;
                    margin-bottom: 16px;
                    white-space: pre-wrap;
                }

                /* --- Buttons --- */
                .btn-row { display: flex; gap: 12px; margin-top: 24px; }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-primary { background-color: #3b82f6; color: white; }
                .btn-primary:hover { background-color: #2563eb; }
                .btn-secondary { background-color: #e5e7eb; color: #374151; }
                .btn-secondary:hover { background-color: #d1d5db; }
                .btn-danger { background-color: #ef4444; color: white; }
                .btn-danger:hover { background-color: #dc2626; }
                .btn-edit { background-color: #10b981; color: white; }
                .btn-edit:hover { background-color: #059669; }
            `}</style>

            <div className="admin-wrapper">
                <div className="admin-container">
                    <h1 className="page-title">Manage Coding Questions</h1>

                    {/* --- TABS HEADER --- */}
                    <div className="tabs-header">
                        <button 
                            className={`tab-btn ${activeTab === "LIST" ? "active" : ""}`}
                            onClick={() => { setActiveTab("LIST"); resetForm(); }}
                        >
                            💻 All Questions
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === "FORM" ? "active" : ""}`}
                            onClick={() => setActiveTab("FORM")}
                        >
                            {editingId ? "✏️ Edit Question" : "➕ Add New Question"}
                        </button>
                    </div>

                    {/* --- TAB CONTENT: LIST VIEW --- */}
                    {activeTab === "LIST" && (
                        <div className="list-view">
                            <div className="list-filters">
                                <h3 style={{ margin: 0, color: "#1f2937" }}>
                                    Total Questions: {questions.length}
                                </h3>
                            </div>

                            <div className="questions-list">
                                {questions.map((q) => {
                                    const diffClass = q.difficulty ? `badge-${q.difficulty.toUpperCase()}` : "";
                                    
                                    return (
                                        <div key={q.id} className="question-card">
                                            <h3 className="question-title">{q.title}</h3>
                                            
                                            <div className="badge-row">
                                                <span className={`badge ${diffClass}`}>{q.difficulty || "No Difficulty"}</span>
                                                {q.topic && <span className="badge">🔖 {q.topic}</span>}
                                                {q.company && <span className="badge">🏢 {q.company}</span>}
                                            </div>

                                            <div className="desc-box">
                                                {q.description || "No description provided."}
                                            </div>

                                            <div className="btn-row" style={{ marginTop: "0" }}>
                                                <button className="btn btn-edit" onClick={() => editQuestion(q)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger" onClick={() => deleteQuestion(q.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {questions.length === 0 && (
                                    <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
                                        No coding questions found. Click "Add New Question" to create one!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- TAB CONTENT: FORM VIEW --- */}
                    {activeTab === "FORM" && (
                        <div className="card">
                            <div className="form-grid">
                                <div className="form-group form-col-full">
                                    <label>Title</label>
                                    <input
                                        className="form-input"
                                        name="title"
                                        placeholder="e.g., Two Sum"
                                        value={form.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group form-col-full">
                                    <label>Description</label>
                                    <textarea
                                        className="form-textarea"
                                        name="description"
                                        placeholder="Explain the problem constraints and objectives..."
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <select
                                        className="form-select"
                                        name="difficulty"
                                        value={form.difficulty}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Difficulty</option>
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Topic</label>
                                    <input
                                        className="form-input"
                                        name="topic"
                                        placeholder="e.g., Arrays, Dynamic Programming"
                                        value={form.topic}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Company Tag</label>
                                    <input
                                        className="form-input"
                                        name="company"
                                        placeholder="e.g., Google, Amazon"
                                        value={form.company}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group form-col-full">
                                    <label>Solution (Code)</label>
                                    <textarea
                                        className="form-textarea code-font"
                                        name="solution"
                                        placeholder="Paste the reference solution code here..."
                                        value={form.solution}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="btn-row">
                                {editingId ? (
                                    <>
                                        <button className="btn btn-primary" onClick={saveQuestion}>
                                            Save Changes
                                        </button>
                                        <button className="btn btn-secondary" onClick={resetForm}>
                                            Cancel Edit
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={saveQuestion}>
                                        Add Question
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}