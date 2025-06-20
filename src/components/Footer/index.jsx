import React from "react";
import styles from './style.module.scss';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.grid}>
                <div className={styles.section}>
                    
                    <div className={styles.logo}>
                        <img src="./bgfooterlogo.png" alt="logo" />
                    </div>
                    <p>
                        info@nexgenda.com<br />
                       0800-123123<br />
                        Rotterdam, 2074EP
                    </p>
                </div>

                <div className={styles.section}>
                    <h4>EXPLORE</h4>
                    <ul>
                        <li>Planner</li>
                        <li>Nexi</li>
                        <li>Tech stack</li>
                        <li>Sign Up</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>KNOW MORE</h4>
                    <ul>
                        <li>Live Update Bar</li>
                        <li>User-Friendly Interface</li>
                        <li>Integration Features</li>
                        <li>Get Started Today</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>ABOUT</h4>
                    <ul>
                        <li>Who made it</li>
                        <li>The Idea</li>
                        <li>Meet Nexi</li>
                        <li>The Team</li>
                    </ul>
                </div>
            </div>

            <div className={styles.newsletter}>
                <label htmlFor="newsletter">NEWSLETTER</label>
                <div className={styles.inputGroup}>
                    <input type="email" placeholder="Enter your email ID" />
                    <button>SUBSCRIBE</button>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.socials}>
                    <FaFacebookF />
                    <FaLinkedinIn />
                    <FaTwitter />
                </div>
            </div>
        </footer>
    );
}
