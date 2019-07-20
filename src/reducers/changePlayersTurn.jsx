const initState = false;

export default function playersTurn(state = initState, action) {
    if (action.type === 'CHANGE_PLAYERS_TURN') {
        return action.payload;
    }
    return state;
}