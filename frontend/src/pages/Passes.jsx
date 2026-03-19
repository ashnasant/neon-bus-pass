import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';

const Passes = () => {
    const { user } = useAuth();
    const [passes, setPasses] = useState([]);

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        const endpoint = user.role === 'admin' 
            ? '/passes' 
            : `/passes/${user.id}`;
        
        try {
            const res = await api.get(endpoint);
            setPasses(res.data);
        } catch (err) {
            console.error('Failed to fetch passes');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h3 className="card-title">{user.role === 'admin' ? 'Recent Passes' : 'My Digital Bus Pass'}</h3>
                <p className="card-sub">Your official transit identity for the academic year.</p>
                
                <div className="grid-2 mt-4">
                    {passes.length > 0 ? passes.map(pass => (
                        <div key={pass.id} className="bus-pass">
                            <div className="pass-header">
                                <div className="pass-college">UNIVERSITY TRANSPORT</div>
                            </div>
                            <div className="pass-body">
                                <div className="pass-qr">
                                    <QRCodeSVG value={pass.id} size={150} />
                                </div>
                                <h2 className="pass-name">{pass.student_name}</h2>
                                <div className="separator"></div>
                                <div className="pass-details-row">
                                    <span className="pass-label">Pass ID</span>
                                    <span className="pass-value">{pass.id}</span>
                                </div>
                                <div className="pass-details-row">
                                    <span className="pass-label">Roll No</span>
                                    <span className="pass-value">{pass.roll_no}</span>
                                </div>
                                <div className="pass-details-row">
                                    <span className="pass-label">Route</span>
                                    <span className="pass-value">{pass.route_id}</span>
                                </div>
                                <div className="pass-details-row">
                                    <span className="pass-label">Trips Left</span>
                                    <span className="pass-value" style={{ color: '#28a745', fontWeight: 'bold' }}>{pass.trips_remaining}</span>
                                </div>
                                <div className="pass-details-row">
                                    <span className="pass-label">Valid Till</span>
                                    <span className="pass-value">{new Date(pass.valid_to).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#28a745', height: '8px' }}></div>
                        </div>
                    )) : (
                        <div className="text-muted">No active passes found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Passes;
