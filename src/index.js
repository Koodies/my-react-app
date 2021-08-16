import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

function draw(squares) {
    return !squares.includes(null)
}

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
    ]

    for (let line of lines) {
        const [a, b, c] = line
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                i: null
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) return
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                i: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        const history = this.state.history
        this.setState({
            history: history.slice(0, step + 1),
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        let noWinner = false
        const history = this.state.history
        const current = history[this.state.stepNumber]
        if(this.state.stepNumber === 9)  noWinner = draw(current.squares)
        const winner = calculateWinner(current.squares)
        const moves = history.map((step, move) => {
            const square = (history[move].i !== null) ? `Last Move: Box ${history[move].i + 1}` : ""
            const button = move ? `Go to move #${move}` : 'Go to game start'
            const disable = (this.state.stepNumber === move)
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} disabled={disable} >{button}</button> {square}
                </li>
            )
        })

        let status
        if(noWinner) {
            status = `Draw !`
        } else if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
        }

        return (
            <div className="container">
                <div className="banner">
                    <p>THIS IS A BANNER</p>
                </div>
                <div className="game main">
                    <div className="game-board ">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                </div>
                <div className="score-board">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="footer">
                    Source from <a href="https://reactjs.org/tutorial/tutorial.htmls">React</a>, Modified by <a href="https://github.com/Koodies">Koodies</a> 
                </div>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)