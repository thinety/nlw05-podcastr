import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ptBR }  from 'date-fns/locale'

import { api } from '../../../services/api';
import { convertDurationToTimeString } from '../../../utils/time';

import styles from './styles.module.scss';


type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  description: string,
  publishedAt: string,
  durationAsString: string,
};

interface EpisodeProps {
  episode: Episode;
}

function Episode({ episode }: EpisodeProps) {
  return (
    <main className={styles['episode']}>
      <section className={styles['thumbnail-container']}>
        <Link href='/'>
          <button>
            <img src='/arrow-left.svg' alt='Voltar' />
          </button>
        </Link>
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          width={700}
          height={160}
          objectFit='cover'
        />
        <button>
          <img src='/play.svg' alt='Tocar episódio' />
        </button>
      </section>

      <section className={styles['info']}>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </section>

      <section
        className={styles['description']}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </main>
  );
}

async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<EpisodeProps>> {
  const episodeId = context.params!.id! as string;

  const response = await api({
    method: 'get',
    url: `/episodes/${episodeId}`,
  });

  const {
    id,
    title,
    thumbnail,
    members,
    description,
    published_at,
    file: { duration },
  } = response.data;

  const episode = {
    id,
    title,
    thumbnail,
    members,
    description,
    publishedAt: format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
    durationAsString: convertDurationToTimeString(Number(duration)),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
}

async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const response = await api({
    method: 'get',
    url: '/episodes',
  });

  const paths = response.data.map((episode: any) => (
    { params: { id: episode.id } }
  ));

  return {
    paths,
    fallback: 'blocking',
  };
}


export default Episode;
export { getStaticProps, getStaticPaths };
