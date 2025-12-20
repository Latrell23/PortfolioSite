import React, { useState, useRef, useEffect } from 'react'

export default function Popup({ isOpen, imageSrc, alt, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const popupRef = useRef(null)

    useEffect(() => {
        if (isOpen && initialPosition) {
            setPosition(initialPosition)
        }
    }, [isOpen, initialPosition])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        const rect = popupRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleTouchStart = (e) => {
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

    return (
        <div
            ref={popupRef}
            className="popup-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="popup-image-wrapper">
                <img src={imageSrc} alt={alt} className="popup-image" />
            </div>
            <div className="popup-caption">{alt}</div>
        </div>
    )
}
