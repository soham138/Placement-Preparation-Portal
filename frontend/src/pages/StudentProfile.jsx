import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {

    const [selectedResume, setSelectedResume] =
    useState(null);

    const token = localStorage.getItem("token");

    const [isNewProfile, setIsNewProfile] = useState(false);

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

            } else {

                setIsNewProfile(true);
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

            loadProfile();

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

        const file = new Blob(
            [response.data],
            {
                type: "application/pdf"
            }
        );

        const url =
            window.URL.createObjectURL(file);

        window.open(url, "_blank");

    } catch (error) {

        console.log(error);

        alert("Unable to open resume.");

    }
};

    return (

        <div style={{ padding: "20px" }}>

            <h1>My Profile</h1>

            <hr />

            <input
                type="text"
                placeholder="Full Name"
                value={form.fullName || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        fullName: e.target.value
                    })
                }
                style={{ width: "400px" }}
            />

            <br /><br />

            <input
                type="text"
                placeholder="College"
                value={form.college || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        college: e.target.value
                    })
                }
                style={{ width: "400px" }}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Branch"
                value={form.branch || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        branch: e.target.value
                    })
                }
                style={{ width: "250px" }}
            />

            <br /><br />

            <input
                type="number"
                placeholder="Year"
                value={form.year || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        year: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="PRN / Roll Number"
                value={form.prn || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        prn: e.target.value
                    })
                }
                style={{ width: "300px" }}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Phone Number"
                value={form.phone || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        phone: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="number"
                step="0.01"
                placeholder="CGPA"
                value={form.cgpa || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        cgpa: e.target.value
                    })
                }
            />

            <br /><br />

            <textarea
                rows="3"
                cols="70"
                placeholder="Skills (Comma Separated)"
                value={form.skills || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        skills: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="GitHub Profile URL"
                value={form.github || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        github: e.target.value
                    })
                }
                style={{ width: "500px" }}
            />

            <br /><br />

            <input
                type="text"
                placeholder="LinkedIn Profile URL"
                value={form.linkedin || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        linkedin: e.target.value
                    })
                }
                style={{ width: "500px" }}
            />

            <br /><br />

            <input
    type="file"
    accept=".pdf"
    onChange={(e) =>
        setSelectedResume(e.target.files[0])
    }
/>

<br /><br />

<button
    onClick={uploadResume}
>
    Upload Resume
</button>

<br /><br />

<button onClick={viewResume}>
    View Resume
</button>

            <br /><br />

            <textarea
                rows="6"
                cols="80"
                placeholder="About Me"
                value={form.about || ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        about: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={saveProfile}>
                {isNewProfile ? "Create Profile" : "Update Profile"}
            </button>

        </div>
    );
}