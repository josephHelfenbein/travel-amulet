import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AccountSettings from 'src/components/accountsettings';
import HeaderSecondary from 'src/components/header-secondary';
import styles from 'src/components/login-form.module.css';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Account</title>
        <meta name='description' content='Account' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.loginBG}>
        <HeaderSecondary />
        <div className="d-flex p-5 justify-content-center">
          <AccountSettings />   
        </div>
      </main>
    </>
  );
};

export default Home;
