import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import '../../index.css';

import NavigationAdmin from '../admin/NavigationAdmin';
import Navigation from '../voter/Navigation';

class CandidateDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null,
      loaded:false,
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

      let candidateCount = await this.state.BallotInstance.methods.getCandidateNumber().call();
      this.setState({ candidateCount : candidateCount });

      let candidateList = [];
      for(let i=0;i<candidateCount;i++){
        let candidate = await this.state.BallotInstance.methods.candidateDetails(i).call();

        candidateList.push(candidate);
      }

      this.setState({candidateList : candidateList});

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
  

  render() {
    let candidateList;
    if(this.state.candidateList){
      candidateList = this.state.candidateList.map((candidate) => {
        return (
        <div className="candidate">
          <div className="candidateName">{candidate.name}</div>
          <div className="candidateDetails">
            <div>Party : {candidate.party}</div>
            <div>Manifesto : {candidate.manifesto}</div>
            <div>Constituency Number : {candidate.constituency}</div>
            <div>Candidate ID : {candidate.candidateId}</div>
          </div>
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
    
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Candidates List
          </h1>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        
        <div className="CandidateDetails-sub-title">
          Total Number of Candidates - {this.state.candidateCount}
        </div>
        <div>
          {candidateList}
        </div>
      </div>
    );
  }
}

export default CandidateDetails;
