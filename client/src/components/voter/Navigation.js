import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

// Navigation component for a voter
class Navigation extends Component {
    render() {
        return (
            <div className='navbar'>
                    <Link to = '/' className ="heading">HOME</Link>
                    <Link to = '/CandidateDetails'>CANDIDATES</Link>
                    <Link to = '/VoterRequest'>APPLY TO VOTE</Link>
                    <Link to = '/Vote'>VOTE</Link>
                </div>
        );
    }
}

export default Navigation;