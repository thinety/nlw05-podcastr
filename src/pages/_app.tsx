import type { AppProps } from 'next/app';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import '../styles/global.scss';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['content']}>
        <Header />
        <Component {...pageProps} />
      </div>
      <Player />
    </div>
  );
}


export default MyApp;