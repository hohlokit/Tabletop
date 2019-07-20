import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Checkers from '../App/games/checkers'


class App extends React.Component {
    render() {
        return (
            <Router>
                <React.Fragment>
                    <Route path='/' exact component={Checkers} />
                    <Route path='/checkers' exact component={Checkers} />
                </React.Fragment>
            </Router>
        )
    }
}

export default App;