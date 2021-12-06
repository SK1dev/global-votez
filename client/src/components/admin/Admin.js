import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from '../voter/Navigation';

import { Button } from 'react-bootstrap';

class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
      isOwner:false,
      start:false,
      end:false
    }
  }

  addCandidate = async () => {

    await this.state.BallotInstance.methods.addCandidate(this.state.name, this.state.party, 
      this.state.manifesto, this.state.constituency).send({from : this.state.account , gas: 1000000});
    window.location.reload(false);
  }

  startElection = async () => {
    await this.state.BallotInstance.methods.startElection().send({from : this.state.account , gas: 1000000});
    window.location.reload(false);
  }

  endElection = async () => {
    await this.state.BallotInstance.methods.endElection().send({from : this.state.account , gas: 1000000});
    window.location.reload(false);
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

      const owner = await this.state.BallotInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }

      let start = await this.state.BallotInstance.methods.getStart().call();
      let end = await this.state.BallotInstance.methods.getEnd().call();

      this.setState({start : start, end : end });
      
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
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
              ACCESS FOR ADMIN ONLY
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }
    return (
      <div className="App">
        <div>{this.state.owner}</div> 
        <p>Account address - {this.state.account}</p> 
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              ADMIN PORTAL
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="admin-buttons">
          {this.state.start
            ? <Button onClick={this.startElection} className="admin-buttons-start-s">Start Election</Button>
            : <Button onClick={this.startElection} className="admin-buttons-start-e">Start Election</Button>
          }
          {this.state.end
            ? <Button onClick={this.endElection} className="admin-buttons-end-s">End Election</Button>
            : <Button onClick={this.endElection} className="admin-buttons-end-e">End Election</Button>
          }
        </div>

      </div>
    );
  }
}

export default Admin;
