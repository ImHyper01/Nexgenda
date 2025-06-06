import React from "react";
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCalendarCheck, faSmile, faRocket } from '@fortawesome/free-solid-svg-icons';

export default function Benefits() {
    return (
        <div className={styles.wrapper}>
            <p className={styles.logo}>(Sync)</p>
            <h1 className={styles.title}>Streamline Your Schedule with Our Tool</h1>
            <p className={styles.subtitle}>
                Our tool integrates your calendar, deadlines, and to-do list into one seamless platform.
                With real-time updates, you can manage your tasks efficiently.
            </p>

            <div className={styles.grid}>
                <div className={styles.item}>
                    <FontAwesomeIcon className={styles.icon} icon={faBolt} />
                    <h4 className={styles.h4}>Live Update Bar</h4>
                    <p>Stay informed with instant updates on your tasks and deadlines, all in one place.</p>
                </div>

                <div className={styles.item}>
                    <FontAwesomeIcon className={styles.icon} icon={faCalendarCheck} />
                    <h4 className={styles.h4} >Integration Features</h4>
                    <p>Easily connect your existing calendars and tools for a unified scheduling experience.</p>
                </div>

                <div className={styles.imageContainer}>
                    <img src="/opimg/mockupfu.png" alt="Tool Preview" />
                </div>

                <div className={styles.item}>
                    <FontAwesomeIcon className={styles.icon} icon={faSmile} />
                    <h4 className={styles.h4}>User-Friendly Interface</h4>
                    <p>Navigate effortlessly with a clean design that prioritizes your productivity and time management.</p>
                </div>

                <div className={styles.item}>
                    <FontAwesomeIcon className={styles.icon} icon={faRocket} />
                    <h4 className={styles.h4}>Get Started Today</h4>
                    <p>Join us now and transform the way you manage your time and tasks.</p>
                </div>
            </div>
        </div>
    );
}
