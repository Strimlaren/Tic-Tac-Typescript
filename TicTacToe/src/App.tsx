import { useState } from "react";
import Board from "../src/Components/Board";
import "./App.css";
/* Check if there is a winner and if there is, returns who it was */
function calculateWinner(squares: Array<string>) {
  /* Winning combinations on the board */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  /* Go through all winning combinations */
  const length = lines.length;
  for (let i = 0; i < length; i++) {
    const [a, b, c] = lines[i];
    const player = squares[a];
    /* If the same players sign is in all three winning combination 
    spots, he is the winner. */
    if (player && player === squares[b] && player === squares[c]) {
      return player;
    }
  }
  /* If no match with any winning combination return null */
  return null;
}

export default function App() {
  /* States */
  const [history, setHistory] = useState([{ squares: new Array(9) }]);
  const [moveNumber, setMoveNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [finished, setFinished] = useState(false);
  /* Handles click on individual squares */
  function handleClick(num: number) {
    /* If game is finished, dont do anything */
    if (finished) {
      return;
    }
    /* If number of moves is 9, game is over */
    if (moveNumber >= 9) {
      setFinished(true);
      return;
    }
    /* Get the board of this move and put it in squares*/
    const _history = history.slice(0, moveNumber + 1);
    const squares = [..._history[_history.length - 1].squares];
    /* If this square already contains something, dont do anything, because it is already taken */
    if (squares[num]) {
      return;
    }
    /* If we have a winner, end the game */
    const winner = calculateWinner(squares);
    if (winner) {
      setFinished(true);
      return;
    }
    /* Set X in the clicked square if it was Xs turn, else O */
    squares[num] = xIsNext ? "X" : "O";
    /* Update states. Add this turns board to history, change 
    move-number and change which player is going next. */
    setHistory([..._history, { squares }]);
    setMoveNumber(_history.length);
    setXIsNext(!xIsNext);
  }
  /* Function to allow timetravel the board back to previous moves. */
  function jumpTo(step: number) {
    setMoveNumber(step);
    setXIsNext(step % 2 === 0);
    setFinished(false);
  }
  /* Check if there is a winner */
  const _history = [...history];
  const squares = [..._history[moveNumber].squares];
  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <div className="game">
      <div>{status}</div>
      <Board squares={squares} onClick={(e) => handleClick(e)} />
      <div className="game-info">
        <ul>
          {_history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? "Go to move #" + move : "Go to game start"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
