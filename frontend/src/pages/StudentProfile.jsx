import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
    const token = localStorage.getItem("token");
    
    const [selectedResume, setSelectedResume] = useState(null);
    const [isNewProfile, setIsNewProfile] = useState(false);
    
    // --- NEW STATE FOR TABS ---
    // 'VIEW' shows the read-only profile, 'EDIT' shows the form
    const [activeTab, setActiveTab] = useState("VIEW");

    const [form, setForm] = useState({
        fullName: "",
        college: "",
        branch: "",
        year: "",
        prn: "",
        phone: "",
        cgpa: "",
        skills: "",
        github: "",
        linkedin: "",
        resumeUrl: "",
        about: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                setForm(response.data);
                setIsNewProfile(false);
                setActiveTab("VIEW"); // Show profile if it exists
            } else {
                setIsNewProfile(true);
                setActiveTab("EDIT"); // Force form if no profile exists
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveProfile = async () => {
        try {
            if (isNewProfile) {
                await axios.post(
                    "http://localhost:8081/api/profile",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Profile Created Successfully");
            } else {
                await axios.put(
                    "http://localhost:8081/api/profile",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Profile Updated Successfully");
            }
            
            // Reload and switch back to View mode
            await loadProfile();
            setActiveTab("VIEW");
            
        } catch (error) {
            console.log(error);
        }
    };

    const uploadResume = async () => {
        if (!selectedResume) {
            alert("Please Select Resume");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedResume);

        try {
            await axios.post(
                "http://localhost:8081/api/profile/resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Resume Uploaded Successfully");
            loadProfile();
        } catch (error) {
            console.log(error);
            alert(error.response?.data || "Upload Failed");
        }
    };

    const viewResume = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/profile/resume",
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const file = new Blob([response.data], {
                type: "application/pdf"
            });

            const url = window.URL.createObjectURL(file);
            window.open(url, "_blank");
        } catch (error) {
            console.log(error);
            alert("Unable to open resume.");
        }
    };

    return (
        <>
            <style>{`
                .profile-wrapper {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    padding: 40px 20px;
                }
                .profile-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                    text-align: center;
                }

                /* --- Custom Tabs Layout --- */
                .tabs-header {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    border-bottom: 2px solid #e5e7eb;
                    justify-content: center;
                }
                .tab-btn {
                    padding: 12px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                    position: relative;
                    transition: color 0.2s;
                }
                .tab-btn:hover {
                    color: #374151;
                }
                .tab-btn.active {
                    color: #3b82f6;
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #3b82f6;
                    border-radius: 2px 2px 0 0;
                }
                
                /* Main Card */
                .profile-card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 40px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                    margin-top: 32px;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #f3f4f6;
                }
                .section-title:first-child {
                    margin-top: 0;
                }
                
                /* --- VIEW MODE STYLES --- */
                .view-header {
                    text-align: center;
                    margin-bottom: 32px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .avatar-placeholder {
                    width: 80px;
                    height: 80px;
                    background-color: #e0e7ff;
                    color: #3730a3;
                    font-size: 32px;
                    font-weight: 700;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                }
                .view-name {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 8px 0;
                }
                .view-subtitle {
                    font-size: 16px;
                    color: #6b7280;
                    margin: 0;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 24px;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .info-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .info-value {
                    font-size: 16px;
                    color: #111827;
                    font-weight: 500;
                }
                .skills-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }
                .skill-badge {
                    background-color: #f3f4f6;
                    color: #374151;
                    padding: 6px 12px;
                    border-radius: 9999px;
                    font-size: 13px;
                    font-weight: 600;
                }
                .about-box {
                    background-color: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #f3f4f6;
                    font-size: 15px;
                    color: #4b5563;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                /* --- EDIT MODE STYLES --- */
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .full-width {
                    grid-column: span 2;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4b5563;
                }
                .form-input, .form-textarea {
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1f2937;
                    transition: all 0.2s ease;
                    background-color: #f9fafb;
                    font-family: inherit;
                }
                .form-input:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                    line-height: 1.5;
                }
                .resume-section {
                    background-color: #f8fafc;
                    border: 1px dashed #cbd5e1;
                    border-radius: 8px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .file-input {
                    font-size: 14px;
                    color: #4b5563;
                }
                .file-input::file-selector-button {
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    background-color: white;
                    color: #374151;
                    font-weight: 600;
                    cursor: pointer;
                    margin-right: 12px;
                    transition: all 0.2s;
                }
                .file-input::file-selector-button:hover {
                    background-color: #f3f4f6;
                }
                
                /* Buttons */
                .btn-row {
                    display: flex;
                    gap: 12px;
                }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                }
                .btn-primary {
                    background-color: #3b82f6;
                    color: white;
                    padding: 14px 24px;
                    font-size: 16px;
                    width: 100%;
                    margin-top: 32px;
                }
                .btn-primary:hover { background-color: #2563eb; }
                .btn-outline {
                    background-color: white;
                    color: #3b82f6;
                    border: 1px solid #3b82f6;
                }
                .btn-outline:hover { background-color: #eff6ff; }
                .btn-secondary {
                    background-color: #e5e7eb;
                    color: #374151;
                }
                .btn-secondary:hover { background-color: #d1d5db; }
            `}</style>

            <div className="profile-wrapper">
                <div className="profile-container">
                    <h1 className="page-title">My Profile</h1>

                    {/* --- TABS HEADER --- */}
                    {!isNewProfile && (
                        <div className="tabs-header">
                            <button 
                                className={`tab-btn ${activeTab === "VIEW" ? "active" : ""}`}
                                onClick={() => setActiveTab("VIEW")}
                            >
                                👤 View Profile
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === "EDIT" ? "active" : ""}`}
                                onClick={() => setActiveTab("EDIT")}
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    )}

                    <div className="profile-card">
                        
                        {/* =========================================
                            TAB: VIEW PROFILE 
                        ========================================= */}
                        {activeTab === "VIEW" && !isNewProfile && (
                            <div className="view-mode">
                                <div className="view-header">
                                    <div className="avatar-placeholder">
                                        {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <h2 className="view-name">{form.fullName || "Student Name"}</h2>
                                    <p className="view-subtitle">{form.college || "College Name"} • {form.branch || "Branch"}</p>
                                    
                                    <div className="btn-row" style={{ justifyContent: "center", marginTop: "16px" }}>
                                        <button className="btn btn-outline" onClick={viewResume}>
                                            📄 View Resume
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setActiveTab("EDIT")}>
                                            ✏️ Update Profile
                                        </button>
                                    </div>
                                </div>

                                <h2 className="section-title">Academic & Contact Info</h2>
                                <div className="info-grid">
                                    
                                    <div className="info-item">
                                        <span className="info-label">Year of Graduation</span>
                                        <span className="info-value">{form.year || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">CGPA</span>
                                        <span className="info-value">{form.cgpa || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone Number</span>
                                        <span className="info-value">{form.phone || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">GitHub</span>
                                        <span className="info-value">
                                            {form.github ? <a href={form.github} target="_blank" rel="noreferrer" style={{color: "#3b82f6"}}>{form.github}</a> : "N/A"}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">LinkedIn</span>
                                        <span className="info-value">
                                            {form.linkedin ? <a href={form.linkedin} target="_blank" rel="noreferrer" style={{color: "#3b82f6"}}>{form.linkedin}</a> : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="section-title">Skills & Professional Summary</h2>
                                <div className="info-item" style={{ marginBottom: "20px" }}>
                                    <span className="info-label">Skills</span>
                                    <div className="skills-badges">
                                        {form.skills ? (
                                            form.skills.split(',').map((skill, index) => (
                                                <span key={index} className="skill-badge">{skill.trim()}</span>
                                            ))
                                        ) : (
                                            <span className="info-value">No skills added yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="info-item">
                                    <span className="info-label" style={{ marginBottom: "8px" }}>About Me</span>
                                    <div className="about-box">
                                        {form.about || "You haven't written an about me section yet."}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================
                            TAB: EDIT / CREATE PROFILE FORM
                        ========================================= */}
                        {activeTab === "EDIT" && (
                            <div className="edit-mode">
                                <h2 className="section-title">Personal Information</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Full Name</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={form.fullName || ""}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="e.g. +91 9876543210"
                                            value={form.phone || ""}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                    
                                </div>

                                <h2 className="section-title">Academic Details</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>College</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter your college name"
                                            value={form.college || ""}
                                            onChange={(e) => setForm({ ...form, college: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Branch</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            value={form.branch || ""}
                                            onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Year of Graduation</label>
                                        <input
                                            className="form-input"
                                            type="number"
                                            placeholder="e.g. 2026"
                                            value={form.year || ""}
                                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>CGPA</label>
                                        <input
                                            className="form-input"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g. 8.5"
                                            value={form.cgpa || ""}
                                            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <h2 className="section-title">Professional Details</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Skills (Comma Separated)</label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="e.g. React, Node.js, Python, SQL"
                                            value={form.skills || ""}
                                            onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>GitHub Profile URL</label>
                                        <input
                                            className="form-input"
                                            type="url"
                                            placeholder="https://github.com/yourusername"
                                            value={form.github || ""}
                                            onChange={(e) => setForm({ ...form, github: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>LinkedIn Profile URL</label>
                                        <input
                                            className="form-input"
                                            type="url"
                                            placeholder="https://linkedin.com/in/yourusername"
                                            value={form.linkedin || ""}
                                            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>About Me</label>
                                        <textarea
                                            className="form-textarea"
                                            style={{ minHeight: "120px" }}
                                            placeholder="Write a short professional summary about yourself..."
                                            value={form.about || ""}
                                            onChange={(e) => setForm({ ...form, about: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <h2 className="section-title">Resume Management</h2>
                                <div className="resume-section">
                                    <input
                                        className="file-input"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setSelectedResume(e.target.files[0])}
                                    />
                                    
                                    <div className="btn-row">
                                        <button className="btn btn-outline" onClick={uploadResume}>
                                            📤 Upload Replace Resume
                                        </button>
                                        {!isNewProfile && (
                                            <button className="btn btn-secondary" onClick={viewResume}>
                                                📄 View Current
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button className="btn btn-primary" onClick={saveProfile}>
                                    {isNewProfile ? "Create Profile" : "Save Profile Changes"}
                                </button>
                                
                                {!isNewProfile && (
                                    <button 
                                        className="btn btn-secondary" 
                                        style={{ width: "100%", marginTop: "12px" }} 
                                        onClick={() => setActiveTab("VIEW")}
                                    >
                                        Cancel Editing
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}