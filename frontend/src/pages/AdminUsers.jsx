import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8081/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const editUser = async (user) => {
        const name = prompt("Enter Name", user.name);

        if (!name) {
            return;
        }

        const role = prompt("Enter Role (ADMIN/STUDENT)", user.role);

        if (!role) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/api/admin/users/${user.id}`,
                {
                    name,
                    role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("User Updated Successfully");
            loadUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const resetPassword = async (id) => {
        const password = prompt("Enter New Password");

        if (!password) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/api/admin/users/${id}/reset-password`,
                {
                    password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Password Reset Successful");
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8081/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("User Deleted Successfully");
            loadUsers();
        } catch (error) {
            console.log(error);
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
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                }
                
                /* Table Container */
                .table-card {
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                    overflow: hidden; /* Ensures rounded corners clip the table */
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .data-table th {
                    background-color: #f9fafb;
                    padding: 16px 24px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e5e7eb;
                }
                .data-table td {
                    padding: 16px 24px;
                    font-size: 14px;
                    color: #111827;
                    border-bottom: 1px solid #e5e7eb;
                    vertical-align: middle;
                }
                .data-table tbody tr:last-child td {
                    border-bottom: none;
                }
                .data-table tbody tr {
                    transition: background-color 0.2s ease;
                }
                .data-table tbody tr:hover {
                    background-color: #f9fafb;
                }

                /* Role Badges */
                .badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: inline-block;
                }
                .badge-ADMIN {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                .badge-STUDENT {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .badge-DEFAULT {
                    background-color: #f3f4f6;
                    color: #374151;
                }

                /* Action Buttons */
                .btn-group {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                }
                .btn-edit {
                    background-color: #e0f2fe;
                    color: #0284c7;
                }
                .btn-edit:hover {
                    background-color: #bae6fd;
                }
                .btn-reset {
                    background-color: #fef3c7;
                    color: #d97706;
                }
                .btn-reset:hover {
                    background-color: #fde68a;
                }
                .btn-delete {
                    background-color: #fee2e2;
                    color: #dc2626;
                }
                .btn-delete:hover {
                    background-color: #fecaca;
                }
                
                .empty-state {
                    text-align: center;
                    color: #6b7280;
                    padding: 40px;
                }
            `}</style>

            <div className="admin-wrapper">
                <div className="admin-container">
                    <h1 className="page-title">Manage Users</h1>

                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-state">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => {
                                        // Dynamically assign badge class based on role
                                        const roleClass = user.role === "ADMIN" || user.role === "STUDENT" 
                                            ? `badge-${user.role}` 
                                            : "badge-DEFAULT";

                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <strong>{user.name}</strong>
                                                </td>
                                                <td style={{ color: "#4b5563" }}>
                                                    {user.email}
                                                </td>
                                                <td>
                                                    <span className={`badge ${roleClass}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-edit"
                                                            onClick={() => editUser(user)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-reset"
                                                            onClick={() => resetPassword(user.id)}
                                                        >
                                                            Reset Password
                                                        </button>
                                                        <button
                                                            className="btn btn-delete"
                                                            onClick={() => deleteUser(user.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}