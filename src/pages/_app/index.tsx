import '../../styles/global.scss';

import type { AppProps } from 'next/app';

import { Header } from '../../components/Header';
import { Player } from '../../components/Player';

import { PlayerProvider } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <div className={styles['wrapper']}>
        <div className={styles['content']}>
          <Header />
          <Component {...pageProps} />
        </div>
        <Player />
      </div>
    </PlayerProvider>
  );
}


export default MyApp;
