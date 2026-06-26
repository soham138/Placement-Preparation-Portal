import { useEffect, useState } from "react";
import axios from "axios";

export default function CodingLeaderboard() {

    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadLeaderboard();

    }, []);

    const loadLeaderboard = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await axios.get(
                    "http://localhost:8081/api/coding/leaderboard",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.log(
                "Leaderboard Response:",
                response.data
            );

            if (
                Array.isArray(
                    response.data
                )
            ) {

                setLeaders(
                    response.data
                );

            } else {

                setLeaders([]);

                console.log(
                    "Response is not an array"
                );
            }

        } catch (error) {

            console.log(error);

            setLeaders([]);

        } finally {

            setLoading(false);

        }
    };

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Coding Leaderboard
            </h1>

            {
                loading && (
                    <h3>
                        Loading...
                    </h3>
                )
            }

            {
                !loading &&
                leaders.length === 0 && (

                    <h3>
                        No leaderboard data found
                    </h3>

                )
            }

            {
                !loading &&
                leaders.length > 0 && (

                    <table
                        border="1"
                        cellPadding="10"
                    >

                        <thead>

                            <tr>

                                <th>
                                    Rank
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Solved Questions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                leaders.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {
                                                    index + 1
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.solved
                                                }
                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );
}