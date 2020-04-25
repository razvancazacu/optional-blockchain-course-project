import React, { Component } from "react";
import ClaimContainer from "./build/ClaimContainer.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props){
    super(props);

   
    this.state = {
      account: 0,
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




      
      var deployed_smart_contract_address = "0x943d15F59f121A8BC67faDFD2b0fD4083954ca45"
      const instance = new web3.eth.Contract(
        ClaimContainer.abi,
        deployedNetwork && deployedNetwork.address,
      );



      const _claimsNumber = await instance.methods.claimCount().call();
      // this.setState({ claimsNumber })
      var _claims = [];
      for (var i = 1; i <= _claimsNumber; i++) {
      const claim = await instance.methods.getClaim(i).call();
        // _claims: [...this.state.claims, claim];
        _claims.push(claim);
    }
      this.setState({claims: _claims,claimsNumber: _claimsNumber});



      //   web3.eth.sendTransaction({
      //     from: accounts[0],
      //     data: "1000" // deploying a contracrt
      // }, function(error, hash){
      //     console.log("error");
      // });

      // instance.methods.getClaim(1).call().then(
      //   console.log);

      // instance.addClaimToOwned.sendTransaction(accounts[1]).then(
      //   console.log);
      

      // This Worked
      // await instance.methods.addClaimToOwned(1,accounts[0]).send({from: accounts[0]}).then(
      //   console.log);

      // instance.methods.getClaimOwned(1).call().then(
      //   console.log);
      // https://github.com/MetaMask/metamask-extension/issues/3094
      instance.methods.get().call().then(
        console.log);
  
      // await instance.methods.getClaimOwnedNumber().call().then(
      //   console.log);      
        // await instance.methods.getClaimOwnedWithAddress(1,accounts[0]).call().then(
        //   console.log); 
      // await instance.methods.claimCount().call().then(
      //   console.log);

      // const ownedClaimsNumber = await instance.methods.get().call();
      // this.setState({ ownedClaimsNumber })
      
      // console.log(instance.methods.ownedClaims(accounts[0]));
      // console.log(instance.methods.claims(1));
      // for (var i = 1; i <= ownedClaimsNumber; i++) {
      // const ownedClaim = await instance.methods.getOwnedClaim(i).call();
      //   this.setState({
      //     ownedClaims: [...this.state.ownedClaims, ownedClaim]
      //   })
      // }
      instance.options.address = deployed_smart_contract_address
      this.setState({account: accounts[0], web3, accounts, contract: instance }, this.runExample);
      console.log(this.state.claims);


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
      <div className="App"> 
      <p>Claims: {this.state.claimsNumber}</p>
        
          <table className="ui celled table">
            <thead>
              <tr>
                <th scope="col">Issuer</th>
                <th scope="col">Owner</th>
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
          </table>
          <a className="ui tag label">Your account: {this.state.account}</a>

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
    );
  }
}

export default App;
