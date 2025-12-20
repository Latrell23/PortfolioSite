import React, { useState, useRef, useEffect } from 'react'
import { api } from '../services/api'

export default function DownloadPopup({ isOpen, file, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [dbResume, setDbResume] = useState(null)
    const popupRef = useRef(null)

    useEffect(() => {
        if (isOpen && initialPosition) {
            setPosition(initialPosition)
        }
    }, [isOpen, initialPosition])

    useEffect(() => {
        if (isOpen) {
            api.getResume()
                .then(data => setDbResume(data))
                .catch(() => setDbResume(null))
        }
    }, [isOpen])

    const handleMouseDown = (e) => {
        if (e.target.closest('a')) return
        setIsDragging(true)
        const rect = popupRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleTouchStart = (e) => {
        if (e.target.closest('a')) return
        setIsDragging(true)
        const rect = popupRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        setDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        const maxX = window.innerWidth - (popupRef.current?.offsetWidth || 200)
        const maxY = window.innerHeight - (popupRef.current?.offsetHeight || 200)
        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        })
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        const touch = e.touches[0]
        const newX = touch.clientX - dragOffset.x
        const newY = touch.clientY - dragOffset.y
        const maxX = window.innerWidth - (popupRef.current?.offsetWidth || 200)
        const maxY = window.innerHeight - (popupRef.current?.offsetHeight || 200)
        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove, { passive: false })
            document.addEventListener('touchend', handleMouseUp)
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleMouseUp)
        }
    }, [isDragging, dragOffset])

    if (!isOpen) return null

    const API_BASE_URL = import.meta.env.VITE_API_URL || ''
    const downloadUrl = dbResume ? `${API_BASE_URL}/api/resume/download` : file.src
    const fileName = dbResume ? dbResume.original_name : file.name
    const fileType = dbResume?.mime_type?.includes('pdf') ? 'PDF Document' :
        dbResume?.mime_type?.includes('word') ? 'Word Document' : 'PDF Document'

    return (
        <div
            ref={popupRef}
            className="download-popup-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="download-popup-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
                </svg>
            </div>
            <div className="download-popup-info">
                <span className="download-popup-filename">{fileName}</span>
                <span className="download-popup-type">{fileType}</span>
            </div>
            <a
                href={downloadUrl}
                download={fileName}
                className="download-popup-btn"
                target={dbResume ? '_blank' : undefined}
                rel={dbResume ? 'noopener noreferrer' : undefined}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
            </a>
        </div>
    )
}
