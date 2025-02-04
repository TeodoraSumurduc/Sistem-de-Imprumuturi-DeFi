App = {
  loading: false,
  contracts: {},

  load: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
  },

  loadWeb3: async () => {
      if (window.ethereum) {
          App.web3Provider = window.ethereum;
          window.web3 = new Web3(window.ethereum);
          try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log("Ethereum wallet connected!");
          } catch (error) {
              console.error("User denied account access:", error);
              alert("Trebuie să permiți accesul la MetaMask pentru a folosi această aplicație.");
          }
      } else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
          window.web3 = new Web3(window.web3.currentProvider);
          console.log("Using legacy dapp browser's provider.");
      } else {
          alert("Non-Ethereum browser detected. Instalează MetaMask!");
      }
  },

  loadAccount: async () => {
      try {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length === 0) {
              alert("Nu s-au găsit conturi MetaMask. Asigură-te că ești conectat.");
              return;
          }
          App.account = accounts[0];
          console.log("Cont activ:", App.account);
      } catch (error) {
          console.error("Eroare la încărcarea contului:", error);
      }
  },

  loadContract: async () => {
      try {
          const defiLoan = await $.getJSON('DeFiLoan.json');
          App.contracts.DeFiLoan = TruffleContract(defiLoan);
          App.contracts.DeFiLoan.setProvider(App.web3Provider);

          App.defiLoan = await App.contracts.DeFiLoan.deployed();
          console.log("Contract încărcat:", App.defiLoan);
      } catch (error) {
          console.error("Eroare la încărcarea contractului:", error);
      }
  },

  render: async () => {
      if (App.loading) return;
      App.setLoading(true);

      $('#account').html(App.account);

      await App.renderLoans();

      App.setLoading(false);
  },

  renderLoans: async () => {
      try {
          const owner = await App.defiLoan.owner();
          console.log("Owner contract:", owner);
          
          const loansOwner = await App.defiLoan.getActiveLoans(owner);
          console.log("Împrumuturi active:", loansOwner);

          const $loanTemplate = $('.loanTemplate');

          $('#loanList').empty();
          $('#repaidLoanList').empty();

          loansOwner.forEach((loan) => {
              const amount = loan[0];
              const interest = loan[1];
              const dueDate = loan[2];
              const isRepaid = loan[4];

              console.log(`Împrumut: ${amount} ETH, Dobândă: ${interest}, Scadență: ${new Date(dueDate * 1000).toLocaleString()}, Rambursat: ${isRepaid}`);

              const $newLoanTemplate = $loanTemplate.clone();
              $newLoanTemplate.find('.content').html(`Sumă: ${amount}, Dobândă: ${interest}, Scadență: ${new Date(dueDate * 1000).toLocaleString()}`);
              $newLoanTemplate.find('input')
                  .prop('amount', amount)
                  .prop('interest', interest);

              if (isRepaid) {
                  $('#repaidLoanList').append($newLoanTemplate);
              } else {
                  $('#loanList').append($newLoanTemplate);
              }

              $newLoanTemplate.show();
          });

      } catch (error) {
          console.error('Eroare la randarea împrumuturilor:', error);
      }
  },

  createLoans: async () => {
      //try {
        App.setLoading(true);

        const content = $('#newLoan').val();
        if (!content || isNaN(content)) {
            alert("Introdu o sumă validă pentru împrumut.");
            App.setLoading(false);
            return;
        }

        //const amount = web3.utils.toWei(content, 'ether'); // Convertim în Wei
        const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // Scadență peste 30 zile
        
        console.log("Creating loan:", content, dueDate);

        const accounts = await web3.eth.getAccounts();
        await App.defiLoan.createLoan(content, dueDate, { from: accounts[0] });

        alert("Împrumut creat cu succes!");
        window.location.reload();
      //} catch (error) {
      //    console.error("Eroare la crearea împrumutului:", error);
      //}
  },

  setLoading: (boolean) => {
      App.loading = boolean;
      const loader = $('#loader');
      const content = $('#content');
      if (boolean) {
          loader.show();
          content.hide();
      } else {
          loader.hide();
          content.show();
      }
  }
};

$(() => {
  $(window).on("load", () => {
      App.load();
  });
});
