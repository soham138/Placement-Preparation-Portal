import { useEffect, useState } from "react";
import axios from "axios";

export default function Practice() {

    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState({});
    const [result, setResult] = useState({});
    const [difficulty, setDifficulty] = useState("ALL");

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
            alert("Please select an option");
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

        }
    };

    const filteredQuestions = questions.filter(q =>
        difficulty === "ALL"
            ? true
            : q.difficulty === difficulty
    );

    return (

        <div style={{ padding: "20px" }}>

            <h1>Practice Mode</h1>

            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option value="ALL">All</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
            </select>

            <br /><br />

            {filteredQuestions.map((q) => (

                <div
                    key={q.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px"
                    }}
                >

                    <h3>{q.question}</h3>

                    <p>
                        <strong>Difficulty:</strong> {q.difficulty}
                    </p>

                    <div>
                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleSelect(q.id, "A")}
                            />
                            {q.optionA}
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleSelect(q.id, "B")}
                            />
                            {q.optionB}
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleSelect(q.id, "C")}
                            />
                            {q.optionC}
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleSelect(q.id, "D")}
                            />
                            {q.optionD}
                        </label>
                    </div>

                    <br />

                    <button onClick={() => checkAnswer(q.id)}>
                        Check Answer
                    </button>

                    <br /><br />

                    {result[q.id] && (

                        result[q.id].correct ? (

                            <strong style={{ color: "green" }}>
                                ✅ Correct Answer
                            </strong>

                        ) : (

                            <strong style={{ color: "red" }}>
                                ❌ Wrong Answer
                                <br />
                                Correct Answer: {result[q.id].correctAnswer}
                            </strong>

                        )

                    )}

                </div>

            ))}

        </div>
    );
}