// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.17;
// pragma experimental ABIEncoderV2;

contract BallotContract {

    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    function BallotContract() public {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    struct Candidate{
        string name;
        string party;
        string manifesto;
        uint voteCount;
        uint constituency;
        uint candidateId;
    }
    
    mapping(uint => Candidate) public candidateDetails;

    function addCandidate(string _name, string _party, string _manifesto, uint _constituency) 
    public onlyAdmin {
        Candidate memory newCandidate = Candidate({
           name : _name,
           party : _party,
           manifesto : _manifesto,
           voteCount : 0,
           constituency : _constituency,
           candidateId : candidateCount
        });

        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    function getCandidateNumber() public view returns (uint) {
        return candidateCount;
    }

    struct Voter{
        address voterAddress;
        string name;
        uint voterId;
        uint constituency;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;

    mapping(address => Voter) public voterDetails;

    function VoterRequest(string _name, uint _voterId, uint _constituency) public {
        Voter memory newVoter = Voter({ 
           voterAddress : msg.sender,
           name : _name,
           voterId : _voterId,
           constituency : _constituency,
           hasVoted : false,
           isVerified : false
        });

        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function vote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);

        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}