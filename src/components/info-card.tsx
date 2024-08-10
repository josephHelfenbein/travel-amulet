import styles from './login-form.module.css';


export function IntroCard (){
    return (
        <div>
        <div className={styles.infoCardBG}>

        </div>
        <div className={styles.infoCard}>
            <div className="card-body p-5">
                <h1 className="card-title text-white pt-5 pb-3">A magic way to travel</h1>
                <p className="card-text text-white">Indecisive? Use AI to decide where to go for you. It works like magic.</p>
                <a href="#" className="btn btn-primary">Start the Quiz</a>
            </div>
        </div>
        </div>
    );
}