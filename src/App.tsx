import React, { useState, useEffect } from 'react';
import { Sun, Moon, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { WORDS } from './words';
import '@fontsource/ibm-plex-mono';

type Guess = {
  word: string;
  bulls: number;
  cows: number;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, []);

  const checkGuess = (guess: string) => {
    let bulls = 0;
    let cows = 0;
    const wordArray = word.split('');
    const guessArray = guess.split('');

    // Check bulls
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === wordArray[i]) {
        bulls++;
        wordArray[i] = '*';
        guessArray[i] = '#';
      }
    }

    // Check cows
    for (let i = 0; i < 4; i++) {
      const index = wordArray.indexOf(guessArray[i]);
      if (index !== -1 && guessArray[i] !== '#') {
        cows++;
        wordArray[index] = '*';
      }
    }

    return { bulls, cows };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guesses.length >= 10) {
      setGameOver(true);
      return;
    }

    const upperInput = input.toUpperCase();
    if (!WORDS.includes(upperInput)) {
      setError('Not a valid word!');
      return;
    }

    const result = checkGuess(upperInput);
    const newGuess = { word: upperInput, ...result };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setInput('');
    setError('');

    if (result.bulls === 4) {
      setGameWon(true);
    } else if (newGuesses.length === 7) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setInput('');
    setGameWon(false);
    setGameOver(false);
    setError('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {gameWon && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-8 font-['IBM_Plex_Mono']">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bulls & Cows</h1>
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1`}
              aria-label="Reset game"
            >
              <RefreshCw size={24} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-sm mb-2">
              Guesses remaining: {10 - guesses.length}
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}
          </div>

          {!gameOver && !gameWon && (
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  maxLength={4}
                  className={`flex-1 p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter 4-letter word"
                />
                <button
                  type="submit"
                  disabled={input.length !== 4}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Guess
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4 mb-8">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className={`p-4 rounded ${
                  darkMode ? 'bg-gray-800' : 'bg-white shadow'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">{guess.word}</span>
                  <span>
                    {guess.bulls} Bulls, {guess.cows} Cows
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 border rounded shadow bg-gray-100">
            <h2 className="text-lg font-bold mb-2">Game Rules</h2>
            <p className="text-sm mb-1"><strong>Bulls:</strong> Correct character in the right position</p>
            <p className="text-sm mb-1"><strong>Cows:</strong> Correct character in the wrong position</p>
            <p className="text-sm"><strong>Maximum of 7 guesses</strong></p>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <a href="https://github.com/abishekvenkat/your-repo-name" target="_blank" rel="noopener noreferrer">
              a game by abishekvenkat
            </a>
          </div>

          {(gameOver || gameWon) && (
            <div className="mt-8 text-center">
              <p className="text-xl mb-4">
                {gameWon 
                  ? 'Congratulations! You won!' 
                  : `Game Over! The word was ${word}`}
              </p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <RefreshCw size={20} />
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;