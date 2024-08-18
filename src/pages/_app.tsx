import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilSnapshot } from "recoil";
import { useEffect } from "react";
import { SnackbarProvider } from "notistack";
import 'bootstrap/dist/css/bootstrap.css';
import '../app/globals.css';
import { SessionProvider } from "next-auth/react";


function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
