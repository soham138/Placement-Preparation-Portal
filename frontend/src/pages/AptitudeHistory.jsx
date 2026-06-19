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
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
            <div style={{ padding: "20px" }}>
                <h2>Loading History...</h2>
            </div>
        );
    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>Aptitude History</h1>

            <h3>Total Attempts: {attempts.length}</h3>

            {attempts.length === 0 ? (

                <p>No attempts found.</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

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

                                <td>{attempt.id}</td>

                                <td>
                                    {attempt.questionId}
                                </td>

                                <td>
                                    {attempt.selectedAnswer}
                                </td>

                                <td>
                                    {attempt.correct
                                        ? "✅ Correct"
                                        : "❌ Wrong"}
                                </td>

                                <td>
                                    {attempt.attemptedAt}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}