const initState = [{
    arr: [],
    turn: false,
}];

export default function historyArr(state = initState, action) {
    if (action.type === 'CHANGE_HISTORY_ARR') {
        return action.payload;
    }
    return state;
}