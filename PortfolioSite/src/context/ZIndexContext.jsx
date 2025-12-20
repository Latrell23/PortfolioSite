import React, { createContext, useContext, useState, useCallback } from 'react'

const ZIndexContext = createContext()

// Base z-index values
const BASE_Z_INDEX = 1999
const FOCUSED_Z_INDEX = 2001

export function ZIndexProvider({ children }) {
    // Track which type of element is currently focused: 'window' or 'popup'
    const [focusedElement, setFocusedElement] = useState('window')

    const bringToFront = useCallback((elementType) => {
        setFocusedElement(elementType)
    }, [])

    const getWindowZIndex = useCallback(() => {
        return focusedElement === 'window' ? FOCUSED_Z_INDEX : BASE_Z_INDEX
    }, [focusedElement])

    const getPopupZIndex = useCallback(() => {
        return focusedElement === 'popup' ? FOCUSED_Z_INDEX : BASE_Z_INDEX
    }, [focusedElement])

    return (
        <ZIndexContext.Provider value={{
            bringToFront,
            getWindowZIndex,
            getPopupZIndex,
            focusedElement
        }}>
            {children}
        </ZIndexContext.Provider>
    )
}

export function useZIndex() {
    const context = useContext(ZIndexContext)
    if (!context) {
        throw new Error('useZIndex must be used within a ZIndexProvider')
    }
    return context
}
