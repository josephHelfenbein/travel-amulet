import { useFrame } from '@react-three/fiber';
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
                    <div className='row g-0'>
                        <div className="col-md-1 align-content-center p-4 pb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                                <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"></path>
                            </svg>
                        </div>
                        <div className="col-md-4">
                            <div className="card-body p-4 pt-3">
                                <p className="card-text ">Take a quick and easy quiz to share your preferences. From food and culture to landmarks and adventure. </p>
                            </div>
                        </div>
                    </div>
                </div>
                }
            {!onMobile && 
                <div className={styles.infoCardRel} id={styles.num1}>
                    <div className='row g-0'>
                        <div className="col-md-1 align-content-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                                <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"></path>
                            </svg>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body p-5">
                                <p className="card-text ">Take a quick and easy quiz to share your preferences. From food and culture to landmarks and adventure. </p>
                            </div>
                        </div>
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
                    <div className='row g-0'>
                        <div className="col-md-1 align-content-center p-4 pb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                                <path d="M160-120v-220q0-24.75 17.63-42.38Q195.25-400 220-400h520q24.75 0 42.38 17.62Q800-364.75 800-340v220H160Zm200-320q-83 0-141.5-58.5T160-640q0-83 58.5-141.5T360-840h240q83 0 141.5 58.5T800-640q0 83-58.5 141.5T600-440H360ZM220-180h520v-160H220v160Zm140-320h240q58.33 0 99.17-40.76 40.83-40.77 40.83-99Q740-698 699.17-739q-40.84-41-99.17-41H360q-58.33 0-99.17 40.76-40.83 40.77-40.83 99Q220-582 260.83-541q40.84 41 99.17 41Zm.18-110q12.82 0 21.32-8.68 8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5Zm240 0q12.82 0 21.32-8.68 8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5ZM480-180Zm0-460Z"></path>
                            </svg>
                        </div>
                        <div className="col-md-4">
                            <div className="card-body p-4 pt-0">
                                <p className="card-text ">Our AI-powered platform then analyzes your answers to recommend the perfect country for your next trip, along with the best hotel and flight options to suit your budget.</p>
                            </div>
                        </div>
                    </div>
                </div>
                }
            {!onMobile && 
                <div className={styles.infoCardRel} id={styles.num2}>
                    <div className='row g-0'>
                        <div className="col-md-1 align-content-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                                <path d="M160-120v-220q0-24.75 17.63-42.38Q195.25-400 220-400h520q24.75 0 42.38 17.62Q800-364.75 800-340v220H160Zm200-320q-83 0-141.5-58.5T160-640q0-83 58.5-141.5T360-840h240q83 0 141.5 58.5T800-640q0 83-58.5 141.5T600-440H360ZM220-180h520v-160H220v160Zm140-320h240q58.33 0 99.17-40.76 40.83-40.77 40.83-99Q740-698 699.17-739q-40.84-41-99.17-41H360q-58.33 0-99.17 40.76-40.83 40.77-40.83 99Q220-582 260.83-541q40.84 41 99.17 41Zm.18-110q12.82 0 21.32-8.68 8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5Zm240 0q12.82 0 21.32-8.68 8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5ZM480-180Zm0-460Z"></path>
                            </svg>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body p-5">
                                <p className="card-text ">Our AI-powered platform then analyzes your answers to recommend the perfect country for your next trip, along with the best hotel and flight options to suit your budget.</p>
                            </div>
                        </div>
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
                <div className='row g-0'>
                    <div className="col-md-1 align-content-center p-4 pb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                            <path d="M275-304q0-32 21.5-53.5T350-379q32 0 53.5 21.5T425-304q0 32-21.5 53.5T350-229q-32 0-53.5-21.5T275-304Zm205-71h260q24 0 42 18t18 42v275h-60v-91H220v91h-60v-393h60v242h260v-184Zm152-61L515-654 406-545l10 72-30 28-55-91-95-50 30-28 77 11 113-113-226-113 43-40 272 68 107-107q13-13 32-14.5t33 12.5q13 13 12 30.5T715-849L608-742l67 266-43 40Zm108 245v-124H540v124h200Zm-200 0v-124 124Z"></path>
                        </svg>
                    </div>
                    <div className="col-md-4">
                        <div className="card-body p-4 pt-0">
                            <p className="card-text ">Let TravelAmulet guide you to your ideal destination, where every detail is tailored to your tastes.</p>
                        </div>
                    </div>
                </div>
            </div>
            }
        {!onMobile && 
            <div className={styles.infoCardRel} id={styles.num3}>
                <div className='row g-0'>
                    <div className="col-md-1 align-content-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48px" height="48px" fill="#004a58">
                            <path d="M275-304q0-32 21.5-53.5T350-379q32 0 53.5 21.5T425-304q0 32-21.5 53.5T350-229q-32 0-53.5-21.5T275-304Zm205-71h260q24 0 42 18t18 42v275h-60v-91H220v91h-60v-393h60v242h260v-184Zm152-61L515-654 406-545l10 72-30 28-55-91-95-50 30-28 77 11 113-113-226-113 43-40 272 68 107-107q13-13 32-14.5t33 12.5q13 13 12 30.5T715-849L608-742l67 266-43 40Zm108 245v-124H540v124h200Zm-200 0v-124 124Z"></path>
                        </svg>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body p-5">
                            <p className="card-text ">Let TravelAmulet guide you to your ideal destination, where every detail is tailored to your tastes.</p>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}
export function EndingInfoScreen (){
    const [scrollY, setScrollY] = useState(0);
    const [movementY, setMovementY] = useState(0);
    useEffect(()=>{
        const handleScroll = () => {
            setMovementY(window.scrollY - scrollY);
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>{window.removeEventListener('scroll', handleScroll);};
    }, []);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState(0);
    
    const [inView, setInView] = useState(false);
    useEffect(()=>{
        if(scrollY + movementY > 2400){
            setOpacity(Math.min(Math.max(scrollY - 2400, 0)/4, 100));
            setPosition(200-Math.max(scrollY - 2400, 0)/6);
        }
        if(scrollY + movementY > 4500) setInView(true);
        else setInView(false);
        
    })    
    return(
        <div className={styles.coverEnd} style={{opacity:`${opacity}%`}}>
            <div className='column g-0 text-center p-5' style={{marginTop:`${position}px`}}>
                <img src="/travelamulet-icon.svg" />
                {inView &&
                    <div className="p-4">
                        <h5 className="text-white mt-3">Try TravelAmulet now. It works like magic.</h5>
                        <a href="quiz" className="btn btn-outline-light m-3">Start the Quiz</a>
                    </div>
                }
                
            </div>
            
        </div>
    );
}