import { useEffect, useState } from "react";
import axios from "axios";


export default function Aptitude() {

    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState({});
    const [result, setResult] = useState({});
    const [difficulty, setDifficulty] = useState("ALL");

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/aptitude",
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

    const handleSelect = (questionId, option) => {

        setSelected({
            ...selected,
            [questionId]: option
        });

    };

    const submitAnswer = async (questionId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `http://localhost:8081/api/aptitude/${questionId}/submit`,
                {
                    selectedAnswer: selected[questionId]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = response.data;

            if (!data.success) {
                alert(data.message);
                return;
            }

            setResult(prev => ({
                ...prev,
                [questionId]: {
                    correct: data.correct,
                    correctAnswer: data.correctAnswer
                }
            }));

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

        <div style={{ padding: "30px" }}>

            <h1>Aptitude Test</h1>

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
            checked={selected[q.id] === q.optionA}
            onChange={() =>
                handleSelect(q.id, q.optionA)
            }
        />
        {q.optionA}
    </label>
</div>

<div>
    <label>
        <input
            type="radio"
            name={`q${q.id}`}
            checked={selected[q.id] === q.optionB}
            onChange={() =>
                handleSelect(q.id, q.optionB)
            }
        />
        {q.optionB}
    </label>
</div>

<div>
    <label>
        <input
            type="radio"
            name={`q${q.id}`}
            checked={selected[q.id] === q.optionC}
            onChange={() =>
                handleSelect(q.id, q.optionC)
            }
        />
        {q.optionC}
    </label>
</div>

<div>
    <label>
        <input
            type="radio"
            name={`q${q.id}`}
            checked={selected[q.id] === q.optionD}
            onChange={() =>
                handleSelect(q.id, q.optionD)
            }
        />
        {q.optionD}
    </label>
</div>
                    <br />

                    <button onClick={() => submitAnswer(q.id)}>
                        Submit
                    </button>

                    <br /><br />

                    {result[q.id] && (

                        result[q.id].correct ? (

                            <div
                                style={{
                                    color: "green",
                                    fontWeight: "bold"
                                }}
                            >
                                ✔ Correct Answer
                            </div>

                        ) : (

                            <div
                                style={{
                                    color: "red",
                                    fontWeight: "bold"
                                }}
                            >
                                ❌ Wrong Answer (Correct: {result[q.id].correctAnswer})
                            </div>

                        )

                    )}

                </div>

            ))}

        </div>
    );
}