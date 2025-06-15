'use client';
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.scss';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Usp() {
    const router = useRouter();
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Fade-in van de hele container
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        // Extra pop voor de button
        gsap.from(buttonRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.95,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <h1 className={styles.h1}>So? What are you waiting for?</h1>
            <h4 className={styles.h4}>Sign up now!</h4>

            <button
                className={styles.signInButton}
                ref={buttonRef}
                onClick={() => router.push('/signUp')}
            >
                Sign Up
            </button>
        </div>
    );
}
