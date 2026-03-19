import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Html5QrcodeScanner } from "html5-qrcode";

const Verify = () => {
    const [passId, setPassId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { 
            fps: 10, 
            qrbox: { width: 250, height: 250 } 
        });

        scanner.render(onScanSuccess, onScanError);

        function onScanSuccess(decodedText) {
            scanner.clear(); // Stop scanning after success
            handleVerify(decodedText);
        }

        function onScanError(err) {
            // Silence errors as they happen constantly during scanning
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    const handleVerify = async (scannedId = null) => {
        const targetId = scannedId || passId;
        if (!targetId) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/passes/scan', { passId: targetId });
            if (res.data.success) {
                setResult({ success: true, data: res.data.pass, message: res.data.message });
            }
        } catch (err) {
            setResult({ success: false, message: err.response?.data?.message || 'Verification failed.' });
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 className="card-title text-center">QR Pass Scanner</h3>
            <p className="card-sub text-center">Place the student QR code in front of the camera</p>
            
            <div id="reader" style={{ width: '100%', marginBottom: '20px' }}></div>

            <div className="separator" style={{ margin: '20px 0' }}>Manual Entry</div>

            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter Pass ID" 
                    value={passId}
                    onChange={e => setPassId(e.target.value.toUpperCase())}
                />
                <button className="btn btn-secondary" onClick={() => handleVerify()} disabled={loading}>
                    Verify
                </button>
            </div>

            {result && (
                <div className={`mt-4 alert ${result.success ? 'alert-success' : 'alert-danger'}`} style={{ border: '2px solid' }}>
                    {result.success ? (
                        <div className="text-center">
                            <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>✅</h2>
                            <h3 style={{ margin: 0, color: '#155724' }}>{result.message}</h3>
                            <div className="info-box mt-3" style={{ background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '20px', fontWeight: '800' }}>{result.data.student_name}</div>
                                <div className="text-muted">{result.data.roll_no}</div>
                                <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#0056b3' }}>
                                    Trips Remaining: {result.data.trips_left}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</h2>
                            <h3 style={{ margin: 0 }}>INVALID PASS</h3>
                            <p style={{ marginTop: '10px' }}>{result.message}</p>
                        </div>
                    )}
                    <button className="btn btn-outline-primary w-full mt-3" onClick={() => window.location.reload()}>
                        Scan Next Pass
                    </button>
                </div>
            )}
        </div>
    );
};

export default Verify;
