import React from 'react';
import { connect } from 'react-redux';

class Checkers extends React.Component {
    componentWillMount() {
        this.createField();
    }
    createField = () => {
        let fieldRow = [];
        let fieldArr = [];
        let id = 1;
        for (let i = 0; i < 8; i++) {
            fieldRow = [];
            for (let j = 0; j < 8; j++) {
                let cell = {
                    id: id++,
                    isChosen: 'no',
                    isActive: false,
                    checkerType: 'clear',
                    checkerColor: 'none',
                };
                if ((i + j) % 2 === 0) {
                    cell.color = true;
                }
                else {
                    cell.color = false;
                    if (i < 3) {
                        cell.checkerType = 'blackChecker';
                        cell.checkerColor = true;
                    }
                    if (i > 4) {
                        cell.checkerType = 'whiteChecker';
                        cell.checkerColor = false;
                    }
                }
                fieldRow.push(cell);
            }
            fieldArr.push(fieldRow);
        }
        this.props.changeFieldArray(fieldArr);
    }

    // TODO1: fight with many
    // TODO2: queens

    chooseCell = (i, j) => {
        let turnArray = JSON.parse(JSON.stringify(this.props.fieldArray));
        let temp = 0;
        console.log('cell', turnArray[i][j]);
        //* Is checker controlled by active player
        if (this.props.playersTurn === turnArray[i][j].checkerColor) {
            //* Is the checker chosen
            if (turnArray[i][j].isChosen === 'no') {
                for (let a = 0; a < 8; a++) {
                    for (let b = 0; b < 8; b++) {
                        if (turnArray[a][b].isChosen === 'yes') temp++;
                    }
                }
            }
            //* Cancel choose and finding available turns
            if (temp === 0) {
                turnArray = this.findTurns(i, j, turnArray);
            }
        }
        //* Turn
        if (turnArray[i][j].isActive === false && turnArray[i][j].isChosen === 'yes') {
            turnArray = this.moveChecker(i, j, turnArray);
        }
        this.props.changeFieldArray(turnArray);
    }

    moveChecker = (i, j, turnArray) => {
        let counter = 0;
        if (counter === 0) {
            for (let a = 0; a < 8; a++) {
                for (let b = 0; b < 8; b++) {
                    if (turnArray[a][b].isActive === true) {
                        let clearCell = {
                            id: turnArray[a][b].id,
                            isChosen: 'no',
                            isActive: false,
                            checkerType: 'clear',
                            checkerColor: 'none',
                            color: false,
                        }
                        let newCell = {
                            id: turnArray[i][j].id,
                            isChosen: 'no',
                            isActive: false,
                            checkerType: turnArray[a][b].checkerType,
                            checkerColor: turnArray[a][b].checkerColor,
                            color: false,
                        }
                        turnArray[i][j] = newCell;
                        turnArray[a][b] = clearCell;
                        counter++;
                        if (a - 2 === i && b - 2 === j) {
                            if (turnArray[a - 1][b - 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a - 1][b - 1].id;
                                turnArray[a - 1][b - 1] = clearCell;
                            }
                        }
                        if (a - 2 === i && b + 2 === j) {
                            if (turnArray[a - 1][b + 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a - 1][b + 1].id;
                                turnArray[a - 1][b + 1] = clearCell;
                            }
                        }
                        if (a + 2 === i && b - 2 === j) {
                            if (turnArray[a + 1][b - 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a + 1][b - 1].id;
                                turnArray[a + 1][b - 1] = clearCell;
                            }
                        }
                        if (a + 2 === i && b + 2 === j) {
                            if (turnArray[a + 1][b + 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a + 1][b + 1].id;
                                turnArray[a + 1][b + 1] = clearCell;
                            }
                        }
                    }
                    turnArray[a][b].isChosen = 'no';
                    turnArray[a][b].isActive = false;
                }
            }
        }
        this.props.changePlayersTurn(!this.props.playersTurn);
        return turnArray;
    }

    findTurns = (i, j, turnArray) => {
        let temp = 0;
        for (let a = 0; a < 8; a++) {
            for (let b = 0; b < 8; b++) {
                if (turnArray[a][b].checkerColor === this.props.playersTurn) {
                    if (a < 6 && b >= 2) {
                        if (turnArray[a + 1][b - 1].checkerColor === !this.props.playersTurn && turnArray[a + 2][b - 2].checkerType === 'clear') {
                            temp++;
                        }
                    }
                    if (a < 6 && b <= 5) {
                        if (turnArray[a + 1][b + 1].checkerColor === !this.props.playersTurn && turnArray[a + 2][b + 2].checkerType === 'clear') {
                            temp++;
                        }
                    }
                    if (a > 1 && b >= 2) {
                        if (turnArray[a - 1][b - 1].checkerColor === !this.props.playersTurn && turnArray[a - 2][b - 2].checkerType === 'clear') {
                            temp++;
                        }
                    }
                    if (a > 1 && b <= 5) {
                        if (turnArray[a - 1][b + 1].checkerColor === !this.props.playersTurn && turnArray[a - 2][b + 2].checkerType === 'clear') {
                            temp++;
                        }
                    }
                }
            }
        }
        if (turnArray[i][j].isChosen === 'no') {
            turnArray[i][j].isChosen = 'yes';
            turnArray[i][j].isActive = true;
            //* Check checker's owner
            if (turnArray[i][j].checkerColor === this.props.playersTurn) {
                if (temp === 0) {
                    if (turnArray[i][j].checkerColor === false) {
                        if (i > 0) {
                            if (j > 0) {
                                if (turnArray[i - 1][j - 1].checkerType === 'clear') {
                                    turnArray[i - 1][j - 1].isChosen = 'yes';
                                }
                            }
                            if (j < 7) {
                                if (turnArray[i - 1][j + 1].checkerType === 'clear') {
                                    turnArray[i - 1][j + 1].isChosen = 'yes';
                                }
                            }
                        }
                    }
                    if (turnArray[i][j].checkerColor === true) {
                        if (i < 7) {
                            if (j > 0) {
                                if (turnArray[i + 1][j - 1].checkerType === 'clear') {
                                    turnArray[i + 1][j - 1].isChosen = 'yes';
                                }
                            }
                            if (j < 7) {
                                if (turnArray[i + 1][j + 1].checkerType === 'clear') {
                                    turnArray[i + 1][j + 1].isChosen = 'yes';
                                }
                            }
                        }
                    }
                }
                if (temp !== 0) {
                    if (i < 6 && j >= 2) {
                        if (turnArray[i + 1][j - 1].checkerColor === !this.props.playersTurn && turnArray[i + 2][j - 2].checkerType === 'clear') {
                            turnArray[i + 2][j - 2].isChosen = 'yes';
                        }
                    }
                    if (i < 6 && j <= 5) {
                        if (turnArray[i + 1][j + 1].checkerColor === !this.props.playersTurn && turnArray[i + 2][j + 2].checkerType === 'clear') {
                            turnArray[i + 2][j + 2].isChosen = 'yes';
                        }
                    }
                    if (i > 1 && j >= 2) {
                        if (turnArray[i - 1][j - 1].checkerColor === !this.props.playersTurn && turnArray[i - 2][j - 2].checkerType === 'clear') {
                            turnArray[i - 2][j - 2].isChosen = 'yes';
                        }
                    }
                    if (i > 1 && j <= 5) {
                        if (turnArray[i - 1][j + 1].checkerColor === !this.props.playersTurn && turnArray[i - 2][j + 2].checkerType === 'clear') {
                            turnArray[i - 2][j + 2].isChosen = 'yes';
                        }
                    }
                }
            }
        }

        else if (turnArray[i][j].isChosen === 'yes') {
            turnArray[i][j].isActive = false;
            for (let a = 0; a < 8; a++) {
                for (let b = 0; b < 8; b++) {
                    turnArray[a][b].isChosen = 'no';
                }
            }
        }
        return turnArray;
    }

    render() {
        return (
            <div>
                <h1>Checkers</h1>
                <div className="leftNum">
                    <div>
                        <div className="indexation">8</div>
                        <div className="indexation">7</div>
                        <div className="indexation">6</div>
                        <div className="indexation">5</div>
                        <div className="indexation">4</div>
                        <div className="indexation">3</div>
                        <div className="indexation">2</div>
                        <div className="indexation">1</div>
                    </div>
                    <div className="bottomNum">
                        <div className="gameField">
                            <table className="field" cellSpacing='0'>
                                <tbody>
                                    {this.props.fieldArray.map((v1, i) => (
                                        <tr className="row">
                                            {v1.map((v2, j) => (
                                                <td
                                                    key={v2.id}
                                                    className={this.props.fieldArray[i][j].color ? 'white' : 'black ' + this.props.fieldArray[i][j].isChosen + ' ' + this.props.fieldArray[i][j].checkerType}
                                                    onClick={() => this.chooseCell(i, j)}
                                                />
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="horizontal">
                            <div className="indexation">A</div>
                            <div className="indexation">B</div>
                            <div className="indexation">C</div>
                            <div className="indexation">D</div>
                            <div className="indexation">E</div>
                            <div className="indexation">F</div>
                            <div className="indexation">G</div>
                            <div className="indexation">H</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        fieldArray: state.fieldArray,
        playersTurn: state.playersTurn,
    }),
    dispatch => ({
        changeFieldArray: (fieldArray) => {
            dispatch({ type: 'CHANGE_FIELD_ARRAY', payload: fieldArray });
        },
        changePlayersTurn: (playersTurn) => {
            dispatch({ type: 'CHANGE_PLAYERS_TURN', payload: playersTurn });
        },

    })
)(Checkers);