import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminNotes() {
    console.log(localStorage.getItem("token"));
    const token = localStorage.getItem("token");

    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const formRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        category: "APTITUDE",
        content: ""
    });

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

    const saveNote = async () => {
        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:8081/api/notes/admin/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Note Updated");
            } else {
                await axios.post(
                    "http://localhost:8081/api/notes/admin",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Note Added");
            }

            resetForm();
            loadNotes();
        } catch (error) {
            console.log(error);
        }
    };

    const editNote = (note) => {
        setEditingId(note.id);
        setForm({
            title: note.title,
            category: note.category,
            content: note.content
        });

        formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const deleteNote = async (id) => {
        if (!window.confirm("Delete this note?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8081/api/notes/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Note Deleted");
            loadNotes();
        } catch (error) {
            console.log(error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "",
            category: "APTITUDE",
            content: ""
        });
    };

    // Helper to assign badge colors based on category
    const getBadgeClass = (category) => {
        const cat = category?.toUpperCase();
        if (["JAVA", "DSA", "SQL"].includes(cat)) return "badge-tech";
        if (["APTITUDE", "REASONING"].includes(cat)) return "badge-logic";
        return "badge-soft"; // VERBAL, INTERVIEW, HR
    };

    return (
        <>
            <style>{`
                .admin-wrapper {
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    padding: 40px 20px;
                }
                .admin-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                }
                
                /* Form Card */
                .card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    margin-bottom: 40px;
                }
                .card-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-top: 0;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                /* Inputs */
                .form-row {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex: 1;
                    min-width: 250px;
                }
                .form-group.full-width {
                    flex-basis: 100%;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #4b5563;
                }
                .form-input, .form-select, .form-textarea {
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    transition: border-color 0.2s;
                    font-family: inherit;
                    width: 100%;
                    box-sizing: border-box;
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 150px;
                    line-height: 1.5;
                }
                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
                
                /* Buttons */
                .btn-row {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-primary { background-color: #3b82f6; color: white; }
                .btn-primary:hover { background-color: #2563eb; }
                .btn-secondary { background-color: #e5e7eb; color: #374151; }
                .btn-secondary:hover { background-color: #d1d5db; }
                .btn-danger { background-color: #fee2e2; color: #b91c1c; }
                .btn-danger:hover { background-color: #fca5a5; color: #991b1b; }
                .btn-edit { background-color: #d1fae5; color: #065f46; }
                .btn-edit:hover { background-color: #a7f3d0; color: #064e3b; }

                /* Notes Grid */
                .section-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 20px;
                }
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                /* Note Card */
                .note-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .note-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .note-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .note-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                    line-height: 1.3;
                }
                .note-content {
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.6;
                    background-color: #f9fafb;
                    padding: 12px;
                    border-radius: 8px;
                    flex-grow: 1;
                    margin-bottom: 20px;
                    white-space: pre-wrap;
                }
                
                /* Badges */
                .badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }
                .badge-tech { background-color: #e0e7ff; color: #3730a3; }
                .badge-logic { background-color: #fef3c7; color: #92400e; }
                .badge-soft { background-color: #d1fae5; color: #065f46; }
            `}</style>

            <div className="admin-wrapper">
                <div className="admin-container">
                    <h1 className="page-title">Manage Study Notes</h1>

                    {/* --- ADD/EDIT FORM CARD --- */}
                    <div className="card" ref={formRef}>
                        <h2 className="card-title">
                            {editingId ? "Update Note" : "Create New Note"}
                        </h2>

                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Note Title</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g., Introduction to Dynamic Programming"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Category</label>
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="APTITUDE">APTITUDE</option>
                                    <option value="REASONING">REASONING</option>
                                    <option value="VERBAL">VERBAL</option>
                                    <option value="JAVA">JAVA</option>
                                    <option value="DSA">DSA</option>
                                    <option value="SQL">SQL</option>
                                    <option value="INTERVIEW">INTERVIEW</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Note Content</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Write the study material or note content here..."
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                            />
                        </div>

                        <div className="btn-row">
                            <button className="btn btn-primary" onClick={saveNote}>
                                {editingId ? "Update Note" : "Add Note"}
                            </button>
                            <button className="btn btn-secondary" onClick={resetForm}>
                                Clear Form
                            </button>
                        </div>
                    </div>

                    {/* --- NOTES LIST --- */}
                    <h2 className="section-title">All Published Notes</h2>

                    {notes.length === 0 && (
                        <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
                            No notes available. Create your first note above!
                        </p>
                    )}

                    <div className="notes-grid">
                        {notes.map((note) => (
                            <div key={note.id} className="note-card">
                                <div className="note-header">
                                    <h3 className="note-title">{note.title}</h3>
                                    <span className={`badge ${getBadgeClass(note.category)}`}>
                                        {note.category}
                                    </span>
                                </div>

                                <div className="note-content">
                                    {note.content.length > 200
                                        ? note.content.substring(0, 200) + "..."
                                        : note.content}
                                </div>

                                <div className="btn-row" style={{ marginTop: "auto" }}>
                                    <button 
                                        className="btn btn-edit" 
                                        style={{ flex: 1 }} 
                                        onClick={() => editNote(note)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger" 
                                        style={{ flex: 1 }} 
                                        onClick={() => deleteNote(note.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}