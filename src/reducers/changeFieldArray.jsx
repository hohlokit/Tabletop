const initState = [];

export default function fieldArray(state = initState, action) {
    if (action.type === 'CHANGE_FIELD_ARRAY') {
        return action.payload;
    }
    return state;
}