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
  play: (episode: Episode) => void,
  togglePlay: () => void,
  setPlayingState: (isPlaying: boolean) => void,
};

const PlayerContext = createContext<Player | undefined>(undefined);

interface PlayerProviderProps {
  children: React.ReactNode;
}

function PlayerProvider({ children }: PlayerProviderProps) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(isPlaying => !isPlaying);
  };

  const setPlayingState = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
  };

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, isPlaying, play, togglePlay, setPlayingState }}>
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
