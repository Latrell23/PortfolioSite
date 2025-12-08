import { useState, useEffect } from 'react'
import './App.css'
import Background from './components/Background'
import NavBar from './components/NavBar'
import Screen from './components/Screen'
import Window from './components/Window'
import About from './pages/About'
import Projects, { projectImages } from './pages/Projects'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import Admin, { AdminLogin } from './pages/Admin'
import memphisImg from './assets/memphis.png'
import resumePdf from './assets/resume/LatrellPrice_Resume2025.pdf'

const pageConfig = {
  About: {
    component: <About />,
    popup: {
      imageSrc: memphisImg,
      alt: 'Memphis, TN',
      position: { x: 80, y: 120 }
    },
    linkPopup: null,
    downloadPopup: null,
    galleryPopup: null
  },
  Projects: {
    component: <Projects />,
    popup: null,
    linkPopup: null,
    downloadPopup: null,
    galleryPopup: {
      images: projectImages,
      position: { x: 60, y: 100 }
    }
  },
  Resume: {
    component: <Resume />,
    popup: null,
    linkPopup: null,
    downloadPopup: {
      file: {
        src: resumePdf,
        name: 'LatrellPrice_Resume2025.pdf'
      },
      position: { x: 80, y: 120 }
    },
    galleryPopup: null
  },
  Contact: {
    component: <Contact />,
    popup: null,
    linkPopup: {
      links: [
        { type: 'github', label: 'GitHub', url: 'https://www.github.com/latrell23' },
        { type: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/latrelljprice/' }
      ],
      position: { x: 80, y: 150 }
    },
    downloadPopup: null,
    galleryPopup: null
  }
}

function App() {
  const [openWindows, setOpenWindows] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/admin') {
      setIsAdmin(true)
      const token = sessionStorage.getItem('adminToken')
      if (token) setIsLoggedIn(true)
    }
  }, [])

  const handleNavClick = (pageName) => {
    setOpenWindows(prev => ({
      ...prev,
      [pageName]: true
    }))
  }

  const handleCloseWindow = (pageName) => {
    setOpenWindows(prev => ({
      ...prev,
      [pageName]: false
    }))
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    setIsLoggedIn(false)
  }

  if (isAdmin) {
    return (
      <div className="app-root">
        <Background />
        {isLoggedIn ? (
          <Admin onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={() => setIsLoggedIn(true)} />
        )}
      </div>
    )
  }

  return (
    <div className="app-root">
      <Background />
      <div className='signature' />
      <Screen>
        <NavBar onNavClick={handleNavClick} />
        {Object.keys(pageConfig).map((pageName) => (
          <Window
            key={pageName}
            isOpen={openWindows[pageName] || false}
            onClose={() => handleCloseWindow(pageName)}
            title={pageName}
            popup={pageConfig[pageName].popup}
            linkPopup={pageConfig[pageName].linkPopup}
            downloadPopup={pageConfig[pageName].downloadPopup}
            galleryPopup={pageConfig[pageName].galleryPopup}
          >
            {pageConfig[pageName].component}
          </Window>
        ))}
      </Screen>
    </div>
  )
}

export default App
