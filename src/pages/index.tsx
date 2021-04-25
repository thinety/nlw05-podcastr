import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ptBR }  from 'date-fns/locale'

import { usePlayer } from '../contexts/PlayerContext';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/time';

import styles from './styles.module.scss';


type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  durationAsString: string,
  duration: number,
  url: string,
};

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = usePlayer();

  return (
    <main className={styles['homepage']}>
      <section className={styles['latest-episodes']}>
        <h2>Últimos lançamentos</h2>
        <ul>
          { latestEpisodes.map(episode => (
            <li key={episode.id}>
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                width={192}
                height={192}
                objectFit='cover'
              />

              <div className={styles['episode-details']}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button className={styles['play-button']} onClick={() => {
                play(episode);
              }}>
                <img src='/play-green.svg' alt='Tocar episódio' />
              </button>
            </li>
          )) }
        </ul>
      </section>
      <section className={styles['all-episodes']}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    src={episode.thumbnail}
                    alt={episode.title}
                    width={120}
                    height={120}
                    objectFit='cover'
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button className={styles['play-button-row']}>
                    <img src='/play-green.svg' alt='Tocar episódio' />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </section>
    </main>
  );
}

async function getStaticProps(_context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
  const response = await api({
    method: 'get',
    url: '/episodes',
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = response.data.map((episode: any) => {
    const {
      id,
      title,
      thumbnail,
      members,
      published_at,
      file: { url, duration },
    } = episode;

    return {
      id,
      title,
      thumbnail,
      members,
      publishedAt: format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: convertDurationToTimeString(Number(duration)),
      duration: Number(duration),
      url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
}


export default Home;
export { getStaticProps };
