'use client'
import React, { useRef, useEffect } from "react";
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCalendarCheck, faSmile, faRocket } from '@fortawesome/free-solid-svg-icons';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Benefits() {
    const wrapperRef = useRef(null);
    const gridItemsRef = useRef([]);

    useEffect(() => {
        // Animatie voor de hele wrapper
        gsap.from(wrapperRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });

        // Stagger animatie voor individuele grid items
        gsap.from(gridItemsRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
            }
        });
    }, []);

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <p className={styles.logo}>(Sync)</p>
            <h1 className={styles.title}>Streamline Your Schedule with Our Tool</h1>
            <p className={styles.subtitle}>
                Our tool integrates your calendar, deadlines, and to-do list into one seamless platform.
                With real-time updates, you can manage your tasks efficiently.
            </p>

            <div className={styles.grid}>
                {[
                    {
                        icon: faBolt,
                        title: "Live Update Bar",
                        desc: "Stay informed with instant updates on your tasks and deadlines, all in one place."
                    },
                    {
                        icon: faCalendarCheck,
                        title: "Integration Features",
                        desc: "Easily connect your existing calendars and tools for a unified scheduling experience."
                    },
                    {
                        isImage: true,
                        src: "/opimg/mockupfu.png",
                        alt: "Tool Preview"
                    },
                    {
                        icon: faSmile,
                        title: "User-Friendly Interface",
                        desc: "Navigate effortlessly with a clean design that prioritizes your productivity and time management."
                    },
                    {
                        icon: faRocket,
                        title: "Get Started Today",
                        desc: "Join us now and transform the way you manage your time and tasks."
                    }
                ].map((item, index) => {
                    if (item.isImage) {
                        return (
                            <div className={styles.imageContainer} key={index} ref={el => gridItemsRef.current[index] = el}>
                                <img src={item.src} alt={item.alt} />
                            </div>
                        );
                    }
                    return (
                        <div className={styles.item} key={index} ref={el => gridItemsRef.current[index] = el}>
                            <FontAwesomeIcon className={styles.icon} icon={item.icon} />
                            <h4 className={styles.h4}>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
