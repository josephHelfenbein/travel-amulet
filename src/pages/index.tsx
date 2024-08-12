import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderMain from 'src/components/header-main';
import { Suspense } from 'react';
import ThreeScene from '../components/threescene';
import styles from '../components/login-form.module.css';
import { IntroCard } from 'src/components/info-card';
import { InfoTextCard, InfoTextCard2, InfoTextCard3, EndingInfoScreen } from 'src/components/infoTextCard';
import { BottomText } from 'src/components/bottom-text';

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
        <style dangerouslySetInnerHTML={{__html: `
          html, body { background-color: #bae6f7; }
        `}} />
        <Suspense fallback={'Loading scene...'}>
          <div className={styles.threecontainer}>
            <ThreeScene />
          </div>
          <IntroCard />
          <InfoTextCard />
          <InfoTextCard2 />
          <InfoTextCard3 />
          <EndingInfoScreen />
          <BottomText />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
