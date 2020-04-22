import React, { Component } from "react";
import MyContract from "./build/MyContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { value: '', storageValue: '', web3: null, accounts: null, contract: null};

  constructor(props){
    super(props);
    this.state = {value: '', storageValue: '...', web3: null, accounts: null, contract: null};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyContract.networks[networkId];
      var deployed_smart_contract_address = "0x36D21007733eD886CAdBA43d73Ac67B7967B6399"
      const instance = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      instance.options.address = deployed_smart_contract_address
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
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
  handleChange(event){
    this.setState({value: event.target.value})
  };
  updateValue = async () => {
    const { accounts, contract, value} = this.state;
    // Stores a given value, 5 by default.
    await contract.methods.set(value).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
       <h2>My Contract</h2>
       <h5>Update the value</h5>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input id="newValue"
                 value = {this.state.value} 
                 onChange={this.handleChange} 
                 type="text"></input>

        </div>
        <button type="submit" className="btn btn-primary">Set Value</button>
      </form>
      <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
