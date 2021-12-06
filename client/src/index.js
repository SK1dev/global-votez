import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AddCandidate from './components/admin/AddCandidate';
import CandidateDetails from './components/candidate/CandidateDetails';
import VoterRequest from './components/voter/VoterRequest';
import VerifyVoter from './components/admin/VerifyVoter';
import Vote from './components/voter/Vote';
import Result from './components/admin/Result';
import Admin from './components/admin/Admin';
import Home from './components/core/Home';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/AddCandidate' component={AddCandidate} />
            <Route path='/CandidateDetails' component={CandidateDetails} />
            <Route path='/VoterRequest' component={VoterRequest} />
            <Route path='/VerifyVoter' component={VerifyVoter} />
            <Route path='/Vote' component={Vote} />
            <Route path='/Result' component={Result} />
            <Route path='/Admin' component={Admin} />
        </Switch>
    </Router>,
    document.getElementById('root')
);