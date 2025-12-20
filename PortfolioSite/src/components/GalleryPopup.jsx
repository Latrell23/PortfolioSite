import React, { useState, useRef, useEffect } from 'react'
import { useZIndex } from '../context/ZIndexContext'

export default function GalleryPopup({ isOpen, images, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [currentIndex, setCurrentIndex] = useState(0)
    const popupRef = useRef(null)
    const { bringToFront, getPopupZIndex } = useZIndex()

    useEffect(() => {
        if (isOpen && initialPosition) {
            setPosition(initialPosition)
            setCurrentIndex(0)
        }
    }, [isOpen, initialPosition])

    const handlePopupClick = (e) => {
        // Don't bring to front if clicking navigation buttons or dots
        if (e.target.closest('.gallery-nav-btn') || e.target.closest('.gallery-dots')) return
        bringToFront('popup')
    }

    const handleMouseDown = (e) => {
        if (e.target.closest('.gallery-nav-btn') || e.target.closest('.gallery-dots')) return
        bringToFront('popup')
        setIsDragging(true)
        const rect = popupRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleTouchStart = (e) => {
        if (e.target.closest('.gallery-nav-btn') || e.target.closest('.gallery-dots')) return
        bringToFront('popup')
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

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if (!isOpen || !images || images.length === 0) return null

    const currentImage = images[currentIndex]

    return (
        <div
            ref={popupRef}
            className="gallery-popup-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: getPopupZIndex(),
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handlePopupClick}
        >
            <div className="gallery-image-wrapper">
                <img src={currentImage.src} alt={currentImage.alt} className="gallery-image" />

                {images.length > 1 && (
                    <>
                        <button className="gallery-nav-btn gallery-nav-prev" onClick={goPrev}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button className="gallery-nav-btn gallery-nav-next" onClick={goNext}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            <div className="gallery-footer">
                <span className="gallery-caption">{currentImage.alt}</span>
                {images.length > 1 && (
                    <div className="gallery-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

