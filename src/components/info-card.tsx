import styles from './login-form.module.css';
import { useEffect, useState } from 'react';

export function IntroCard() {
    const [onMobile, setOnMobile] = useState(false);
    useEffect(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            setOnMobile(true);
        }
    }, []);
    return (
        <div>
            <div className={styles.infoCardBG}>

            </div>
            {onMobile &&
                <div className={styles.infoCardMobile}>
                    <div className="card-body p-5">
                        <h1 className="card-title text-white pt-5 pb-3">A magic way to travel</h1>
                        <p className="card-text text-white">Discover your perfect travel destination with TravelAmulet. Your preferences guide the journey, and AI guides the adventure.</p>
                        <a href="quiz" className="btn btn-outline-light">Start the Quiz</a>
                    </div>
                </div>
            }
            {!onMobile &&
                <div className={styles.infoCard}>
                    <div className="card-body p-5">
                        <h1 className="card-title text-white pt-5 pb-3">A magic way to travel</h1>
                        <p className="card-text text-white">Discover your perfect travel destination with TravelAmulet. Your preferences guide the journey, and AI guides the adventure.</p>
                        <a href="quiz" className="btn btn-outline-light">Start the Quiz</a>
                    </div>
                </div>
            }
        </div>
    );
}