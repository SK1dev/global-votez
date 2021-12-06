import React, { Component } from "react";
import BallotContract from "../../contracts/BallotContract.json";
import getWeb3 from "../../getWeb3";

import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from '../voter/Navigation';

class AddCandidate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BallotInstance: undefined,
      account: null,
      web3: null,
      name:'',
      party:'',
      manifesto:'',
      constituency:'',
      candidates: null,
      isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateParty = event => {
    this.setState({party : event.target.value});
  }

  updateManifesto = event => {
    this.setState({manifesto : event.target.value});
  }

  updateConstituency = event => {
    this.setState({constituency : event.target.value});
  }

  addCandidate = async () => {
    await this.state.BallotInstance.methods.addCandidate(this.state.name, this.state.party, this.state.manifesto, 
      this.state.constituency).send({from : this.state.account , gas: 1000000});
    // Reload
    window.location.reload(false);
  }

  componentDidMount = async () => {

    // FOR REFRESHING THE PAGE ONLY ONCE -
    if(!window.location.hash){
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BallotContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BallotContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState({ BallotInstance: instance, web3: web3, account: accounts[0] });

      const owner = await this.state.BallotInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }
      
    } catch (error) {
      // Catch any errors for any of the above operations.
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
              ADMIN ACCESS ONLY
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
              Add Candidate
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Your Name - </div>
            <div className="form-input">
              <FormControl
                input = 'text'
                value = {this.state.name}
                onChange={this.updateName}
              />
            </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Party Name - </div>
              <div className="form-input">
                <FormControl
                    input = 'textArea'
                    value = {this.state.party}
                    onChange={this.updateParty}
                />
              </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Manifesto - </div>
              <div className="form-input">
                <FormControl
                    input = 'text'
                    value = {this.state.manifesto}
                    onChange={this.updateManifesto}
                />
              </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Constituency Number - </div>
              <div className="form-input">
                <FormControl
                    input = 'text'
                    value = {this.state.constituency}
                    onChange={this.updateConstituency}
                />
              </div>
          </FormGroup>

          <Button onClick={this.addCandidate} className="button-vote">
            Add
          </Button>
        </div>

      </div>
    );
  }
}

export default AddCandidate;
