import { connect } from 'redux';

export default connect(
    state => ({
        fieldArray: state.fieldArray,
    }),
    dispatch => ({
        onChangeGridArray: (fieldArray) => {
            dispatch({ type: 'CHANGE_FIELD_ARRAY', payload: fieldArray });
        }
    })
)(App);