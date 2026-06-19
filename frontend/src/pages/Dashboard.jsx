import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalAttempts: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/aptitude/score",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Placement Preparation Portal</h1>

            <h2>Dashboard</h2>

            <hr />

            <h2>Aptitude Statistics</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "30px"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Questions</h3>
                    <h2>36</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Attempts</h3>
                    <h2>{stats.totalAttempts}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Correct Answers</h3>
                    <h2>{stats.correctAnswers}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Wrong Answers</h3>
                    <h2>{stats.wrongAnswers}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Accuracy</h3>
                    <h2>{stats.accuracy.toFixed(2)}%</h2>
                </div>

            </div>

            <hr />

            <h3>Aptitude Modules</h3>

            <button onClick={() => navigate("/aptitude")}>
                Aptitude Test
            </button>

            <br /><br />

            <button onClick={() => navigate("/practice")}>
                Practice Mode
            </button>

            <br /><br />

            <button onClick={() => navigate("/history")}>
                Attempt History
            </button>

            <br /><br />

            <button onClick={() => navigate("/leaderboard")}>
                Leaderboard
            </button>

            <br /><br />

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;