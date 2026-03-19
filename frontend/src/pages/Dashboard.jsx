import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        if (user.role === 'admin') {
            fetchAnalytics();
        }
    }, [user.role]);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/admin/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error('Failed to fetch analytics');
        }
    };

    const renderAdminDashboard = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{analytics?.stats.activePasses || 0}</div>
                    <div className="stat-label">Active Passes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{analytics?.stats.totalApplications || 0}</div>
                    <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">₹{analytics?.stats.totalRevenue || 0}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
            </div>

            <div className="grid-2 mt-4">
                <div className="card">
                    <h3 className="card-title">Route Distribution</h3>
                    <div className="chart-container">
                        {analytics && <Pie data={{
                            labels: analytics.routeDistribution.map(r => r.name),
                            datasets: [{
                                data: analytics.routeDistribution.map(r => r.count),
                                backgroundColor: ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14'],
                                borderWidth: 0
                            }]
                        }} options={{ maintainAspectRatio: false }} />}
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '48px' }}>📅</div>
                        <h3>System Active</h3>
                        <p className="text-muted">Academic Year 2024-25</p>
                    </div>
                </div>
            </div>
        </>
    );

    const renderStudentDashboard = () => (
        <div className="dashboard-content">
            <div className="welcome-banner" style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, #004085 100%)', 
                color: 'white', padding: '30px', borderRadius: '20px', marginBottom: '25px',
                boxShadow: '0 10px 20px rgba(0, 86, 179, 0.15)'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome, {user.name}!</h1>
                <p style={{ opacity: 0.9 }}>Digital Bus Pass ID: {user.id}</p>
            </div>

            <div className="grid-2">
                <div className="card highlight-card" style={{ borderLeft: '5px solid var(--primary)' }}>
                    <h3 className="card-title">Student Profile</h3>
                    <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span className="text-muted">Roll Number</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '1.1rem' }}>{user.roll_no || 'Not Set'}</span>
                    </div>
                    <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span className="text-muted">Department</span>
                        <span style={{ fontWeight: '600' }}>{user.dept || 'Not Set'}</span>
                    </div>
                    <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                        <span className="text-muted">Semester</span>
                        <span style={{ fontWeight: '600' }}>{user.semester || 'N/A'}</span>
                    </div>
                </div>

                <div className="card highlight-card" style={{ borderLeft: '5px solid #28a745', background: '#f8fff9' }}>
                    <h3 className="card-title">Pass Validity</h3>
                    <div className="text-center" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '10px' }}>✓</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#155724' }}>Account Active</div>
                        <p className="text-muted" style={{ marginTop: '10px' }}>Your digital pass is verified and ready for travel.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {user.role === 'admin' ? renderAdminDashboard() : renderStudentDashboard()}
        </>
    );
};

export default Dashboard;
