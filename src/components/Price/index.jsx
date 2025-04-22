import React from "react";
import styles from './style.module.scss';

export default function Price() {
    return(
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Our Pricing Plans</h1>
                <p className={styles.subtitle}>
                    Choose the right plan for you. We offer a free version, a Pro version with AI recommendations, and a Team version for businesses.
                </p>
            </div>
            
            <div className={styles.pricingPlans}>
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
                    <h2 className={styles.planTitle}>Pro Version</h2>
                    <p className={styles.planPrice}>€6.99 / month</p>
                    <p className={styles.planDescription}>
                        Includes everything from the free version
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
                    <button className={styles.planButton}>Choose Pro Version</button>
                </div>

                <div className={styles.plan}>
                    <h2 className={styles.planTitle}>Team Version</h2>
                    <p className={styles.planPrice}>€12.99+/user/month</p>
                    <p className={styles.planDescription}>
                        Includes everything from the free and pro version
                    </p>
                    <p className={styles.planDescription}>
                        For businesses with team overview
                    </p>
                    <p className={styles.planDescription}>
                        shared tasks and detailed analytics
                    </p>
                    <button className={styles.planButton}>Choose Team Version</button>
                </div>
            </div>
        </div>
    );
}
