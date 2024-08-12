import QuizForm from 'src/components/quiz-form'
import type { NextPage } from 'next'
import Head from 'next/head'
import HeaderSecondary from 'src/components/header-secondary'
import HeaderMain from 'src/components/header-main'
import styles from 'src/components/login-form.module.css';

const Home : NextPage = () => {
    return (
        <div>
            <Head>
                <title>Quiz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.png" />
                <link rel='stylesheet' href='src/components/quiz.module.css' />
            </Head>
            <main className={styles.loginBG}>
                <HeaderSecondary />
                <div className="d-flex mt-5 justify-content-center">
                    <QuizForm />
                </div>
            </main>
        </div>
    )
}
export default Home