const initState = {
    white: 12,
    black: 12
};

export default function checkersCount(state = initState, action) {
    if (action.type === 'CHANGE_CHECKERS_COUNT') {
        return action.payload;
    }
    return state;
}