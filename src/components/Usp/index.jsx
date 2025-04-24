'use client';
import React from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.scss';

export default function Usp(){
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>So? What are you waiting for?</h1>
            <h4 className={styles.h4}>Sign up now!</h4>

            <button className={styles.signInButton} onClick={() => router.push('/signUp')}>
                Sign Up
            </button>
        </div>
    )
}