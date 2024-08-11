import styles from './login-form.module.css';
import { useState, useEffect } from 'react';


export function InfoTextCard (){
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=>{if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        setOnMobile(true);
    }}, []);
    return (
        <div>
            {onMobile &&
                <div className={styles.infoCardRelMobile} id={styles.num1}>
                    <div className="card-body p-5">
                        <p className="card-text ">Take a quick and easy quiz to share your preferences. From food and culture to landmarks and adventure. </p>
                    </div>
                </div>
                }
            {!onMobile && 
                <div className={styles.infoCardRel} id={styles.num1}>
                    <div className="card-body p-5">
                        <p className="card-text ">Take a quick and easy quiz to share your preferences. From food and culture to landmarks and adventure. </p>
                    </div>
                </div>
            }
        </div>
    );
}
export function InfoTextCard2 (){
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=>{if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        setOnMobile(true);
    }}, []);
    return (
        <div>
            {onMobile &&
                <div className={styles.infoCardRelMobile} id={styles.num2}>
                    <div className="card-body p-5">
                        <p className="card-text ">Our AI-powered platform then analyzes your answers to recommend the perfect country for your next trip, along with the best hotel and flight options to suit your budget.</p>
                    </div>
                </div>
                }
            {!onMobile && 
                <div className={styles.infoCardRel} id={styles.num2}>
                    <div className="card-body p-5">
                        <p className="card-text ">Our AI-powered platform then analyzes your answers to recommend the perfect country for your next trip, along with the best hotel and flight options to suit your budget. </p>
                    </div>
                </div>
            }
        </div>
    );
}
export function InfoTextCard3(){
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=>{if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        setOnMobile(true);
    }}, []);
    return (
        <div>
            {onMobile &&
                <div className={styles.infoCardRelMobile} id={styles.num3}>
                    <div className="card-body p-5">
                        <p className="card-text ">Let TravelAmulet guide you to your ideal destination, where every detail is tailored to your tastes.</p>
                    </div>
                </div>
                }
            {!onMobile && 
                <div className={styles.infoCardRel} id={styles.num3}>
                    <div className="card-body p-5">
                        <p className="card-text ">Let TravelAmulet guide you to your ideal destination, where every detail is tailored to your tastes. </p>
                    </div>
                </div>
            }
        </div>
    );
}