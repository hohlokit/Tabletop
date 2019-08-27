import { connect } from 'redux';

export default connect(
    state => ({
        historyArr: state.historyArr,
    }),
    dispatch => ({
        changeHistoryArr: (historyArr) => {
            dispatch({ type: 'CHANGE_HISTORY_ARR', payload: historyArr });
        }
    })
)(App);