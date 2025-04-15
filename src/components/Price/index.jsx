import React from "react";
import styles from './style.module.scss';

export default function Price() {
    return(
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Onze prijsplannen</h1>
                <p className={styles.subtitle}>
                    Kies het juiste plan voor jou. We hebben een gratis versie, een Pro versie met AI-aanbevelingen, en een Team versie voor bedrijven.
                </p>
            </div>
            
            <div className={styles.pricingPlans}>
                <div className={styles.plan}>
                    <h2 className={styles.planTitle}>Gratis Versie</h2>
                    <p className={styles.planPrice}>€0 / maand</p>
                    <p className={styles.planDescription}>
                        Basisplanner zonder AI-aanbevelingen
                    </p>
                    <p className={styles.planDescription}>
                        met maximaal 1 gekoppelde agenda
                    </p>
                    <button className={styles.planButton}>Start Gratis</button>
                </div>

                <div className={`${styles.plan} ${styles.proPlan}`}>
                    <div className={styles.mostPopularBadge}>Meest Populair</div>
                    <h2 className={styles.planTitle}>Pro Versie</h2>
                    <p className={styles.planPrice}>€6,99 / maand</p>
                    <p className={styles.planDescription}>
                        - Krijg AI-suggesties 
                    </p>
                    <p className={styles.planDescription}>
                        - meerdere gekoppelde agenda’s
                    </p>
                    <p className={styles.planDescription}>
                        - reminders en slimme weekplanning.
                    </p>
                    <button className={styles.planButton}>Kies Pro Versie</button>
                </div>


                <div className={styles.plan}>
                    <h2 className={styles.planTitle}>Team Versie</h2>
                    <p className={styles.planPrice}>€12,99+/gebruiker/maand</p>
                    <p className={styles.planDescription}>
                        Voor bedrijven met teamoverzicht
                    </p>
                    <p className={styles.planDescription}>
                        gedeelde taken en gedetailleerde analyses
                    </p>
                    <button className={styles.planButton}>Kies Team Versie</button>
                </div>
            </div>
        </div>
    );
}
