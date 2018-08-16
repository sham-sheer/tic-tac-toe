import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  const classNames = 'square' + (props.winnerClass);
  return (
    <button className={classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        winnerClass={(this.props.winningSquares && this.props.winningSquares.includes(i)) ? '--winner' : ''}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    const rowWidth = Math.sqrt(this.props.squares.length);

    for(let i = 0; i < rowWidth; i++) {
      let rowCells = [];
      for(let j = 0; j < rowWidth; j++) {
        const cell = i * rowWidth + j;
        rowCells.push(<span className="board-cell">{this.renderSquare(cell)}</span>);
      }
      rows.push(<div className="board-row">{rowCells}</div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isMoveSortReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winningPlayer || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentLocation: getLocation(i)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,

    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeMoveSort(isMoveSortReversed) {
    if (!isMoveSortReversed) {
      this.setState({
        isMoveSortReversed: true
      })
    } else {
      this.setState({
        isMoveSortReversed: false
      })
    }
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    const isMoveSortReversed = this.state.isMoveSortReversed;
    const moves = history.map((step, move) => {
    const location = step.currentLocation;
    let desc = move ?
      'Go to move #' + move + ' , At: ' + location :
      'Go to game start';
    if (move === this.state.stepNumber) {
      desc = <b>{desc}</b>
    }
    return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });


    let status;
    if (winner.winningPlayer) {
      status = 'Winner: ' + winner.winningPlayer;
    } else {
      if (winner.isDraw) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner && winner.winningSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{isMoveSortReversed ? moves.reverse() : moves}</ol>
          <button onClick={() => this.changeMoveSort(isMoveSortReversed)}>
            Toggle List
            </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winningSquares: lines[i],
        winningPlayer: squares[a],
        isDraw: false,
      }
    }
  }
  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}

function getLocation(move) {
  const locationMap = {
    0 : 'row: 1, col: 1',
    1 : 'row: 1, col: 2',
    2 : 'row: 1, col: 3',
    3 : 'row: 2, col: 1',
    4 : 'row: 2, col: 2',
    5 : 'row: 2, col: 3',
    6 : 'row: 3, col: 1',
    7 : 'row: 3, col: 2',
    8 : 'row: 3, col: 3',
  };



  return locationMap[move]
}
