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
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderLoans()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderLoans: async () => {
        const owner = await App.defiLoan.owner()
        const numberLoans = await App.defiLoan.loans(owner,0);
        console.log(numberLoans)
        const $taskTemplate = $('.taskTemplate')
    
        // for(var i = 1; i <= numberLoans; i++){
        //   const loan = await App.defiLoan.loan[i];
        //   const amount = loan[0].toNumber()
        //   const interest = loan[1].toNumber()
        //   const dueDate = loan[2].toNumber()
        //   const borrower = loan[3]
        //   const isRepaid = loan[4]
        // }
    
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