import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (id, newRole) => {
        try {
            await api.patch(`/admin/users/${id}/role`, { role: newRole });
            const updatedUsers = users.map(u => u.id === id ? { ...u, role: newRole } : u);
            setUsers(updatedUsers);
        } catch (err) {
            alert('Failed to update role');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h3 className="card-title">System Users</h3>
                <p className="card-sub">Overview of registered students and staff. You can promote students to admin role here.</p>
                <div className="table-wrap mt-4">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td><div style={{ fontWeight: 600 }}>{u.id}</div></td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role === 'student' ? (
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRoleUpdate(u.id, 'admin')}>Make Admin</button>
                                        ) : (
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRoleUpdate(u.id, 'student')}>Revoke Admin</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
