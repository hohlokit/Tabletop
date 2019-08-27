import { connect } from 'redux';

export default connect(
    state => ({
        checkersCount: state.checkersCount,
    }),
    dispatch => ({
        onChangeCheckersCount: (checkersCount) => {
            dispatch({ type: 'CHANGE_CHECKERS_COUNT', payload: checkersCount });
        }
    })
)(App);