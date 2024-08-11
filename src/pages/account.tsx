import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderSecondary from 'src/components/header-secondary';
import AccountSettings from 'src/components/accountsettings';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Account</title>
        <meta name='description' content='Account' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <HeaderSecondary />
        <AccountSettings />
      </main>
    </>
  );
};

export default Home;
