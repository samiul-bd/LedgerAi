import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import axios from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/Auth/login', { email, password });
            
            if (response.data.isSuccess) {
                localStorage.setItem('token', response.data.token);
                navigate('/accounts');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setMessage(err.response?.data?.message || 'Login failed. Please try again.');
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '3rem' }}></i>
                    <h3 className="mt-2">LedgerAI Login</h3>
                </div>
                
                {message && <div className="alert alert-danger py-2">{message}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email address</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-key-fill"></i></span>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                        <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;