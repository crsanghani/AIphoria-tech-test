import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './App.css';

// Generate unique numbers on click, count is for the amount of numbers you want to return, so its configurable.
// Poor randomisation I know, but its just rough, sorting happens on the return
const generateUniqueNumbers = (count: number, min: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

// Maps number values to colours
// Considered mapping to an enum but this looked cleaner
const getColour = (num: number) => {
  if (num >= 1 && num <= 9) return 'grey';
  if (num >= 10 && num <= 19) return 'blue';
  if (num >= 20 && num <= 29) return 'pink';
  if (num >= 30 && num <= 39) return 'green';
  if (num >= 40 && num <= 49) return 'yellow';
}

const App: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [previousResults, setPreviousResults] = useState<number[][]>([]);
  const [bonusBall, setBonusBall] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number;}>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  // generateUnique numbers is configured here, if you want 7 numbers for example you would modify the new numbers function
    // to have the argument of 7: generateUniqueNumbers(7, 1, 49)
  const generateNumbers = () => {
    const newNumbers = generateUniqueNumbers(6, 1, 49);
    setNumbers(newNumbers);
    setPreviousResults([newNumbers, ...previousResults]);
  }

  // Generates a bonus ball on click, didnt have time to implent tracking of the bonus ball or linking to number generation
  const generateBonusBall = () => {
    let newBonusBall;
    
    do { newBonusBall = Math.floor(Math.random() * 49) + 1;}
    while (numbers.includes(newBonusBall));

    setBonusBall(newBonusBall);
  }

  // This allows me to return the previous results in the appropriate chunks for new lines
  const chunkArray = (arr: number[][], size: number) => {
    const result = [];
    
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }

    return result;
  }

  // This is for the Confetti portion of the app, without this, resizing would make the confetti look janky
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  })

  // This is for tracking the mouse position and moving the gradient around in the bonus ball button
    // its a bit needless I know, but I wanted to flex a little bit
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current) {
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;

        buttonRef.current.style.setProperty('--x', `${x}%`);
        buttonRef.current.style.setProperty('--y', `${y}%`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }

  }, []);

  return (
    <div className="App">
      <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={200}
      recycle={true}
      run={true}
      />
      <header className="App-header">
        <h1>AIphoria Lottery</h1>
        <button onClick={generateNumbers} ref={buttonRef}>Generate Numbers</button>
        <div className="numbers">
          {numbers.map(num => (
            <div key={num} className="number" style={{ backgroundColor: getColour(num) }}>
              <p>{num}</p>
            </div>
          ))}
        </div>
        <button onClick={generateBonusBall} ref={buttonRef}>Generate Bonus Ball</button>
        {bonusBall && (
          <div className="bonus-ball">
            Bonus Ball: <span className="numbers" >
              <p className="number" style={{ backgroundColor: getColour(bonusBall) }}>{bonusBall}</p>
              </span>
          </div>
        )}
        <h2>Previous Results</h2>
        <div className="previous-results">
          {chunkArray(previousResults, 6).map((chunk, index) => (
            <div key={index} className="result-row">
              {chunk.map((result, i) => (
                <div key={i} className="result">
                  {result.map(num => (
                    <span key={num} className="number" style={{ backgroundColor: getColour(num) }}>
                      <p>{num}</p>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;