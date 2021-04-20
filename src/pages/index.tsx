import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';

import { api } from '../services/api';


interface HomeProps {
  episodes: any[];
}

function Home({ episodes }: HomeProps) {
  return (
    <h1>Home</h1>
  );
}

async function getStaticProps(_context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
  const response = await api({
    method: 'get',
    url: '/episodes',
  });

  const episodes = response.data;

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  };
}


export default Home;
export { getStaticProps };
