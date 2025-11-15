import React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';


export default function Footer() {
    return (
        <footer className="footer">
            <p>Built by Kole Kikuta</p>
            <div className="footer-links">
                <a href="https://github.com/kolekikuta" target="_blank" rel="noopener noreferrer">
                    <FaGithub size="30"/>
                </a>
                <a href="https://www.linkedin.com/in/kolekikuta" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size="30"/>
                </a>
            </div>
        </footer>
    )
}