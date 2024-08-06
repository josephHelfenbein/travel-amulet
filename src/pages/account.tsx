import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderMain from 'src/components/header-main';
import AccountSettings from 'src/components/accountsettings';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Account Settings</title>
        <meta name='description' content='Account Settings' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <HeaderMain />
        <AccountSettings />
      </main>
    </>
  );
};

export default Home;
