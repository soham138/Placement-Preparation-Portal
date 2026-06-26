import { useEffect, useState } from "react";
import axios from "axios";

export default function MySubmissions() {

    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/coding/submissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSubmissions(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>My Coding Submissions</h1>

            <br />

            {submissions.map((s) => (

                <div
                    key={s.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "10px"
                    }}
                >

                    <p>
                        <strong>Question ID:</strong>
                        {" "}
                        {s.questionId}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        {" "}
                        {s.status}
                    </p>

                    <pre
                        style={{
                            background: "#f5f5f5",
                            padding: "10px"
                        }}
                    >
                        {s.code}
                    </pre>

                </div>

            ))}

        </div>

    );
}