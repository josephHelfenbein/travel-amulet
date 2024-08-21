import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderSecondary from 'src/components/header-secondary';
import styles from 'src/components/login-form.module.css';
import HotelsContent from 'src/components/hotel-component';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Hotels</title>
        <meta name='description' content='Hotels' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.loginBG}>
        <HeaderSecondary />
        <div className="d-flex p-5 justify-content-center">
            <HotelsContent />
        </div>
      </main>
    </>
  );
};

export default Home;
