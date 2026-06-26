import { useEffect, useState } from "react";
import axios from "axios";

export default function Coding() {

    const [questions, setQuestions] = useState([]);
    const [code, setCode] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState({});

    const [difficultyFilter, setDifficultyFilter] =
        useState("ALL");

    const [topicFilter, setTopicFilter] =
        useState("ALL");

    const [companyFilter, setCompanyFilter] =
        useState("ALL");

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadQuestions();
        loadSubmissions();
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

            console.log("QUESTIONS:", res.data);

            setQuestions(res.data);

        } catch (err) {

            console.log("LOAD ERROR:", err);
        }
    };

    const loadSubmissions = async () => {

        try {

            const res = await axios.get(
                "http://localhost:8081/api/coding/submissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const map = {};

            res.data.forEach(s => {
                map[s.questionId] = s.status;
            });

            setSubmissionStatus(map);

        } catch (err) {

            console.log(err);
        }
    };

    const submitSolution = async (id) => {

        if (!code[id]) {

            alert("Write code first");
            return;
        }

        try {

            const res = await axios.post(
                `http://localhost:8081/api/coding/${id}/submit`,
                {
                    code: code[id]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.message);

            loadSubmissions();

        } catch (err) {

            console.log("SUBMIT ERROR:", err);
        }
    };

    const filteredQuestions = questions.filter(q => {

        const difficultyMatch =
            difficultyFilter === "ALL" ||
            q.difficulty === difficultyFilter;

        const topicMatch =
            topicFilter === "ALL" ||
            q.topic === topicFilter;

        const companyMatch =
            companyFilter === "ALL" ||
            q.company === companyFilter;

        return (
            difficultyMatch &&
            topicMatch &&
            companyMatch
        );
    });

    const topics =
        [...new Set(
            questions
                .map(q => q.topic)
                .filter(Boolean)
        )];

    const companies =
        [...new Set(
            questions
                .map(q => q.company)
                .filter(Boolean)
        )];

    return (

        <div style={{ padding: "20px" }}>

            <h1>Coding Questions</h1>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}
            >

                <select
                    value={difficultyFilter}
                    onChange={(e) =>
                        setDifficultyFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="ALL">
                        All Difficulty
                    </option>

                    <option value="EASY">
                        EASY
                    </option>

                    <option value="MEDIUM">
                        MEDIUM
                    </option>

                    <option value="HARD">
                        HARD
                    </option>

                </select>

                <select
                    value={topicFilter}
                    onChange={(e) =>
                        setTopicFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="ALL">
                        All Topics
                    </option>

                    {topics.map(topic => (

                        <option
                            key={topic}
                            value={topic}
                        >
                            {topic}
                        </option>

                    ))}
                </select>

                <select
                    value={companyFilter}
                    onChange={(e) =>
                        setCompanyFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="ALL">
                        All Companies
                    </option>

                    {companies.map(company => (

                        <option
                            key={company}
                            value={company}
                        >
                            {company}
                        </option>

                    ))}
                </select>

            </div>

            {filteredQuestions.length === 0 && (

                <p>
                    No questions found
                </p>

            )}

            {filteredQuestions.map((q) => (

                <div
                    key={q.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "10px"
                    }}
                >

                    <h2>{q.title}</h2>

                    <p>{q.description}</p>

                    <p>
                        <b>Difficulty:</b>{" "}
                        {q.difficulty}
                    </p>

                    <p>
                        <b>Topic:</b>{" "}
                        {q.topic}
                    </p>

                    <p>
                        <b>Company:</b>{" "}
                        {q.company}
                    </p>

                    <textarea
                        rows="8"
                        cols="90"
                        placeholder="Write your code..."
                        value={code[q.id] || ""}
                        onChange={(e) =>
                            setCode({
                                ...code,
                                [q.id]:
                                    e.target.value
                            })
                        }
                    />

                    <br /><br />

                    <button
                        onClick={() =>
                            submitSolution(q.id)
                        }
                        disabled={
                            submissionStatus[q.id]
                        }
                    >
                        {
                            submissionStatus[q.id]
                                ? "Submitted"
                                : "Submit"
                        }
                    </button>

                    {submissionStatus[q.id] && (

                        <p>
                            Status:
                            {" "}
                            {
                                submissionStatus[q.id]
                            }
                        </p>

                    )}

                </div>

            ))}

        </div>
    );
}