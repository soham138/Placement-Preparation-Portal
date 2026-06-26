import { useEffect, useState } from "react";
import axios from "axios";

export default function Practice() {
    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState({});
    const [result, setResult] = useState({});
    const [difficulty, setDifficulty] = useState("ALL");

    // --- State for Custom Modal ---
    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "error" // 'error' or 'success'
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/practice"
            );
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelect = (questionId, option) => {
        setSelected({
            ...selected,
            [questionId]: option
        });
    };

    const checkAnswer = async (questionId) => {
        if (!selected[questionId]) {
            setModal({
                isOpen: true,
                message: "Please select an option before checking your answer.",
                type: "error"
            });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8081/api/practice/${questionId}/check`,
                {
                    selectedAnswer: selected[questionId]
                }
            );

            setResult({
                ...result,
                [questionId]: response.data
            });
        } catch (error) {
            console.log(error);
            setModal({
                isOpen: true,
                message: "An error occurred while checking your answer.",
                type: "error"
            });
        }
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const filteredQuestions = questions.filter(q =>
        difficulty === "ALL"
            ? true
            : q.difficulty === difficulty
    );

    return (
        <>
            <style>{`
                .practice-wrapper {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    padding: 40px 20px;
                }
                .practice-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* --- Header Section --- */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    background: white;
                    padding: 24px 32px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .page-title {
                    margin: 0;
                    font-size: 28px;
                    color: #111827;
                    font-weight: 700;
                }
                .filter-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .filter-label {
                    font-size: 15px;
                    font-weight: 600;
                    color: #4b5563;
                }
                .filter-select {
                    padding: 10px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    background-color: white;
                    cursor: pointer;
                    outline: none;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }
                .filter-select:focus {
                    border-color: #8b5cf6; /* A purple tone to distinguish Practice mode */
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
                }

                /* --- Main Layout Grid --- */
                .questions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
                    gap: 24px;
                    align-items: start;
                }

                /* --- Question Card --- */
                .question-card {
                    background: white;
                    border-radius: 12px;
                    padding: 28px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .question-header {
                    margin-bottom: 20px;
                }
                .difficulty-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }
                .badge-EASY { background-color: #d1fae5; color: #065f46; }
                .badge-MEDIUM { background-color: #fef3c7; color: #92400e; }
                .badge-HARD { background-color: #fee2e2; color: #991b1b; }
                .badge-DEFAULT { background-color: #e5e7eb; color: #374151; }
                
                .question-text {
                    margin: 0;
                    font-size: 18px;
                    color: #1f2937;
                    font-weight: 600;
                    line-height: 1.5;
                }

                /* --- Options 2x2 Grid --- */
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 24px;
                    flex-grow: 1;
                }
                
                @media (max-width: 500px) {
                    .options-grid { grid-template-columns: 1fr; }
                    .questions-grid { grid-template-columns: 1fr; }
                }

                .option-label {
                    display: flex;
                    align-items: center;
                    padding: 14px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background-color: #ffffff;
                    color: #4b5563;
                    font-size: 15px;
                    font-weight: 500;
                    word-break: break-word;
                }
                .option-label:hover:not(.disabled-option) {
                    border-color: #d1d5db;
                    background-color: #f9fafb;
                }
                .option-label.selected {
                    border-color: #8b5cf6;
                    background-color: #f5f3ff;
                    color: #6d28d9;
                }
                .option-label.disabled-option {
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .option-input {
                    margin-right: 12px;
                    width: 18px;
                    height: 18px;
                    accent-color: #8b5cf6;
                    cursor: inherit;
                }

                /* --- Footer & Results --- */
                .card-footer {
                    margin-top: auto;
                }
                .submit-btn {
                    background-color: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    width: 100%;
                }
                .submit-btn:hover:not(:disabled) {
                    background-color: #7c3aed;
                }
                .submit-btn:disabled {
                    background-color: #d1d5db;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .result-banner {
                    margin-top: 16px;
                    padding: 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    font-size: 15px;
                    animation: popIn 0.3s ease-out;
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .result-correct {
                    background-color: #d1fae5;
                    color: #065f46;
                    border: 1px solid #a7f3d0;
                }
                .result-wrong {
                    background-color: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                }
                .empty-state {
                    text-align: center;
                    grid-column: 1 / -1;
                    padding: 40px;
                    color: #6b7280;
                    font-size: 18px;
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
                    background-color: #8b5cf6;
                    transition: background-color 0.2s ease-in-out;
                }
                .modal-close-button:hover {
                    background-color: #7c3aed;
                }
            `}</style>

            {/* Custom Modal for Alerts */}
            {modal.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <p className="modal-icon">{modal.type === "error" ? "⚠️" : "✅"}</p>
                        <h3 className="modal-title-text">
                            {modal.type === "error" ? "Notice" : "Success"}
                        </h3>
                        <p className="modal-subtitle-text">{modal.message}</p>
                        <button className="modal-close-button" onClick={closeModal}>
                            Okay
                        </button>
                    </div>
                </div>
            )}

            <div className="practice-wrapper">
                <div className="practice-container">
                    
                    {/* Header with Filters */}
                    <div className="page-header">
                        <h1 className="page-title">Practice Mode</h1>
                        <div className="filter-box">
                            <span className="filter-label">Difficulty:</span>
                            <select
                                className="filter-select"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="ALL">All Levels</option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Main Questions Grid */}
                    <div className="questions-grid">
                        {filteredQuestions.length === 0 ? (
                            <div className="empty-state">
                                No practice questions found for the selected difficulty level.
                            </div>
                        ) : (
                            filteredQuestions.map((q) => {
                                const badgeClass = q.difficulty ? `badge-${q.difficulty.toUpperCase()}` : "badge-DEFAULT";
                                const isAnswered = !!result[q.id];

                                return (
                                    <div key={q.id} className="question-card">
                                        
                                        <div className="question-header">
                                            <span className={`difficulty-badge ${badgeClass}`}>
                                                {q.difficulty || "UNKNOWN"}
                                            </span>
                                            <h3 className="question-text">{q.question}</h3>
                                        </div>

                                        {/* Nested 2x2 Options Grid */}
                                        <div className="options-grid">
                                            <label className={`option-label ${selected[q.id] === "A" ? "selected" : ""} ${isAnswered ? "disabled-option" : ""}`}>
                                                <input
                                                    className="option-input"
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    checked={selected[q.id] === "A"}
                                                    onChange={() => !isAnswered && handleSelect(q.id, "A")}
                                                    disabled={isAnswered}
                                                />
                                                {q.optionA}
                                            </label>

                                            <label className={`option-label ${selected[q.id] === "B" ? "selected" : ""} ${isAnswered ? "disabled-option" : ""}`}>
                                                <input
                                                    className="option-input"
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    checked={selected[q.id] === "B"}
                                                    onChange={() => !isAnswered && handleSelect(q.id, "B")}
                                                    disabled={isAnswered}
                                                />
                                                {q.optionB}
                                            </label>

                                            <label className={`option-label ${selected[q.id] === "C" ? "selected" : ""} ${isAnswered ? "disabled-option" : ""}`}>
                                                <input
                                                    className="option-input"
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    checked={selected[q.id] === "C"}
                                                    onChange={() => !isAnswered && handleSelect(q.id, "C")}
                                                    disabled={isAnswered}
                                                />
                                                {q.optionC}
                                            </label>

                                            <label className={`option-label ${selected[q.id] === "D" ? "selected" : ""} ${isAnswered ? "disabled-option" : ""}`}>
                                                <input
                                                    className="option-input"
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    checked={selected[q.id] === "D"}
                                                    onChange={() => !isAnswered && handleSelect(q.id, "D")}
                                                    disabled={isAnswered}
                                                />
                                                {q.optionD}
                                            </label>
                                        </div>

                                        <div className="card-footer">
                                            <button 
                                                className="submit-btn" 
                                                onClick={() => checkAnswer(q.id)}
                                                disabled={isAnswered}
                                            >
                                                {isAnswered ? "Answer Checked" : "Check Answer"}
                                            </button>

                                            {result[q.id] && (
                                                result[q.id].correct ? (
                                                    <div className="result-banner result-correct">
                                                        <span>✅</span> 
                                                        <span>Correct Answer! Well done.</span>
                                                    </div>
                                                ) : (
                                                    <div className="result-banner result-wrong">
                                                        <span>❌</span> 
                                                        <span>
                                                            Incorrect. The correct answer is <strong>Option {result[q.id].correctAnswer} ({q[`option${result[q.id].correctAnswer}`]})</strong>.
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                </div>
            </div>
        </>
    );
}