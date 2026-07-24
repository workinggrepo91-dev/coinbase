import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Coinbase - Sign In</title>
        <meta name="description" content="Sign in to your Coinbase account" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
