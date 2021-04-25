import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';

import classnames from 'classnames';
import styles from './styles.module.scss';


function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = usePlayer();

  useEffect(() => {
    if (audioRef.current === null) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];
  const hasNoEpisode = episode === undefined;

  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora</strong>
      </header>

      { hasNoEpisode ? (
        <div className={styles['empty-player']}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) : (
        <div className={styles['current-episode']}>
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            width={592}
            height={592}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) }

      <footer className={classnames(styles['controls'], hasNoEpisode && styles['empty'])}>
        <div className={styles['progress']}>
          <span className={styles['progress-text']}>00:00</span>
          <div className={styles['slider']}>
            { hasNoEpisode ? (
              <div className={styles['empty-slider']} />
            ) : (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) }
          </div>
          <span className={styles['progress-text']}>00:00</span>
        </div>

        { hasNoEpisode ? null : (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
          />
        ) }

        <div className={styles['buttons']}>
          <button className={styles['button']} disabled={hasNoEpisode}>
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button className={styles['button']} disabled={hasNoEpisode}>
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>
          <button
            className={classnames(styles['button'], styles['play-button'])}
            disabled={hasNoEpisode}
            onClick={togglePlay}
          >
            { isPlaying ? (
              <img src='/pause.svg' alt='Tocar' />
            ) : (
              <img src='/play.svg' alt='Tocar' />
            ) }
          </button>
          <button className={styles['button']} disabled={hasNoEpisode}>
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>
          <button className={styles['button']} disabled={hasNoEpisode}>
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}


export { Player };
