import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderSecondary from 'src/components/header-secondary';
import styles from 'src/components/login-form.module.css';
import ResultsContent from 'src/components/results-content';

const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>Results</title>
                <meta name='description' content='Results' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className={styles.loginBG}>
                <HeaderSecondary />
                <div className="d-flex p-5 justify-content-center">
                    <ResultsContent />
                </div>
            </main>
        </>
    );
};

export default Home;
