import React from 'react'

export default function NavBar({ onNavClick }) {
  const navItems = ['About', 'Projects', 'Resume', 'Contact']

  return (
    <div className='nav-div'>
      {navItems.map((item) => (
        <h1 key={item} onClick={() => onNavClick(item)}>
          {item}
        </h1>
      ))}
    </div>
  )
}
