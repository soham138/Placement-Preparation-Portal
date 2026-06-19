import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {

    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/aptitude/leaderboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLeaders(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Leaderboard</h1>

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
                        <th>Rank</th>
                        <th>Email</th>
                        <th>Score</th>
                        <th>Total Attempts</th>
                        <th>Accuracy</th>
                    </tr>

                </thead>

                <tbody>

                    {leaders.map((user, index) => (

                        <tr key={user.userEmail}>

                            <td>{index + 1}</td>

                            <td>
                                {user.userEmail}
                            </td>

                            <td>
                                {user.correctAnswers}
                            </td>

                            <td>
                                {user.totalAttempts}
                            </td>

                            <td>
                                {user.accuracy.toFixed(2)}%
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}