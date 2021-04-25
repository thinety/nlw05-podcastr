import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/time';

import classnames from 'classnames';
import styles from './styles.module.scss';


function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious,
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
          <span className={styles['progress-text']}>
            {convertDurationToTimeString(progress)}
          </span>
          <div className={styles['slider']}>
            { hasNoEpisode ? (
              <div className={styles['empty-slider']} />
            ) : (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={value => {
                  audioRef.current!.currentTime = value;
                  setProgress(value);
                }}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) }
          </div>
          <span className={styles['progress-text']}>
            {convertDurationToTimeString(episode?.duration ?? 0)}
          </span>
        </div>

        { hasNoEpisode ? null : (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            loop={isLooping}
            onEnded={() => {
              playNext();
            }}
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
            onLoadedMetadata={() => {
              audioRef.current!.currentTime = 0

              audioRef.current!.addEventListener('timeupdate', () => {
                setProgress(Math.floor(audioRef.current!.currentTime));
              });
            }}
          />
        ) }

        <div className={styles['buttons']}>
          <button
            className={classnames(styles['button'], isShuffling && styles['is-active'])}
            disabled={hasNoEpisode || episodeList.length === 1}
            onClick={toggleShuffle}
          >
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button
            className={styles['button']}
            disabled={hasNoEpisode || !hasPrevious}
            onClick={playPrevious}
          >
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
          <button
            className={styles['button']}
            disabled={hasNoEpisode || !hasNext}
            onClick={playNext}
          >
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>
          <button
            className={classnames(styles['button'], isLooping && styles['is-active'])}
            disabled={hasNoEpisode}
            onClick={toggleLoop}
          >
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}


export { Player };
