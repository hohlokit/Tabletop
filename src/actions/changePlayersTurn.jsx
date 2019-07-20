import { connect } from 'redux';

export default connect(
    state => ({
        playersTurn: state.playersTurn,
    }),
    dispatch => ({
        changePlayersTurn: (playersTurn) => {
            dispatch({ type: 'CHANGE_PLAYERS_TURN', payload: playersTurn });
        }
    })
)(App);