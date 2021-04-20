import { format } from 'date-fns';
import { ptBR }  from 'date-fns/locale'

import styles from './styles.module.scss';


function Header() {
  const currentDate = format(new Date(), 'EEEEEE, dd MMMM', { locale: ptBR });

  return (
    <header className={styles['container']}>
      <img src='/logo.svg' alt='Podcastr' />

      <p className={styles['title']}>O melhor para você ouvir, sempre</p>

      <span className={styles['date']}>{currentDate}</span>
    </header>
  );
}


export { Header };
