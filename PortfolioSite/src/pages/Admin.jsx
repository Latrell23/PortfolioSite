import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function Admin({ onLogout }) {
    const [resume, setResume] = useState(null)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadResume()
    }, [])

    const loadResume = async () => {
        try {
            setLoading(true)
            const data = await api.getResume()
            setResume(data)
        } catch (err) {
            setResume(null)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setMessage('')
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            setMessage('Please select a file')
            return
        }

        try {
            setUploading(true)
            await api.uploadResume(file)
            setMessage('Resume uploaded successfully!')
            setFile(null)
            loadResume()
        } catch (err) {
            setMessage('Upload failed: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete the resume?')) return

        try {
            await api.deleteResume()
            setResume(null)
            setMessage('Resume deleted')
        } catch (err) {
            setMessage('Delete failed: ' + err.message)
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Admin Panel</h2>
                <button className="admin-logout-btn" onClick={onLogout}>Logout</button>
            </div>

            <div className="admin-section">
                <h3>Current Resume</h3>
                {loading ? (
                    <p className="admin-loading">Loading...</p>
                ) : resume ? (
                    <div className="admin-resume-info">
                        <div className="resume-file-card">
                            <span className="file-icon">📄</span>
                            <div className="file-details">
                                <span className="file-name">{resume.original_name}</span>
                                <span className="file-meta">{formatFileSize(resume.file_size)} • Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button className="admin-delete-btn" onClick={handleDelete}>Delete</button>
                    </div>
                ) : (
                    <p className="admin-no-resume">No resume uploaded</p>
                )}
            </div>

            <div className="admin-section">
                <h3>Upload New Resume</h3>
                <form onSubmit={handleUpload} className="admin-upload-form">
                    <label className="admin-file-input">
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        <span className="file-input-label">
                            {file ? file.name : 'Choose PDF or Word file'}
                        </span>
                    </label>
                    <button type="submit" className="admin-upload-btn" disabled={uploading || !file}>
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </form>
                {message && <p className={`admin-message ${message.includes('success') ? 'success' : ''}`}>{message}</p>}
            </div>
        </div>
    )
}

export function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (response.ok) {
                const data = await response.json()
                sessionStorage.setItem('adminToken', data.token)
                onLogin()
            } else {
                setError('Invalid password')
            }
        } catch (err) {
            setError('Connection error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <h2>Admin Access</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="admin-password-input"
                        autoFocus
                    />
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
                {error && <p className="admin-error">{error}</p>}
            </div>
        </div>
    )
}
