import { createContext, useContext, useState } from 'react';


type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
};

type Player = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  play: (episode: Episode) => void,
  playList: (episodes: Episode[], index: number) => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  setPlayingState: (isPlaying: boolean) => void,
  hasNext: boolean,
  hasPrevious: boolean,
  playNext: () => void,
  playPrevious: () => void,
};

const PlayerContext = createContext<Player | undefined>(undefined);

interface PlayerProviderProps {
  children: React.ReactNode;
}

function PlayerProvider({ children }: PlayerProviderProps) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playList = (episodes: Episode[], index: number) => {
    setEpisodeList(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(isPlaying => !isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(isLooping => !isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(isShuffling => !isShuffling);
  };

  const setPlayingState = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
  };

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = (currentEpisodeIndex - 1) >= 0;

  const playNext = () => {
    setCurrentEpisodeIndex(currentEpisodeIndex => {
      if (isShuffling) {
        return Math.floor(Math.random() * episodeList.length);
      }

      const nextEpisodeIndex = currentEpisodeIndex + 1;

      if (nextEpisodeIndex < episodeList.length) {
        return nextEpisodeIndex;
      }

      return -1;
    });
  };

  const playPrevious = () => {
    setCurrentEpisodeIndex(currentEpisodeIndex => {
      const previousEpisodeIndex = currentEpisodeIndex - 1;

      if (previousEpisodeIndex >= 0) {
        return previousEpisodeIndex;
      }

      return currentEpisodeIndex;
    });
  };

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      hasNext,
      hasPrevious,
      playNext,
      playPrevious,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayer() {
  const player = useContext(PlayerContext);

  if (player === undefined) {
    throw new Error(`'usePlayer' must be used within a 'PlayerProvider'`);
  }

  return player;
}


export { PlayerProvider, usePlayer };
