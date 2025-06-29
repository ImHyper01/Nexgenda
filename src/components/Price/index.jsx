'use client'
import React, { useRef, useEffect } from "react";
import styles from './style.module.scss';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Price() {
    const wrapperRef = useRef(null);
    const planRefs = useRef([]);

    useEffect(() => {
    
        gsap.from(wrapperRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

       
        gsap.from(planRefs.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
    }, []);

    return(
        <div className={styles.container}>
            <div className={styles.wrapper} ref={wrapperRef}>
                <h1 className={styles.title}>Our Pricing Plans</h1>
                <p className={styles.subtitle}>
                    Choose the plan that fits for you. We offer a Free version, a Basic version and Pro version with AI recommendations.
                </p>
            </div>
            
            <div className={styles.pricingPlans} ref={planRefs}>
                <div className={styles.plan}>
                    <h2 className={styles.planTitle}>Free Version</h2>
                    <p className={styles.planPrice}>€0 / month</p>
                    <p className={styles.planDescription}>
                        Basic planner without AI recommendations
                    </p>
                    <p className={styles.planDescription}>
                        with up to 1 linked calendar
                    </p>
                    <button className={styles.planButton}>Start Free</button>
                </div>

                <div className={`${styles.plan} ${styles.proPlan}`}>
                    <div className={styles.mostPopularBadge}>Most Popular</div>
                    <h2 className={styles.planTitle}>Basic Version</h2>
                    <p className={styles.planPrice}>€6.99 / month</p>
                    <p className={styles.planDescription}>
                        Includes everything from the Free version
                    </p>
                    <p className={styles.planDescription}>
                        Get AI suggestions
                    </p>
                    <p className={styles.planDescription}>
                        multiple linked calendars
                    </p>
                    <p className={styles.planDescription}>
                        reminders and smart weekly planning
                    </p>

                    <p className={styles.planDescription}>
                        Chatting with an chatbot Nexi to get help with you planning
                    </p>
                    <button className={styles.planButton}>Choose Basic Version</button>
                </div>

                <div className={styles.plan}>
                    <h2 className={styles.planTitle}>Choose Pro </h2>
                    <p className={styles.planPrice}>€11.99 / month</p>
                    <p className={styles.planDescription}>
                        Includes everything from the Free and Basic version
                    </p>
                    <p className={styles.planDescription}>
                        For businesses with team overview
                    </p>
                    <p className={styles.planDescription}>
                        shared tasks and detailed analytics
                    </p>
                    <button className={styles.planButton}>Choose Pro Version</button>
                </div>
            </div>
        </div>
    );
}
