'use client'
import React, { useEffect, useRef } from "react";
import styles from './style.module.scss';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Users() {
    const headerRef = useRef(null);
    const sectionsRef = useRef([]);

    useEffect(() => {
        // Header animatie
        gsap.from(headerRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        // Testimonial secties staggered animatie
        gsap.from(sectionsRef.current, {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.3,
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header} ref={headerRef}>
                <h1 className={styles.h1}>What people think about us</h1>
            </div>

            <div className={styles.wrapper}>
                {[
                    {
                        quote: "“Nexgenda completely changed how I manage my week.”",
                        text: "The AI suggestions are surprisingly accurate, and the smart planning helps me save hours every week. I can’t imagine working without it anymore.",
                        name: "Sarah Mitchell",
                        role: "Productivity Coach",
                        image: "https://randomuser.me/api/portraits/women/44.jpg"
                    },
                    {
                        quote: "“Perfect for our remote team.”",
                        text: "With shared tasks and detailed overviews, Nexgenda helps us stay aligned across time zones. It's become essential to how we operate.",
                        name: "James Carter",
                        role: "Team Lead at DevSync",
                        image: "https://randomuser.me/api/portraits/men/35.jpg"
                    },
                    {
                        quote: "“I’ve tried dozens of planners—this one actually sticks.”",
                        text: "Nexgenda strikes the perfect balance between structure and flexibility. The clean UI and calendar integration are just brilliant.",
                        name: "Patrick Williams",
                        role: "Freelance Designer",
                        image: "https://randomuser.me/api/portraits/men/81.jpg"
                    },
                    {
                        quote: "“Nexgenda feels like it was made for busy founders.”",
                        text: "Between investor calls, product planning, and team syncs, this tool keeps me sane. I love how I can visualize my week at a glance.",
                        name: "Anita Wyck",
                        role: "Startup Founder",
                        image: "https://randomuser.me/api/portraits/women/65.jpg"
                    }
                ].map((item, index) => (
                    <div
                        className={styles[`section${index + 1}`]}
                        key={index}
                        ref={el => sectionsRef.current[index] = el}
                    >
                        <h4 className={styles.h4}>{item.quote}</h4>
                        <p className={styles.p}>{item.text}</p>
                        <div className={styles.pfc}>
                            <img className={styles.img} src={item.image} alt={item.name} />
                            <p className={styles.h6}>{item.name}</p>
                            <p className={styles.h62}>{item.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
