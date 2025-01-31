App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
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
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
    },
    
    loadContract: async () => {
      ///am creat un js version al smart contractului
        const defiLoan = await $.getJSON('DeFiLoan.json')
        App.contracts.DeFiLoan = TruffleContract(defiLoan)
        App.contracts.DeFiLoan.setProvider(App.web3Provider)
        //console.log(defiLoan)

        //alimentam smart contractul cu valori din blockchain
        App.defiLoan = await App.contracts.DeFiLoan.deployed()
    },
  
    render: async () => {
      if (App.loading) {
        return
      }
  
      App.setLoading(true)

      $('#account').html(App.account)
  
      await App.renderLoans()

      App.setLoading(false)
    },
  
    renderLoans: async () => {
        try {
            const owner = await App.defiLoan.owner();
            console.log(owner);
            const loansOwner = await App.defiLoan.getLoans(owner);
            console.log(loansOwner);

            const $loanTemplate  = $('.loanTemplate')

            for(var i = 0; i < loansOwner.length; i++) {
              const loan = loansOwner[i];
              const amount = loan[0];
              const interest = loan[1];
              const dueDate = loan[2];
              console.log(amount + " " + interest + " " + dueDate);

              //html
              const $newLoanTemplate = $loanTemplate.clone()
              $newLoanTemplate.find('.content').html("Subiect")
              $newLoanTemplate.find('input')
                              .prop('amount', amount)
                              .prop('interest', interest)
                              .on('click', App.toggleCompleted)
            }
            
        } catch (error) {
            console.error('Eroare:', error);
        }
    
      },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })