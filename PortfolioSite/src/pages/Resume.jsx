import React from 'react'

export default function Resume() {
    return (
        <div className="page-content resume-page">
            <header className="resume-header">
                <h2>Latrell Price</h2>
                <p className="resume-title">Software Engineer</p>
                <div className="resume-contact-row">
                    <span>Memphis, TN</span>
                    <span className="divider">•</span>
                    <span>latrell.price23@gmail.com</span>
                </div>
            </header>

            <section className="resume-section">
                <h3>Summary</h3>
                <p>
                    Creative software engineer with a background in art and animation,
                    combining technical expertise with a designer's perspective to build
                    intuitive, user-centric applications. Passionate about crafting efficient
                    solutions that balance functionality with exceptional user experience.
                </p>
            </section>

            <section className="resume-section">
                <h3>Technical Skills</h3>
                <div className="skills-grid">
                    <div className="skill-category">
                        <h4>Languages</h4>
                        <p>JavaScript, Python, Java, HTML, CSS</p>
                    </div>
                    <div className="skill-category">
                        <h4>Frameworks</h4>
                        <p>React, Node.js, Express, Next.js</p>
                    </div>
                    <div className="skill-category">
                        <h4>Tools</h4>
                        <p>Git, Firebase, MongoDB, Figma</p>
                    </div>
                    <div className="skill-category">
                        <h4>Other</h4>
                        <p>REST APIs, Agile, UI/UX Design</p>
                    </div>
                </div>
            </section>

            <section className="resume-section">
                <h3>Experience</h3>
                <div className="experience-item">
                    <div className="experience-header">
                        <span className="experience-role">Software Developer</span>
                        <span className="experience-date">2023 - Present</span>
                    </div>
                    <p className="experience-company">Freelance / Personal Projects</p>
                    <ul className="experience-list">
                        <li>Designed and developed full-stack web applications using React and Firebase</li>
                        <li>Created responsive, accessible user interfaces with modern CSS techniques</li>
                        <li>Implemented real-time features and authentication systems</li>
                    </ul>
                </div>
            </section>

            <section className="resume-section">
                <h3>Education</h3>
                <div className="education-item">
                    <div className="experience-header">
                        <span className="experience-role">Bachelor's Degree</span>
                        <span className="experience-date">Graduated</span>
                    </div>
                    <p className="experience-company">Computer Science / Art & Animation</p>
                </div>
            </section>

            <section className="resume-section">
                <h3>Interests</h3>
                <p>Game Development, Digital Art, Animation, Creative Coding, UX Design</p>
            </section>
        </div>
    )
}
