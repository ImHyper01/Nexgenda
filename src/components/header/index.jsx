'use client';
import React from "react";
import { useRouter } from "next/navigation";
import style from './style.module.scss';

export default function Index() {
    const router = useRouter();

    return (
        <div className={style.header}> 
            <div className={style.section1}>
                <div className={style.logo}>
                    <img src="/logo/nexgendalogo.svg" alt="logo" />
                </div>
            </div>

            <div className={style.section2}>
                <div className={style.button1}>
                    <button className={style.signInButton} onClick={() => router.push('/signIn')}>
                        Sign In!
                    </button>
                </div>
            </div>
        </div>
    );
}
