'use client'
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.scss';
import gsap from "gsap";

export default function Landing() {
    const router = useRouter();

    // Refs voor animatie
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });

        tl.from(heroRef.current, { opacity: 0, y: 30, duration: 0.6 })
          .from(titleRef.current, { opacity: 0, y: 20 }, "-=0.3")
          .from(descRef.current, { opacity: 0, y: 20 }, "-=0.3")
          .from(buttonsRef.current, { opacity: 0, y: 20 }, "-=0.3");
    }, []);

    return (
        <div className={styles.hero} ref={heroRef}>
            <div className={styles.content}>
                <h1 className={styles.title} ref={titleRef}>
                    Streamline Your <br /> Schedule with Our <br /> All-in-One Tool
                </h1>
                <p className={styles.description} ref={descRef}>
                    Experience the ultimate productivity boost with our innovative tool that combines your calendar, deadlines, and to-do list into a single, user-friendly platform. Our AI named Nexi feature intelligently organizes your tasks, ensuring you never miss a deadline again.
                </p>
                <div className={styles.buttons} ref={buttonsRef}>
                    <button className={styles.primary}>Learn More</button>
                    <button className={styles.signInButton} onClick={() => router.push('/signUp')}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
