import React, { useState } from 'react'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        message: ''
    })
    const [status, setStatus] = useState('')

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const { name, title, message } = formData
        const mailtoLink = `mailto:latrell.price23@gmail.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`

        window.location.href = mailtoLink
        setStatus('Opening your email client...')

        setTimeout(() => {
            setFormData({ name: '', title: '', message: '' })
            setStatus('')
        }, 3000)
    }

    return (
        <div className="page-content contact-page">
            <h2>Get In Touch</h2>
            <p className="contact-intro">
                Have a question or opportunity?
                <br />
                I'd love to hear from you.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="title">Subject</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        rows="5"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Send Message
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
                    </svg>
                </button>

                {status && <p className="form-status">{status}</p>}
            </form>
        </div>
    )
}
