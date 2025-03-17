'use client';
import React from "react";
import { useRouter } from "next/navigation";
import style from './style.module.scss';
import { logoutAction } from "@/data/actions/auth-actions";
import { LogOut } from "lucide-react";

export default function Index() {
    const router = useRouter();

    return (
        <div className={style.header}> 
            <div className={style.section1}>
                <div className={style.logo}>
                    <img src="./VisionFlowLogo.png" alt="logo" />
                </div>
            </div>

            <div className={style.section2}>
                <div className={style.button1}>
                    <form action={logoutAction}>
                        <button type="submit" className={style.signOutButton}>
                            <LogOut className="w-6 h-6 hover:text-primary" />
                            <span className={style.buttonText}>Log Out</span>
                        </button>
                    </form>  
                </div>
            </div>
        </div>
    );
}
