import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderMain from 'src/components/header-main';
import { Suspense } from 'react';
import ThreeScene from '../components/threescene';
import styles from '../components/login-form.module.css';
import { IntroCard } from 'src/components/info-card';


const Home: NextPage = () => {

  
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Home Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <HeaderMain />
        <Suspense fallback={'Loading scene...'}>
          <div className={styles.threecontainer}>
            <ThreeScene />
          </div>
          <IntroCard />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
