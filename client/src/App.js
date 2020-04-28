import React, { Component } from "react";
import ClaimContainer from "./build/ClaimContainer.json";
import getWeb3 from "./getWeb3";
// import { Button, Confirm} from 'semantic-ui-react'
import "./App.css";

class App extends Component {
  constructor(props){
    super(props);

   
    this.state = {
      account: 0,
      testIndex: 0,
      claimRequestNumber: 0,
      claims: [],
      claimsNumber: 0,
      ownedClaims: [],
      contract: null,
      web3: null,
      accounts:null,
      addedClaim: false,
      ownedClaimsNumber: 0,
      ownerField: "",
      dataField: "",
      confirmation: false,
      claimToAddId: 0
    };
    
    this.handleChangeO = this.handleChangeO.bind(this);
    this.handleChangeD = this.handleChangeD.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount = async () => {  
    try {

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ClaimContainer.networks[networkId];




      
      var deployed_smart_contract_address = "0x854EC08BBAd607A30015eB5Bc40542dC8724da8E"
      const instance = new web3.eth.Contract(
        ClaimContainer.abi,
        deployedNetwork && deployedNetwork.address,
      );



      const _claimsNumber = await instance.methods.claimCount().call();
      var _claims = [];
      for (var i = 0; i < _claimsNumber; i++) {
        const claim = await instance.methods.getClaim(i).call();
        _claims.push({...claim,id: i});
      }
      this.setState({claims: _claims,claimsNumber: _claimsNumber});


      const _ownedClaimsNumber = await instance.methods.getClaimOwnedNumberLength(accounts[0]).call();
      var _ownedClaims = [];
      for (var i = 0; i < _ownedClaimsNumber; i++) {
        const claim = await instance.methods.getOwnedClaim(i,accounts[0]).call();
        _ownedClaims.push({...claim,id: i});
      }
      this.setState({ownedClaims: _ownedClaims,ownedClaimsNumber: _ownedClaimsNumber});
      instance.options.address = deployed_smart_contract_address;
      this.setState({account: accounts[0], web3, accounts, contract: instance }, this.runExample);
      // console.log(this.state.claims);
      // console.log(this.state.ownedClaims);
      
      // await instance.methods.getClaim(1).call().then(
      //   console.log);
      // -------------------------- hard coded
      // pentru valoare out of bounds -> VM ERROR
      // await instance.methods.returnTest_ConstrValues(0).call().then(console.log);
      // await instance.methods.addToTestingAdding().call().then(console.log);

      // -------------------------- hard coded
      // await instance.methods.fill_map().call().then(console.log);
      // await instance.methods.addTest_values().call().then(console.log);  // DIES -> possible out of bounds ? VM EXCEPTION

      // -------------------------- using address accounts
      // await instance.methods.addTest_values(accounts[0]).call().then(console.log); // worked
      // await instance.methods.addOwnedClaim(0,accounts[0]).send({from: accounts[0]}).then(console.log); // worked
      // await instance.methods.addTest_values2(accounts[0]).call().then(console.log); // worked
      // await instance.methods.getMsgSender(accounts[0]).call().then(console.log); // worked 
      // await instance.methods.addOwnedClaim(0,accounts[0]).call().then(console.log("added claim"));
      
      // await instance.methods.getClaimOwnedNumberLength(accounts[0]).call().then(console.log); // worked
      // await instance.methods.getClaimOwnedNumber(accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwnedClaim(0,accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwnedClaim(1,accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwned0Value(accounts[0]).call().then(console.log); // worked
      
      
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  async handleSubmit(event){
    event.preventDefault();
    await this.updateValue();
  };
  handleChangeO(event){
    this.setState({ownerField: event.target.value})

  };  
  handleChangeD(event){
    this.setState({dataField: event.target.value})
  };
  
  updateValue = async () => {
    const { accounts, contract, ownerField, dataField} = this.state;
    // await contract.methods.set(value).send({ from: accounts[0] });
    const isDuplicate = await contract.methods.isDuplicateClaim(ownerField, dataField, accounts[0]).call();
    if(isDuplicate){
      alert(
        `The claim is already added`,
      );
    } else {
      const claim = await contract.methods.addClaim(ownerField, dataField).send({from: accounts[0]});
      this.setState({
            ownedClaims: [...this.state.claims, claim]
          })
    }
  };
    
  confirm = () => this.setState({ confirmation: true })
  decline = () => this.setState({ confirmation: false })

  addClaim = async () => {
    const {claimToAddId,contract,account } = this.state;
    const isDuplicate = await contract.methods.isDuplicateOwnedClaim(claimToAddId, account).call();
    const {_ownerName, _data, _issuer} = await contract.methods.getClaim(claimToAddId).call();
    if(isDuplicate){
      const alertMessage = "Claim\nOwner " + _ownerName + "\nData: " + _data + "\nIssuer:" + _issuer + "\Is already added. If this another claim was wanted, try again.";
      alert(alertMessage);
    } else {
      const {_ownerName, _data, _issuer} = await contract.methods.getClaim(claimToAddId).call();
      const alertMessage = "Transaction for claim \Ownned by " + _ownerName + "\nData " + _data + "\nIssuer address at " + _issuer + "\nHas been sent!";
      alert(alertMessage);
      await contract.methods.addOwnedClaim(claimToAddId,account).send({from: account}).then(console.log());
      this.setState({confirmation: true});
    }
  };

  fetchClaim = id => {
    this.setState({confirmation: false, claimToAddId: id});
    this.addClaim();
  }
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="Application"> 
   
   <div className="ui raised segment">
      <a className="ui red ribbon label">Your account: {this.state.account}</a>  
      <a className="ui red tag label">Owned Claims: {this.state.ownedClaimsNumber}</a>
      <table className="ui selectable inverted table">
        <thead>
          <tr>
            <th>Issuer</th>
            <th className="right aligned">Issuer Name</th>
            <th className="right aligned">Data</th>
          </tr>
        </thead>
        <tbody>
        {this.state.ownedClaims.map((claim) => (
            <tr key={claim.id} >
                <td >{claim._issuer}</td>
                <td className="right aligned"> {claim._ownerName}</td>
                <td className="right aligned">{claim._data}</td>

            </tr>
              ))}
        </tbody>
      </table>
      </div>


      
      <div className="ui raised segment">
      <a className="ui red tag label">Available Claims: {this.state.claimsNumber} ----- Pressing on any claims will begin a transaction for adding them</a>
          <table className="ui selectable celled table">
            <thead>
              <tr>
                <th scope="col">Issuer</th>
                <th className="right aligned" scope="col">Issuer Name</th>
                <th className="right aligned" scope="col">Data </th>
              </tr>
            </thead>
            {this.state.claims.map((claim) => (
            <tbody key={claim.id} value={claim.id} onClick={() => this.fetchClaim(claim.id)}>
            <tr >
                <td>{claim._issuer}</td>
                <td> {claim._ownerName}</td>
                <td>{claim._data}</td>
            </tr>
            </tbody>
            ))}
          </table>    
        </div>
        <div className="ui raised segment">
          <a className="ui red ribbon label">Add your own claims</a> 
        <form className="ui form"  onSubmit={this.handleSubmit}>
          <div className="field">
            <label>Owner: </label>
            <input type="text" name="first-name" value={this.state.ownerField } onChange={this.handleChangeO} placeholder="...owner"/>
          </div>
          <div className="field">
            <label>Data: </label>
            <input type="text" name="last-name" value={this.state.dataField } onChange={this.handleChangeD} placeholder="...data"/>
          </div>
          <button type="submit" className="ui button" value="Submit">Submit</button>
        </form>
        
        </div>
      </div>
    );
  }
}

export default App;
