import { combineReducers } from 'redux';

import fieldArray from './changeFieldArray';
import playersTurn from './changePlayersTurn';
import checkersCount from './changeCheckersCount';
import historyArr from './changeHistoryArr';

export default combineReducers({
    fieldArray,
    playersTurn,
    checkersCount,
    historyArr,
});