import React from "react";
import styles from './style.module.scss';

export default function Users() {
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.h1}>What people think about us</h1>
            </div>
            <div className={styles.wrapper}>
            <div className={styles.section1}>
                <h4 className={styles.h4}>
                    “Vision Flow completely changed how I manage my week.”
                </h4>
                <p className={styles.p}>
                    The AI suggestions are surprisingly accurate, and the smart planning helps me save hours every week. I can’t imagine working without it anymore.
                </p>
                <div className={styles.pfc}>
                    <img className={styles.img} src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Mitchell"/>
                    <p className={styles.h6}>Sarah Mitchell</p>
                    <p className={styles.h62}>Productivity Coach</p>
                </div>
            </div>

            <div className={styles.section2}>
                <h4 className={styles.h4}>
                    “Perfect for our remote team.”
                </h4>
                <p className={styles.p}>
                    With shared tasks and detailed overviews, Vision Flow helps us stay aligned across time zones. It's become essential to how we operate.
                </p>
                <div className={styles.pfc}>
                    <img className={styles.img} src="https://randomuser.me/api/portraits/men/35.jpg" alt="James Carter"/>
                    <p className={styles.h6}>James Carter</p>
                    <p className={styles.h62}>Team Lead at DevSync</p>
                </div>
            </div>

            <div className={styles.section3}>
                <h4 className={styles.h4}>
                    “I’ve tried dozens of planners—this one actually sticks.”
                </h4>
                <p className={styles.p}>
                    Vision Flow strikes the perfect balance between structure and flexibility. The clean UI and calendar integration are just brilliant.
                </p>
                <div className={styles.pfc}>
                    <img className={styles.img} src="https://randomuser.me/api/portraits/men/22.jpg" alt="Leo Nguyen"/>
                    <p className={styles.h6}>Leo Nguyen</p>
                    <p className={styles.h62}>Freelance Designer</p>
                </div>
            </div>

            <div className={styles.section4}>
                <h4 className={styles.h4}>
                    “Vision Flow feels like it was made for busy founders.”
                </h4>
                <p className={styles.p}>
                    Between investor calls, product planning, and team syncs, this tool keeps me sane. I love how I can visualize my week at a glance.
                </p>
                <div className={styles.pfc}>
                    <img className={styles.img} src="https://randomuser.me/api/portraits/women/65.jpg" alt="Anita Gomez"/>
                    <p className={styles.h6}>Anita Gomez</p>
                    <p className={styles.h62}>Startup Founder</p>
                </div>
            </div>
            </div>
        </div>
    )
}
