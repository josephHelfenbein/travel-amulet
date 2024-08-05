import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderMain from 'src/components/header-main';

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
      </main>
    </>
  );
};

export default Home;
