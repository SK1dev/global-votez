import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
            <div className='navbar'>
                    <div className="Admin">ADMIN</div>
                    <Link to ='/' className ="heading">HOME</Link>
                    <Link to='/CandidateDetails'>CANDIDATES</Link>
                    <Link to='/VoterRequest'>VOTING APPLICATION</Link>
                    <Link to='/Vote'>VOTE</Link>
                    <Link to='/VerifyVoter'>VERIFY VOTER</Link>
                    <Link to='/AddCandidate'>ADD CANDIDATE</Link>
                    <Link to='/Result'>RESULTS</Link>
                    <Link to='/Admin'>START/END</Link>
                </div>
        );
    }
}

export default NavigationAdmin;