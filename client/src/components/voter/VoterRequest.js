import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import NavigationAdmin from '../admin/NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl, Button } from 'react-bootstrap';

class VoterRequest extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
      name: '',
      voterId: '',
      constituency: '',
      candidates: null,
      registered: false,
      isOwner: false
    }
  }

  updatename = event => {
    this.setState({ fName: event.target.value });
  }

  updateVoterId = event => {
    this.setState({ voterId: event.target.value });
  }

  updateConstituency = event => {
    this.setState({ constituency: event.target.value });
  }

  addVoter = async () => {
    await this.state.BallotInstance.methods.VoterRequest(this.state.name, this.state.voterId, 
  this.state.constituency).send({ from: this.state.account, gas: 1000000 });
    window.location.reload(false);
  }

  componentDidMount = async () => {
    if (!window.location.hash) {
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

      let registered;
      for (let i = 0; i < voterCount; i++) {
        let voterAddress = await this.state.BallotInstance.methods.voters(i).call();
        if (voterAddress === this.state.account) {
          registered = true;
          break;
        }
      }

      this.setState({ registered: registered });

      const owner = await this.state.BallotInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }
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

    if (this.state.registered) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              ALREADY REQUESTED TO REGISTER
            </h1>
          </div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }
    return (
      <div className="App">
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTER FORM
            </h1>
          </div>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div id='voting_request_form' classfName="form">
          <div>
            <h2 className="voting_request_form_title">Submit your request !</h2>
          </div>
          <div id='voting_request_form_content'>
            <div className="form-input">
              <FormControl
                input='text'
                value={this.state.name}
                onChange={this.updatename}
                placeholder='Your Name'
              />
            </div>

            <div className="form-input">
              <FormControl
                input='textArea'
                value={this.state.voterId}
                onChange={this.updateVoterId}
                placeholder='Your VoterId Number'
              />
            </div>

            <div className="form-input">
              <FormControl
                input='text'
                value={this.state.constituency}
                onChange={this.updateConstituency}
                placeholder='Your Constituency'
              />
            </div>
          <Button onClick={this.addVoter} className="button-vote">
            Voting Request
          </Button>
        </div>
        </div>

      </div>
    );
  }
}

export default VoterRequest;
