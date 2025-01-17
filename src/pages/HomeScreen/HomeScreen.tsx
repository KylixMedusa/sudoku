import React, { useState } from 'react';

import './styles.scss';
import Logo from '../../assets/logo.png';
import { TimeOutline } from 'react-ionicons';
import { Difficulty, DifficultyLevels } from '../../types/difficulty';
import { GameState } from '../../types/board';
import { formatTime } from '../../types/common';

interface Props {
  startNewGame: (difficulty: Difficulty) => void;
  continueGame: (existingGame: GameState) => void;
  existingGame: GameState | null;
}

const HomeScreen: React.FC<Props> = ({
  startNewGame,
  continueGame,
  existingGame,
}) => {
  const [chooseDifficulty, setChooseDifficulty] = useState<boolean>(false);

  return (
    <div className="home-screen">
      <div className="home-screen__content">
        <div className="home-screen__content__logo">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="title-font home__title">Sudoku</h1>
        </div>
        <div className="button-container">
          {chooseDifficulty ? (
            <div className="difficulty__container">
              <h4 className="">Select Difficulty</h4>
              <div className="difficulty__buttons">
                {Object.entries(DifficultyLevels).map(([key, difficulty]) => {
                  return (
                    <button
                      key={key}
                      className="button button--secondary button--difficulty"
                      onClick={() => startNewGame(key as Difficulty)}
                    >
                      {difficulty.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {existingGame && (
                <button
                  className="button button__continue-game"
                  onClick={() => continueGame(existingGame)}
                >
                  Continue Game
                  <div className="continue-game__content">
                    <div>
                      <TimeOutline cssClasses="continue-game__icon" />
                      <span>{formatTime(existingGame.elapsedTime)}</span>
                    </div>
                    <h5>{DifficultyLevels[existingGame.difficulty].name}</h5>
                  </div>
                </button>
              )}
              <button
                className="button button--secondary"
                onClick={() => setChooseDifficulty(true)}
              >
                New Game
              </button>
            </>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>
          Made with ❤️ by{' '}
          <a href="https://github.com/KylixMedusa" target="_blank">
            kylixmedusa
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
