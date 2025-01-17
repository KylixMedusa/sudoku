import { GameState } from './board';

const GAME_STATE_KEY = 'sudokuGameState';

export const saveGameState = (state: GameState) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const clearGameState = () => {
  localStorage.removeItem(GAME_STATE_KEY);
};

export const loadGameState = (): GameState | null => {
  try {
    const stateString = localStorage.getItem(GAME_STATE_KEY);
    if (!stateString) return null;
    return JSON.parse(stateString) as GameState;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};
