import LoginForm from 'src/components/login-form'
import type { NextPage } from 'next'
import Head from 'next/head'
import HeaderMain from 'src/components/header-main'
import HeaderSecondary from 'src/components/header-secondary'
import styles from 'src/components/login-form.module.css';

const Home : NextPage = () => {
    return (
        <div>
            <Head>
                <title>Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.png" />
            </Head>
            <main className={styles.loginBG}>
                <HeaderSecondary />
                <div className="d-flex p-5 justify-content-center">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}
export default Home