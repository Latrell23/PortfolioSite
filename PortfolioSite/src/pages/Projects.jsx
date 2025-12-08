import React from 'react'

import img1 from '../assets/projects/studentprayer/IMG_2029.PNG'
import img2 from '../assets/projects/studentprayer/IMG_2030.PNG'
import img3 from '../assets/projects/studentprayer/IMG_2033.PNG'
import img4 from '../assets/projects/studentprayer/IMG_2034.PNG'
import img5 from '../assets/projects/studentprayer/IMG_2035.PNG'

// Static project images for popup gallery
export const projectImages = [
    { src: img1, alt: 'Prayer Requests' },
    { src: img2, alt: 'Home Page' },
    { src: img3, alt: 'Sign-in' },
    { src: img4, alt: 'Sign-up' },
    { src: img5, alt: 'Profile' }
]

// Static project data - no database fetching
const projects = [
    {
        id: 1,
        title: 'Student Prayer',
        description: 'A faith-centered mobile application designed for K-12 students to build a consistent prayer life and connect with their school community through shared spiritual experiences.',
        tech_stack: ['React Native', 'Firebase', 'iOS', 'Android'],
        features: [
            { icon: '🙏', title: 'Prayer Requests', description: 'Students can submit prayer requests and pray for their peers' },
            { icon: '📺', title: 'Faith Tube', description: 'TikTok-style Christian content feed for faith inspiration' },
            { icon: '✨', title: 'Testimonies', description: 'Share answered prayers with those who prayed for you' },
            { icon: '🏆', title: 'Achievements', description: 'Earn levels and badges for consistent prayer habits' },
            { icon: '📓', title: 'Prayer Journal', description: 'Document and reflect on your spiritual journey' }
        ],
        images: projectImages
    }
]

export default function Projects() {
    return (
        <div className="page-content projects-page">
            <h2>Projects</h2>

            {projects.map((project) => (
                <div className="project-card" key={project.id}>
                    <div className="project-header">
                        <h3>{project.title}</h3>
                        <div className="project-tags">
                            {project.tech_stack.map((tech, i) => (
                                <span className="tag" key={i}>{tech}</span>
                            ))}
                        </div>
                    </div>

                    <p className="project-description">{project.description}</p>

                    <div className="project-section">
                        <h4>Key Features</h4>
                        <div className="features-grid">
                            {project.features.map((feature, i) => (
                                <div className="feature-item" key={i}>
                                    <span className="feature-icon">{feature.icon}</span>
                                    <div className="feature-content">
                                        <strong>{feature.title}</strong>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="project-section">
                        <h4>Tech Stack</h4>
                        <div className="tech-list">
                            <div className="tech-item">
                                <span className="tech-label">Frontend</span>
                                <span className="tech-value">React Native (Cross-platform)</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">Backend</span>
                                <span className="tech-value">Firebase (Auth, Firestore, Storage)</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">Platforms</span>
                                <span className="tech-value">iOS & Android</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">Target Users</span>
                                <span className="tech-value">K-12 Students</span>
                            </div>
                        </div>
                    </div>

                    <p className="project-note">
                        <em>← Check out the app screenshots in the popups</em>
                    </p>
                </div>
            ))}
        </div>
    )
}
