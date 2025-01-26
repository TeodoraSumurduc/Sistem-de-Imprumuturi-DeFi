
App = {
  web3Provider: null,
  account: null,

  load: async () => {
      await App.loadWeb3();
      await App.loadAccount();
  },

  loadWeb3: async () => {
      if (window.ethereum) {
          // Modern dapp browsers
          App.web3Provider = window.ethereum;
          window.web3 = new Web3(window.ethereum);
          try {
              // Solicită utilizatorului să conecteze wallet-ul
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log("Ethereum wallet connected!");
          } catch (error) {
              console.error("User denied account access:", error);
          }
      } else if (window.web3) {
          // Legacy dapp browsers
          App.web3Provider = window.web3.currentProvider;
          window.web3 = new Web3(window.web3.currentProvider);
          console.log("Using legacy dapp browser's provider.");
      } else {
          // Non-dapp browsers
          window.alert("Non-Ethereum browser detected. Consider trying MetaMask!");
      }
  },

  loadAccount: async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
          App.account = accounts[0];
          console.log("Connected account:", App.account);
      } else {
          console.error("No accounts found. Please connect a wallet.");
      }
  }
};

$(document).ready(() => {
  App.load();
});
