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
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setNotes(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredNotes = notes.filter((note) => {
        const matchesCategory = category === "ALL" ? true : note.category === category;
        const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <style>{`
                .notes-wrapper { min-height: 100vh; background: #f3f4f6; padding: 40px 20px; font-family: -apple-system, sans-serif; }
                .notes-container { max-width: 1000px; margin: 0 auto; }
                
                .page-header { margin-bottom: 32px; }
                .page-title { font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 20px; }
                
                /* Filter Bar */
                .filter-bar { 
                    background: white; padding: 16px; border-radius: 12px; 
                    display: flex; gap: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb; margin-bottom: 30px; 
                }
                .search-input, .cat-select { 
                    padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; 
                }
                .search-input { flex: 2; }
                .cat-select { flex: 1; }

                /* Notes Grid */
                .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
                
                .note-card { 
                    background: white; border-radius: 12px; padding: 24px; 
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb; transition: transform 0.2s;
                }
                .note-card:hover { transform: translateY(-4px); }
                
                .note-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 12px 0; }
                .note-category { 
                    display: inline-block; padding: 4px 10px; border-radius: 6px; 
                    background: #eff6ff; color: #1e40af; font-size: 11px; font-weight: 700; text-transform: uppercase;
                }
                .note-content { 
                    margin-top: 16px; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;
                }
            `}</style>

            <div className="notes-wrapper">
                <div className="notes-container">
                    <div className="page-header">
                        <h1 className="page-title">Study Materials</h1>
                        <div className="filter-bar">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search notes by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select className="cat-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="ALL">All Categories</option>
                                <option value="APTITUDE">Aptitude</option>
                                <option value="REASONING">Reasoning</option>
                                <option value="VERBAL">Verbal</option>
                                <option value="JAVA">Java</option>
                                <option value="DSA">DSA</option>
                                <option value="SQL">SQL</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="HR">HR</option>
                            </select>
                        </div>
                    </div>

                    <div className="notes-grid">
                        {filteredNotes.length === 0 ? (
                            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#6b7280' }}>No Notes Found</p>
                        ) : (
                            filteredNotes.map((note) => (
                                <div key={note.id} className="note-card">
                                    <h2 className="note-title">{note.title}</h2>
                                    <span className="note-category">{note.category}</span>
                                    <div className="note-content">{note.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}