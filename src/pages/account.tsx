import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AccountSettings from 'src/components/accountsettings';
import HeaderMain from 'src/components/header-main';
import styles from 'src/components/login-form.module.css';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Account</title>
        <meta name='description' content='Account' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.quizBG}>
        <HeaderMain />
        <AccountSettings />
      </main>
    </>
  );
};

export default Home;
