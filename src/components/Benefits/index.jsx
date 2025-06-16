'use client'
import React, { useRef, useEffect } from "react";
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faLayerGroup,
  faUserShield,
  faComments,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Benefits() {
  const wrapperRef = useRef(null);
  const gridItemsRef = useRef([]);

  useEffect(() => {
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

  const benefits = [
    {
      icon: faRobot,
      title: "AI-Driven Planning",
      desc: "Automatically schedule tasks based on priority, duration, and deadlines."
    },
    {
      icon: faLayerGroup,
      title: "Contextual Insights",
      desc: "Get smart recommendations to better balance your busiest days."
    },
    {
      isImage: true,
      src: "/opimg/mockupfu.png",
      alt: "Tool Preview"
    },
    {
      icon: faUserShield,
      title: "Personal Coaching",
      desc: "Weekly reflections and tips to help prevent burnout."
    },
    {
      icon: faComments,
      title: "NLP Chat Interface",
      desc: "Add tasks and adjust your schedule effortlessly using natural language."
    },
    {
      icon: faShieldAlt,
      title: "Proactive Prevention",
      desc: "Detect overload and schedule automatic breaks for better balance."
    }
  ];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <p className={styles.logo}>(SYNC)</p>
      <h1 className={styles.title}>Streamline Your Schedule with NexGenda</h1>
      <p className={styles.subtitle}>
        A smart planner that combines your calendar, tasks and well-being for maximum productivity without stress.
      </p>

      <div className={styles.parent}>
        {benefits.map((item, index) => {
          // bepaal positionele class .div1 t/m .div6
          const posClass = styles[`div${index + 1}`];

          if (item.isImage) {
            return (
              <div
                key={index}
                className={`${styles.imageContainer} ${posClass}`}
                ref={el => gridItemsRef.current[index] = el}
              >
                <img src={item.src} alt={item.alt} />
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`${styles.item} ${posClass}`}
              ref={el => gridItemsRef.current[index] = el}
            >
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
