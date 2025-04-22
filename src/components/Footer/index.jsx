import React from "react";
import styles from './style.module.scss';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.grid}>
                <div className={styles.section}>
                    
                    <div className={styles.logo}>
                        <img src="./VisionFlowLogo.png" alt="logo" />
                    </div>
                    <p>
                        #45, is neutral examination.<br />
                        Fedric, math notions<br />
                        colonelk, 4346003
                    </p>
                </div>

                <div className={styles.section}>
                    <h4>EXPLORE</h4>
                    <ul>
                        <li>consectet cupidatat</li>
                        <li>exercitation ullamco</li>
                        <li>fugiat nulla</li>
                        <li>dolore magna</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>KNOW MORE</h4>
                    <ul>
                        <li>blandit cursus</li>
                        <li>ultricesper a lacus</li>
                        <li>fugiat nulla</li>
                        <li>dolore magna</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>ABOUT</h4>
                    <ul>
                        <li>Vestibulum morbi blandit</li>
                        <li>eros sagittis</li>
                        <li>ultricies orci sagittis</li>
                        <li>adipiscing</li>
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
