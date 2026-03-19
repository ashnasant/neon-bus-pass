import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Apply = () => {
    const { user } = useAuth();
    const [routes, setRoutes] = useState([]);
    const [status, setStatus] = useState('');
    const [formData, setFormData] = useState({
        route_id: '',
        receipt_no: '',
        semester: '5'
    });

    useEffect(() => {
        const fetchRoutes = async () => {
            const res = await api.get('/routes');
            setRoutes(res.data);
        };
        fetchRoutes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedRoute = routes.find(r => r.id === formData.route_id);
        const applicationData = {
            student_id: user.id,
            student_name: user.name,
            roll_no: user.roll_no || 'NOT_SET',
            dept: user.dept || 'NOT_SET',
            route_id: formData.route_id,
            semester: formData.semester,
            phone: user.phone || '0000000000',
            amount: selectedRoute ? selectedRoute.fare : 0,
            receipt_no: formData.receipt_no
        };

        try {
            await api.post('/applications', applicationData);
            setStatus('Application submitted successfully!');
        } catch (err) {
            setStatus('Failed to submit application.');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '32px' }}>📝</div>
                    <div>
                        <h3 className="card-title">Apply for Bus Pass</h3>
                        <p className="card-sub">Choose your route and provide payment details.</p>
                    </div>
                </div>
                
                {status && <div className={`alert ${status.includes('success') ? 'alert-success' : 'alert-danger'}`}>{status}</div>}

                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Select Preferred Route</label>
                        <select className="form-input" style={{ height: '50px' }} onChange={e => setFormData({...formData, route_id: e.target.value})} required>
                            <option value="">-- Choose a Route --</option>
                            {routes.map(r => (
                                <option key={r.id} value={r.id}>{r.name} - ₹{r.fare}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Academic Semester</label>
                            <input type="text" className="form-input" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fee Receipt Number</label>
                            <input type="text" className="form-input" placeholder="e.g. REC-2024-XXXX" onChange={e => setFormData({...formData, receipt_no: e.target.value})} required />
                        </div>
                    </div>

                    <div className="alert alert-success" style={{ backgroundColor: '#e7f1ff', color: '#0056b3', border: '1px dashed #0056b3' }}>
                        <strong>Note:</strong> Please ensure the receipt number matches your physical college payment slip for faster approval.
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ padding: '16px' }}>Submit Pass Application</button>
                </form>
            </div>
        </div>
    );
};

export default Apply;
