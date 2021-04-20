import classnames from 'classnames';
import styles from './styles.module.scss';


function Player() {
  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora</strong>
      </header>

      <div className={styles['empty-player']}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>

      <footer className={classnames(styles['controls'], styles['empty'])}>
        <div className={styles['progress']}>
          <span className={styles['progress-text']}>00:00</span>
          <div className={styles['empty-slider']}>
            <div className={styles['empty-slider']} />
          </div>
          <span className={styles['progress-text']}>00:00</span>
        </div>

        <div className={styles['buttons']}>
          <button className={styles['button']}>
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button className={styles['button']}>
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>
          <button
            className={classnames(styles['button'], styles['play-button'])}
          >
            <img src='/play.svg' alt='Tocar' />
          </button>
          <button className={styles['button']}>
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>
          <button className={styles['button']}>
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}


export { Player };
