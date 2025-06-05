'use client'
import React from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.scss';

export default function Landing() {

    const router = useRouter();

    return (
        <div className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Streamline Your <br /> Schedule with Our <br /> All-in-One Tool
                </h1>
                <p className={styles.description}>
                    Experience the ultimate productivity boost with our innovative tool that combines your calendar, deadlines, and to-do list into a single, user-friendly platform. Our AI named Nexi feature intelligently organizes your tasks, ensuring you never miss a deadline again.
                </p>
                <div className={styles.buttons}>
                    <button className={styles.primary}>Learn More</button>
                    <button className={styles.signInButton} onClick={() => router.push('/signUp')}>
                        Sign Up
                    </button>
                </div>
            </div>
           
        </div>
    );
}
