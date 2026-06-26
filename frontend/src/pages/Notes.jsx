import { useEffect, useState } from "react";
import axios from "axios";

export default function Notes() {
    const token = localStorage.getItem("token");
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {

        try {

           const response = await axios.get(
    "http://localhost:8081/api/notes",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

            setNotes(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const filteredNotes = notes.filter((note) => {

        const matchesCategory =
            category === "ALL"
                ? true
                : note.category === category;

        const matchesSearch =
            note.title
                .toLowerCase()
                .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (

        <div style={{ padding: "20px" }}>

            <h1>Study Materials</h1>

            <br />

            <input
                type="text"
                placeholder="Search Notes..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <br /><br />

            <select
                value={category}
                onChange={(e) =>
                    setCategory(e.target.value)
                }
            >
                <option value="ALL">
                    All Categories
                </option>

                <option value="APTITUDE">
                    Aptitude
                </option>

                <option value="REASONING">
                    Reasoning
                </option>

                <option value="VERBAL">
                    Verbal
                </option>

                <option value="JAVA">
                    Java
                </option>

                <option value="DSA">
                    DSA
                </option>

                <option value="SQL">
                    SQL
                </option>

                <option value="INTERVIEW">
                    Interview
                </option>

                <option value="HR">
                    HR
                </option>
            </select>

            <br /><br />

            {filteredNotes.length === 0 && (
                <p>No Notes Found</p>
            )}

            {filteredNotes.map((note) => (

                <div
                    key={note.id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "15px"
                    }}
                >

                    <h2>{note.title}</h2>

                    <p>
                        <strong>Category:</strong>{" "}
                        {note.category}
                    </p>

                    <hr />

                    <p
                        style={{
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {note.content}
                    </p>

                </div>
            ))}

        </div>
    );
}