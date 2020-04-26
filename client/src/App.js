import React, { Component } from "react";
import ClaimContainer from "./build/ClaimContainer.json";
import getWeb3 from "./getWeb3";

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
      dataField: ""
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




      
      var deployed_smart_contract_address = "0xc30264A7c8703935EC767Ab9a7b6a71eE89144F3"
      const instance = new web3.eth.Contract(
        ClaimContainer.abi,
        deployedNetwork && deployedNetwork.address,
      );



      const _claimsNumber = await instance.methods.claimCount().call();
      var _claims = [];
      for (var i = 0; i < _claimsNumber; i++) {
        const claim = await instance.methods.getClaim(i).call();
        _claims.push(claim);
      }
      this.setState({claims: _claims,claimsNumber: _claimsNumber});


      const _ownedClaimsNumber = await instance.methods.getClaimOwnedNumberLength(accounts[0]).call();
      var _ownedClaims = [];
      for (var i = 0; i < _ownedClaimsNumber; i++) {
        const claim = await instance.methods.getOwnedClaim(i,accounts[0]).call();
        _ownedClaims.push(claim);
      }
      this.setState({ownedClaims: _ownedClaims,ownedClaimsNumber: _ownedClaimsNumber});
      instance.options.address = deployed_smart_contract_address;
      this.setState({account: accounts[0], web3, accounts, contract: instance }, this.runExample);
      console.log(this.state.claims);
      console.log(this.state.ownedClaims);
      
      await instance.methods.getClaim(1).call().then(
        console.log);
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
      await instance.methods.addTest_values2(accounts[0]).call().then(console.log); // worked
      await instance.methods.getMsgSender(accounts[0]).call().then(console.log); // worked 
      // await instance.methods.addOwnedClaim(0,accounts[0]).call().then(console.log("added claim"));
      
      await instance.methods.getClaimOwnedNumberLength(accounts[0]).call().then(console.log); // worked
      // await instance.methods.getClaimOwnedNumber(accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwnedClaim(0,accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwnedClaim(1,accounts[0]).call().then(console.log); // worked
      // await instance.methods.getOwned0Value(accounts[0]).call().then(console.log); // worked
      
      
    } catch (error) {
      // alert(
      //   `Failed to load web3, accounts, or contract. Check console for details.`,
      // );
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

    const claim = await contract.methods.addClaim(ownerField, dataField).send({from: accounts[0]});
    this.setState({
          ownedClaims: [...this.state.claims, claim]
        })
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="Application"> 
   
   <div className="App"><a className="ui tag label">Your account: {this.state.account}</a></div>
      <table class="ui selectable inverted table">
        <thead>
          <tr>
            <th>Issuer</th>
            <th class="right aligned">Issuer Name</th>
            <th class="right aligned">Data</th>
          </tr>
        </thead>
        <tbody>
        {this.state.ownedClaims.map((claim) => (
            <tr key={Math.random()}>
                <td >{claim._issuer}</td>
                <td class="right aligned"> {claim._ownerName}</td>
                <td class="right aligned">{claim._data}</td>

            </tr>
              ))}
        </tbody>
      <a class="ui red tag label">Owned Claims: {this.state.claimsNumber}</a>

      </table>
          <table className="ui selectable celled table">
            <thead>
              <tr>
                <th scope="col">Issuer</th>
                <th scope="col">Issuer Name</th>
                <th scope="col">Data </th>
              </tr>
            </thead>
            <tbody>
            {this.state.claims.map((claim) => (
            <tr key={Math.random()}>
                <td>{claim._issuer}</td>
                <td> {claim._ownerName}</td>
                <td>{claim._data}</td>

            </tr>
              ))}
            </tbody>
      <div class="ui label">
        <i class="mail icon"></i> Available Claims: {this.state.claimsNumber}
      </div>
          </table>    
        <div class="ui raised segment">
          <a class="ui red ribbon label">Add your own claims</a> 
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
