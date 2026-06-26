import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminQuestions() {
    // --- NEW STATE FOR TABS ---
    // 'LIST' shows existing questions, 'FORM' shows the add/edit form
    const [activeTab, setActiveTab] = useState("LIST");

    const [questions, setQuestions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [form, setForm] = useState({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        difficulty: "EASY",
        type: "TEST"
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/aptitude/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuestions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addQuestion = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:8081/api/aptitude/admin",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Question Added Successfully");
            resetForm();
            loadQuestions();
            setActiveTab("LIST"); // Go back to the list after adding
        } catch (error) {
            console.log(error);
        }
    };

    const updateQuestion = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/api/aptitude/admin/${editingId}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Question Updated Successfully");
            resetForm();
            loadQuestions();
            setActiveTab("LIST"); // Go back to the list after updating
        } catch (error) {
            console.log(error);
        }
    };

    const deleteQuestion = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8081/api/aptitude/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Question Deleted Successfully");
            loadQuestions();
        } catch (error) {
            console.log(error);
        }
    };

    const editQuestion = (question) => {
        setEditingId(question.id);

        setForm({
            question: question.question,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            difficulty: question.difficulty,
            type: question.type
        });

        // Switch to the form tab automatically when they click Edit
        setActiveTab("FORM"); 
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            question: "",
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
            correctAnswer: "",
            difficulty: "EASY",
            type: "TEST"
        });

        // Also switch back to list if they cancel
        setActiveTab("LIST");
    };

    const filteredQuestions =
        typeFilter === "ALL"
            ? questions
            : questions.filter((q) => q.type === typeFilter);

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

                /* Form Layout */
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
                .form-input, .form-select {
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    transition: border-color 0.2s;
                }
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                /* List Layout */
                .list-filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .question-item {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    animation: fadeIn 0.3s ease;
                }
                .question-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .question-text {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }
                .badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .badge-EASY { background-color: #d1fae5; color: #065f46; }
                .badge-MEDIUM { background-color: #fef3c7; color: #92400e; }
                .badge-HARD { background-color: #fee2e2; color: #991b1b; }
                .badge-TEST { background-color: #e0e7ff; color: #3730a3; }
                .badge-PRACTICE { background-color: #f3e8ff; color: #6b21a8; }
                
                .options-display {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                    background-color: #f9fafb;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #f3f4f6;
                }
                .option-text { font-size: 14px; color: #4b5563; margin: 0; }
                .correct-highlight { font-size: 14px; font-weight: 600; color: #059669; margin-bottom: 16px; }

                /* Buttons */
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
                    <h1 className="page-title">Manage Aptitude Questions</h1>

                    {/* --- TABS HEADER --- */}
                    <div className="tabs-header">
                        <button 
                            className={`tab-btn ${activeTab === "LIST" ? "active" : ""}`}
                            onClick={() => { setActiveTab("LIST"); resetForm(); }}
                        >
                            📚 All Questions
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
                                    Total Questions: {filteredQuestions.length}
                                </h3>
                                <select
                                    className="form-select"
                                    style={{ width: "auto" }}
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="ALL">Filter: All Types</option>
                                    <option value="TEST">Filter: Test Only</option>
                                    <option value="PRACTICE">Filter: Practice Only</option>
                                </select>
                            </div>

                            <div className="questions-list">
                                {filteredQuestions.map((q) => (
                                    <div key={q.id} className="question-item">
                                        <div className="question-item-header">
                                            <h3 className="question-text">{q.question}</h3>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                                                <span className={`badge badge-${q.type}`}>{q.type}</span>
                                            </div>
                                        </div>

                                        <div className="options-display">
                                            <p className="option-text"><strong>A:</strong> {q.optionA}</p>
                                            <p className="option-text"><strong>B:</strong> {q.optionB}</p>
                                            <p className="option-text"><strong>C:</strong> {q.optionC}</p>
                                            <p className="option-text"><strong>D:</strong> {q.optionD}</p>
                                        </div>

                                        <div className="correct-highlight">
                                            ✔ Correct Answer is Option {q.correctAnswer}
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
                                ))}
                                
                                {filteredQuestions.length === 0 && (
                                    <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
                                        No questions found. Click "Add New Question" to create one.
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
                                    <label>Question Text</label>
                                    <input
                                        className="form-input"
                                        placeholder="Enter the question text"
                                        value={form.question}
                                        onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Option A</label>
                                    <input
                                        className="form-input"
                                        placeholder="Option A text"
                                        value={form.optionA}
                                        onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Option B</label>
                                    <input
                                        className="form-input"
                                        placeholder="Option B text"
                                        value={form.optionB}
                                        onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Option C</label>
                                    <input
                                        className="form-input"
                                        placeholder="Option C text"
                                        value={form.optionC}
                                        onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Option D</label>
                                    <input
                                        className="form-input"
                                        placeholder="Option D text"
                                        value={form.optionD}
                                        onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Correct Answer</label>
                                    <select
                                        className="form-select"
                                        value={form.correctAnswer}
                                        onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                                    >
                                        <option value="">Select Option</option>
                                        <option value="A">Option A</option>
                                        <option value="B">Option B</option>
                                        <option value="C">Option C</option>
                                        <option value="D">Option D</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <select
                                        className="form-select"
                                        value={form.difficulty}
                                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>

                                <div className="form-group form-col-full">
                                    <label>Question Type</label>
                                    <select
                                        className="form-select"
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    >
                                        <option value="TEST">Test</option>
                                        <option value="PRACTICE">Practice</option>
                                    </select>
                                </div>
                            </div>

                            <div className="btn-row">
                                {editingId ? (
                                    <>
                                        <button className="btn btn-primary" onClick={updateQuestion}>
                                            Save Changes
                                        </button>
                                        <button className="btn btn-secondary" onClick={resetForm}>
                                            Cancel Edit
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={addQuestion}>
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