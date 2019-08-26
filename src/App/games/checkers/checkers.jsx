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

    // TODO1: queens
    // TODO2: history

    becomeQueen = (i, j, turnArray) => {
        if (turnArray[i][j].checkerType === 'blackChecker' && i === 7) {
            turnArray[i][j].checkerType = 'blackQueen';
        }
        if (turnArray[i][j].checkerType === 'whiteChecker' && i === 0) {
            turnArray[i][j].checkerType = 'whiteQueen';
        }
        return turnArray;
    }

    chooseCell = (i, j) => {
        let turnArray = JSON.parse(JSON.stringify(this.props.fieldArray));
        let temp = 0;
        let attackCounter = 0;
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
                let tempReturn = this.findTurns(i, j, turnArray, attackCounter);
                turnArray = tempReturn[0];
            }
        }
        //* Turn
        if (turnArray[i][j].isActive === false && turnArray[i][j].isChosen === 'yes') {

            let canAttackCounter = 0;
            let tempRe = this.moveChecker(i, j, turnArray, attackCounter);
            turnArray = tempRe[0];
            turnArray = this.becomeQueen(i, j, turnArray);
            attackCounter = tempRe[1];
            tempRe = this.findTurns(i, j, turnArray, attackCounter);
            turnArray = tempRe[0];
            canAttackCounter = tempRe[1];
            if (attackCounter === 0 || canAttackCounter === 0) {
                turnArray = this.clearChosenFields(turnArray);
            }
        }
        else {
            turnArray = this.becomeQueen(i, j, turnArray);
            this.props.changeFieldArray(turnArray);
        }
    }

    clearChosenFields = (turnArray) => {
        for (let a = 0; a < 8; a++) {
            for (let b = 0; b < 8; b++) {
                turnArray[a][b].isChosen = 'no';
                turnArray[a][b].isActive = false;
            }
        }
        this.props.changePlayersTurn(!this.props.playersTurn);

        return turnArray;
    }

    moveChecker = (i, j, turnArray, attackCounter) => {
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
                    if (turnArray[a][b].checkerType === 'whiteChecker' || turnArray[a][b].checkerType === 'blackChecker') {
                        if (a - 2 === i && b - 2 === j) {
                            if (turnArray[a - 1][b - 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a - 1][b - 1].id;
                                turnArray[a - 1][b - 1] = clearCell;
                                attackCounter = 1;
                            }
                        }
                        if (a - 2 === i && b + 2 === j) {
                            if (turnArray[a - 1][b + 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a - 1][b + 1].id;
                                turnArray[a - 1][b + 1] = clearCell;
                                attackCounter = 1;
                            }
                        }
                        if (a + 2 === i && b - 2 === j) {
                            if (turnArray[a + 1][b - 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a + 1][b - 1].id;
                                turnArray[a + 1][b - 1] = clearCell;
                                attackCounter = 1;

                            }
                        }
                        if (a + 2 === i && b + 2 === j) {
                            if (turnArray[a + 1][b + 1].checkerColor !== turnArray[a][b].checkerColor) {
                                clearCell.id = turnArray[a + 1][b + 1].id;
                                turnArray[a + 1][b + 1] = clearCell;
                                attackCounter = 1;

                            }
                        }
                    }
                    else if (turnArray[a][b].checkerType === 'whiteQueen' || turnArray[a][b].checkerType === 'blackQueen') {
                        let tempA = a;
                        let tempB = b;
                        if (i > a && j > b) {
                            while (i > tempA && j > tempB) {
                                if (turnArray[tempA][tempB].checkerColor === !this.props.playersTurn) attackCounter = 1;
                                clearCell.id = turnArray[tempA][tempB].id;
                                turnArray[tempA][tempB] = clearCell;
                                tempA++;
                                tempB++;
                            }
                        }
                        else if (i > a && j < b) {
                            while (i > tempA && j < tempB) {
                                if (turnArray[tempA][tempB].checkerColor === !this.props.playersTurn) attackCounter = 1;
                                clearCell.id = turnArray[tempA][tempB].id;
                                turnArray[tempA][tempB] = clearCell;
                                tempA++;
                                tempB--;
                            }
                        }
                        else if (i < a && j < b) {
                            while (i < tempA && j < tempB) {
                                if (turnArray[tempA][tempB].checkerColor === !this.props.playersTurn) attackCounter = 1;
                                clearCell.id = turnArray[tempA][tempB].id;
                                turnArray[tempA][tempB] = clearCell;
                                tempA--;
                                tempB--;
                            }
                        }
                        else if (i < a && j > b) {
                            while (i < tempA && j > tempB) {
                                if (turnArray[tempA][tempB].checkerColor === !this.props.playersTurn) attackCounter = 1;
                                clearCell.id = turnArray[tempA][tempB].id;
                                turnArray[tempA][tempB] = clearCell;
                                tempA--;
                                tempB++;
                            }
                        }
                    }
                    turnArray[i][j] = newCell;
                    turnArray[a][b] = clearCell;
                }
                turnArray[a][b].isChosen = 'no';
                turnArray[a][b].isActive = false;
            }
        }
        this.props.changeFieldArray(turnArray);
        return [turnArray, attackCounter]
    }

    findTurns = (i, j, turnArray, attackCounter) => {

        let temp = 0;
        for (let a = 0; a < 8; a++) {
            for (let b = 0; b < 8; b++) {
                if (turnArray[a][b].checkerColor === this.props.playersTurn) {
                    if (turnArray[a][b].checkerType === 'whiteChecker' || turnArray[a][b].checkerType === 'blackChecker') {
                        if (a < 6 && b > 1) {
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
                    else if (turnArray[a][b].checkerType === 'whiteQueen' || turnArray[a][b].checkerType === 'blackQueen') {
                        let tempA = a;
                        let tempB = b;
                        let queenTemp = 0;
                        //* Left-top
                        if (a > 1 && b > 1) {
                            do {
                                if (tempA !== a && tempB !== b)
                                    if (turnArray[tempA][tempB].checkerColor === turnArray[a][b].checkerColor) break;
                                if (turnArray[tempA - 1][tempB - 1].checkerColor === !this.props.playersTurn && turnArray[tempA - 2][tempB - 2].checkerColor === !this.props.playersTurn) break;
                                if (turnArray[tempA - 1][tempB - 1].checkerColor === !this.props.playersTurn && turnArray[tempA - 2][tempB - 2].checkerColor === this.props.playersTurn) break;
                                if (turnArray[tempA - 1][tempB - 1].checkerColor === !this.props.playersTurn && turnArray[tempA - 2][tempB - 2].checkerType === 'clear') {
                                    temp = 1;
                                    queenTemp = 1;
                                }
                                tempA--;
                                tempB--;
                            } while (tempA > 1 && tempB > 1)
                            if (queenTemp === 1) {
                                turnArray[a][b].leftTop = true;
                            }
                        }
                        queenTemp = 0;
                        //* Right-top
                        if (a > 1 && b < 6) {
                            tempA = a;
                            tempB = b;
                            do {
                                if (tempA !== a && tempB !== b)
                                    if (turnArray[tempA][tempB].checkerColor === turnArray[a][b].checkerColor) break;
                                if (turnArray[tempA - 1][tempB + 1].checkerColor === !this.props.playersTurn && turnArray[tempA - 2][tempB + 2].checkerColor === !this.props.playersTurn) break;

                                if (turnArray[tempA - 1][tempB + 1].checkerColor === !this.props.playersTurn && turnArray[tempA - 2][tempB + 2].checkerType === 'clear') {
                                    temp = 1;
                                    queenTemp = 1;
                                }
                                tempA--;
                                tempB++;
                            } while (tempA > 1 && tempB < 6)
                            if (queenTemp === 1) {
                                turnArray[a][b].rightTop = true;
                            }
                        }
                        queenTemp = 0;
                        //* Right-bottom
                        if (a < 6 && b < 6) {
                            tempA = a;
                            tempB = b;
                            do {
                                if (tempA !== a && tempB !== b)
                                    if (turnArray[tempA][tempB].checkerColor === turnArray[a][b].checkerColor) break;
                                if (turnArray[tempA + 1][tempB + 1].checkerColor === !this.props.playersTurn && turnArray[tempA + 2][tempB + 2].checkerColor === !this.props.playersTurn) break;

                                if (turnArray[tempA + 1][tempB + 1].checkerColor === !this.props.playersTurn && turnArray[tempA + 2][tempB + 2].checkerType === 'clear') {
                                    temp = 1;
                                    queenTemp = 1;
                                }
                                tempA++;
                                tempB++;
                            } while (tempA < 6 && tempB < 6)
                            if (queenTemp === 1) {
                                turnArray[a][b].rightBottom = true;
                            }
                        }
                        queenTemp = 0;
                        //* Left-bottom
                        if (a < 6 && b > 1) {
                            tempA = a;
                            tempB = b;
                            do {
                                if (tempA !== a && tempB !== b) if (turnArray[tempA][tempB].checkerColor === turnArray[a][b].checkerColor) break;
                                if (turnArray[tempA + 1][tempB - 1].checkerColor === !this.props.playersTurn && turnArray[tempA + 2][tempB - 2].checkerColor === !this.props.playersTurn) break;
                                if (turnArray[tempA + 1][tempB - 1].checkerColor === !this.props.playersTurn && turnArray[tempA + 2][tempB - 2].checkerType === 'clear') {
                                    temp = 1;
                                    queenTemp = 1;
                                }
                                tempA++;
                                tempB--;
                                if (queenTemp === 1) {
                                    turnArray[a][b].leftBottom = true;
                                }
                            } while (tempA < 6 && tempB > 1);
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

                if (turnArray[i][j].checkerType === 'whiteChecker' || turnArray[i][j].checkerType === 'blackChecker') {
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
                else if (turnArray[i][j].checkerType === 'whiteQueen' || turnArray[i][j].checkerType === 'blackQueen') {

                    if (temp === 0) {
                        let tempI = i;
                        let tempJ = j;
                        while (tempI < 8 && tempJ >= 0) {
                            ///
                            if (tempI !== i && tempJ !== j) {
                                if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) {
                                    break;
                                }
                            }
                            ///
                            if (turnArray[tempI][tempJ].checkerType === 'clear') {
                                turnArray[tempI][tempJ].isChosen = 'yes';
                            }
                            tempI++;
                            tempJ--;
                        }

                        tempI = i;
                        tempJ = j;
                        while (tempI < 8 && tempJ < 8) {
                            if (tempI !== i && tempJ !== j) {
                                if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) {
                                    break;
                                }
                            }
                            if (turnArray[tempI][tempJ].checkerType === 'clear') {
                                turnArray[tempI][tempJ].isChosen = 'yes';
                            }
                            tempI++;
                            tempJ++;
                        }

                        tempI = i;
                        tempJ = j;
                        while (tempI >= 0 && tempJ >= 0) {
                            if (tempI !== i && tempJ !== j) {
                                if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) {
                                    break;
                                }
                            }
                            if (turnArray[tempI][tempJ].checkerType === 'clear') {
                                turnArray[tempI][tempJ].isChosen = 'yes';
                            }
                            tempI--;
                            tempJ--;
                        }

                        tempI = i;
                        tempJ = j;
                        while (tempI >= 0 && tempJ < 8) {
                            if (tempI !== i && tempJ !== j) {
                                if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) {
                                    break;
                                }
                            }
                            if (turnArray[tempI][tempJ].checkerType === 'clear') {
                                turnArray[tempI][tempJ].isChosen = 'yes';
                            }
                            tempI--;
                            tempJ++;
                        }
                    }
                    else if (temp !== 0) {
                        let tempI = i;
                        let tempJ = j;
                        let enemy = {
                            i: 'pes',
                            j: 'pes',
                        };

                        //Right bottom
                        if (i < 6 && j < 6 && turnArray[i][j].rightBottom === true) {
                            while (tempI < 8 && tempJ < 8) {
                                console.log('Right bottom', turnArray[tempI][tempJ])
                                if (tempI !== i && tempJ !== j) if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) break;
                                if (turnArray[tempI][tempJ].checkerColor === !this.props.playersTurn) {
                                    enemy.i = tempI;
                                    enemy.j = tempJ;
                                }
                                if (enemy.i < tempI && enemy.j < tempJ) {
                                    if (turnArray[tempI][tempJ].checkerType === !this.props.playersTurn || turnArray[tempI][tempJ].checkerType === this.props.playersTurn) break;
                                    if (turnArray[tempI][tempJ].checkerType === 'clear') turnArray[tempI][tempJ].isChosen = 'yes';
                                }
                                tempI++;
                                tempJ++;
                            }
                        }
                        tempI = i;
                        tempJ = j;
                        enemy = {
                            i: 'pes',
                            j: 'pes',
                        };
                        //Left bottom
                        if (i < 6 && j > 1 && turnArray[i][j].leftBottom === true) {
                            while (tempI < 8 && tempJ >= 0) {
                                if (tempI !== i && tempJ !== j) if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) break;
                                if (turnArray[tempI][tempJ].checkerColor === !this.props.playersTurn) {
                                    enemy.i = tempI;
                                    enemy.j = tempJ;
                                }
                                if (enemy.i < tempI && enemy.j > tempJ) {
                                    if (turnArray[tempI][tempJ].checkerType === !this.props.playersTurn || turnArray[tempI][tempJ].checkerType === this.props.playersTurn) break;
                                    if (turnArray[tempI][tempJ].checkerType === 'clear') turnArray[tempI][tempJ].isChosen = 'yes';
                                }
                                tempI++;
                                tempJ--;
                            }
                        }
                        tempI = i;
                        tempJ = j;
                        enemy = {
                            i: 'pes',
                            j: 'pes',
                        };

                        if (i > 1 && j > 1 && turnArray[i][j].leftTop === true) {
                            while (tempI >= 0 && tempJ >= 0) {
                                if (tempI !== i && tempJ !== j) if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) break;
                                if (turnArray[tempI][tempJ].checkerColor === !this.props.playersTurn) {
                                    enemy.i = tempI;
                                    enemy.j = tempJ;
                                }
                                if (enemy.i > tempI && enemy.j > tempJ) {
                                    if (turnArray[tempI][tempJ].checkerType === !this.props.playersTurn || turnArray[tempI][tempJ].checkerType === this.props.playersTurn) break;
                                    if (turnArray[tempI][tempJ].checkerType === 'clear') turnArray[tempI][tempJ].isChosen = 'yes';
                                }
                                tempI--;
                                tempJ--;
                            }
                        }
                        tempI = i;
                        tempJ = j;
                        enemy = {
                            i: 'pes',
                            j: 'pes',
                        };

                        if (i > 1 && j < 6 && turnArray[i][j].rightTop === true) {
                            while (tempI >= 0 && tempJ < 8) {
                                if (tempI !== i && tempJ !== j) if (turnArray[tempI][tempJ].checkerColor === this.props.playersTurn) break;
                                if (turnArray[tempI][tempJ].checkerColor === !this.props.playersTurn) {
                                    enemy.i = tempI;
                                    enemy.j = tempJ;
                                }
                                if (enemy.i > tempI && enemy.j < tempJ) {
                                    if (turnArray[tempI][tempJ].checkerType === !this.props.playersTurn || turnArray[tempI][tempJ].checkerType === this.props.playersTurn) break;
                                    if (turnArray[tempI][tempJ].checkerType === 'clear') turnArray[tempI][tempJ].isChosen = 'yes';
                                }
                                tempI--;
                                tempJ++;
                            }
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

        return [turnArray, temp];
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
                                                    className={this.props.fieldArray[i][j].color ? 'white' : 'black ' + this.props.fieldArray[i][j].isChosen + ' ' + this.props.fieldArray[i][j].checkerType + ' ' + this.props.fieldArray[i][j].id}
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