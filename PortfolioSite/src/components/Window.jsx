import React, { useState, useRef, useEffect } from 'react'
import Popup from './Popup'
import LinkPopup from './LinkPopup'
import DownloadPopup from './DownloadPopup'
import GalleryPopup from './GalleryPopup'

export default function Window({ isOpen, onClose, title, children, popup, linkPopup, downloadPopup, galleryPopup }) {
    const [position, setPosition] = useState({ x: 100, y: 100 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const windowRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight
            setPosition({
                x: Math.max(50, (viewportWidth - 600) / 2),
                y: Math.max(50, (viewportHeight - 400) / 2)
            })
        }
    }, [isOpen])

    const handleMouseDown = (e) => {
        if (e.target.closest('.window-close-btn')) return
        setIsDragging(true)
        const rect = windowRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 300)
        const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 200)
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
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset])

    if (!isOpen) return null

    return (
        <>
            {popup && (
                <Popup
                    isOpen={isOpen}
                    imageSrc={popup.imageSrc}
                    alt={popup.alt}
                    initialPosition={popup.position}
                />
            )}
            {linkPopup && (
                <LinkPopup
                    isOpen={isOpen}
                    links={linkPopup.links}
                    initialPosition={linkPopup.position}
                />
            )}
            {downloadPopup && (
                <DownloadPopup
                    isOpen={isOpen}
                    file={downloadPopup.file}
                    initialPosition={downloadPopup.position}
                />
            )}
            {galleryPopup && (
                <GalleryPopup
                    isOpen={isOpen}
                    images={galleryPopup.images}
                    initialPosition={galleryPopup.position}
                />
            )}
            <div
                ref={windowRef}
                className="window-container"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            >
                <div
                    className="window-header"
                    onMouseDown={handleMouseDown}
                >
                    <span className="window-title">{title}</span>
                    <button className="window-close-btn" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="window-content">
                    {children}
                </div>
            </div>
        </>
    )
}
