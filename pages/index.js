import Head from "next/head";

import Main from "../components/Main";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Passport | Stay connected</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Main />
        {/* <Footer /> */}
      </main>
    </>
  );
}
