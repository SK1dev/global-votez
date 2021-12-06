import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import NavigationAdmin from '../admin/NavigationAdmin';
import Navigation from '../voter/Navigation';
import logo from '../../logo.png'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
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

      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

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

    return (
      <div className="App">
      <div>{this.state.owner}</div> 
        <p>Account address - {this.state.account}</p> 
        <div className="CandidateDetails home_CandidateDetails">
        <img id="logo" src={logo} alt="Global Votez Logo" />
          <div className="CandidateDetails-title home_CandidateDetails-title">
            <h1>
              Admin Portal
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="vote_slogan"><h3>Secure and convenient voting, accessible for everyone</h3></div>
        <div className="home">
            <p>WELCOME TO GLOBAL VOTEZ

            </p>
            <div>
                 
                <ul className="voting_system_info">
                  <li>Voting System: Elections</li>
                  <li>Country: United Kingdom </li>
                  <li>Created by: SK</li>
                  </ul>
            </div>
        </div>

      </div>
    );
  }
}

export default Home;
