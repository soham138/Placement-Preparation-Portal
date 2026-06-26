import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfiles() {
    const token = localStorage.getItem("token");

    const [profiles, setProfiles] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [branchFilter, setBranchFilter] = useState("ALL");
    const [yearFilter, setYearFilter] = useState("ALL");

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/profile/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setProfiles(response.data);
        } catch (error) {
            console.log(error);
            alert("Unable to load student profiles.");
        }
    };

    const filteredProfiles = profiles.filter((profile) => {
        const matchesName = profile.fullName
            ?.toLowerCase()
            .includes(searchName.toLowerCase());

        const matchesBranch =
            branchFilter === "ALL"
                ? true
                : profile.branch === branchFilter;

        const matchesYear =
            yearFilter === "ALL"
                ? true
                : profile.year === yearFilter;

        return matchesName && matchesBranch && matchesYear;
    });

    const viewResume = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `http://localhost:8081/api/profile/admin/resume/${id}`,
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const file = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(file);
            window.open(url);
        } catch (error) {
            console.log(error);
            alert("Unable to open resume");
        }
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
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                }
                
                /* Filter Bar */
                .filter-bar {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    align-items: center;
                    margin-bottom: 32px;
                    border: 1px solid #e5e7eb;
                }
                .form-input, .form-select {
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    transition: border-color 0.2s;
                    flex: 1;
                    min-width: 200px;
                }
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                /* Grid Layout */
                .profiles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 24px;
                }
                
                /* Profile Card */
                .profile-card {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .profile-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                
                /* Header & Badges */
                .profile-header {
                    margin-bottom: 16px;
                }
                .profile-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 12px 0;
                }
                .badge-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-branch { background-color: #e0e7ff; color: #3730a3; }
                .badge-year { background-color: #fce7f3; color: #9d174d; }
                .badge-cgpa { background-color: #d1fae5; color: #065f46; }
                
                /* Profile Details */
                .info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    color: #4b5563;
                }
                .info-item strong {
                    color: #1f2937;
                    font-weight: 600;
                }
                .bio-box {
                    background-color: #f9fafb;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 20px;
                    border: 1px solid #f3f4f6;
                    flex-grow: 1; /* Pushes buttons to bottom */
                }
                
                /* Action Buttons */
                .actions-row {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: auto;
                }
                .btn {
                    flex: 1;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .btn-primary {
                    background-color: #3b82f6;
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #2563eb;
                }
                .btn-outline {
                    background-color: white;
                    border: 1px solid #d1d5db;
                    color: #374151;
                }
                .btn-outline:hover {
                    background-color: #f3f4f6;
                    border-color: #9ca3af;
                }
            `}</style>

            <div className="admin-wrapper">
                <div className="admin-container">
                    <h1 className="page-title">Student Profiles Dashboard</h1>

                    {/* --- Filter Bar --- */}
                    <div className="filter-bar">
                        <input
                            className="form-input search-input"
                            type="text"
                            placeholder="Search by Student Name..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />

                        <select
                            className="form-select"
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                        >
                            <option value="ALL">All Branches</option>
                            <option value="Computer">Computer Engineering</option>
                            <option value="IT">IT</option>
                            <option value="ENTC">ENTC</option>
                            <option value="Mechanical">Mechanical Engineering</option>
                            <option value="Civil">Civil Engineering</option>
                            <option value="Electrical">Electrical Engineering</option>
                        </select>

                        <select
                            className="form-select"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option value="ALL">All Academic Years</option>
                            <option value="First Year">First Year</option>
                            <option value="Second Year">Second Year</option>
                            <option value="Third Year">Third Year</option>
                            <option value="Final Year">Final Year</option>
                        </select>
                    </div>

                    {/* --- Status Messaging --- */}
                    {filteredProfiles.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                            <h3>No Profiles Found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    )}

                    {/* --- Profiles Grid --- */}
                    <div className="profiles-grid">
                        {filteredProfiles.map((profile) => (
                            <div key={profile.id} className="profile-card">
                                
                                <div className="profile-header">
                                    <h2 className="profile-name">{profile.fullName || "Unknown Student"}</h2>
                                    <div className="badge-row">
                                        {profile.branch && <span className="badge badge-branch">{profile.branch}</span>}
                                        {profile.year && <span className="badge badge-year">{profile.year}</span>}
                                        {profile.cgpa && <span className="badge badge-cgpa">CGPA: {profile.cgpa}</span>}
                                    </div>
                                </div>

                                <div className="info-list">
                                    <span className="info-item"><strong>College:</strong> {profile.college || "N/A"}</span>
                                    <span className="info-item"><strong>Email:</strong> {profile.userEmail || "N/A"}</span>
                                    <span className="info-item"><strong>Phone:</strong> {profile.phone || "N/A"}</span>
                                    <span className="info-item"><strong>PRN:</strong> {profile.prn || "N/A"}</span>
                                    <span className="info-item"><strong>Skills:</strong> {profile.skills || "None listed"}</span>
                                </div>

                                <div className="bio-box">
                                    <strong>About:</strong><br/>
                                    {profile.about || "This student hasn't provided an about section yet."}
                                </div>

                                <div className="actions-row">
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => viewResume(profile.id)}
                                    >
                                        📄 View Resume
                                    </button>
                                    
                                    {profile.github && (
                                        <a 
                                            className="btn btn-outline" 
                                            href={profile.github} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                    
                                    {profile.linkedin && (
                                        <a 
                                            className="btn btn-outline" 
                                            href={profile.linkedin} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}