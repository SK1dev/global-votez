import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import { Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from '../voter/Navigation';

import '../../index.css';

class VerifyVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
      votersList: null,
      isOwner:false
    }
  }

  componentDidMount = async () => {
    if(!window.location.hash){
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BallotContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BallotContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ BallotInstance: instance, web3: web3, account: accounts[0] });

      let voterCount = await this.state.BallotInstance.methods.getVoterCount().call();

      let votersList = [];
      for(let i=0;i<voterCount;i++){
          let voterAddress = await this.state.BallotInstance.methods.voters(i).call();
          let voterDetails = await this.state.BallotInstance.methods.voterDetails(voterAddress).call();
          if(!voterDetails.hasVoted){
          }
          votersList.push(voterDetails);
      }
      this.setState({votersList : votersList});

      const owner = await this.state.BallotInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  verifyVoter = async event => {
    await this.state.BallotInstance.methods.verifyVoter(event.target.value).send({from : this.state.account , 
      gas: 1000000});
    window.location.reload(false);
  }

  render() {
    let votersList;
    if(this.state.votersList){
        votersList = this.state.votersList.map((voter) => {
        return (
          <div className="candidate">
            <div className="candidateName">{voter.name}</div>
            <div className="candidateDetails">
              <div>VoterId : {voter.voterId}</div>
              <div>Constituency : {voter.constituency}</div>
              <div>Voter Address : {voter.voterAddress}</div>
            </div>

            {voter.isVerified ? <Button className="button-verified">Verified</Button> : <Button 
            onClick={this.verifyVoter} value={voter.voterAddress} 
            className="button-verify">Verify</Button>}
          </div>
        );
      });
    }
    
    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            Loading Web3, accounts, and contract..
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(!this.state.isOwner){
      return(
        <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>
                ADMIN ACCESS ONLY
              </h1>
            </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
      );
    }

    return (
      <div>
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              Verify Voters
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div>
          {votersList}
        </div>
      </div>
    );
  }
}

export default VerifyVoter;
