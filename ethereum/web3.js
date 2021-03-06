import Web3 from "web3";

// const web3 = new Web3(window.web3.currentProvider);

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // user is on the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/585edaa5e87c48d4ad3ae6032e3b10e6"
  );
  web3 = new Web3(provider);
}

export default web3;
