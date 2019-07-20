import { combineReducers } from 'redux';

import fieldArray from './changeFieldArray';
import playersTurn from './changePlayersTurn';

export default combineReducers({
    fieldArray,
    playersTurn,
});