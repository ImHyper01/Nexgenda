import React from "react";
import styles from './style.module.scss';

export default function Price() {
    return(
        <div className={styles.container}>ß
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Our Pricing Plans</h1>
                <p className={styles.subtitle}>
                    Choose the plan that fits for you. We offer a Free version, a Basic version and Pro version with AI recommendations.
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
