App = {
    web3: null,
    contracts: {},
    address:'0x207EAe856D27B0B2bf802d3455286307FeceA8EA',
    network_id:3, // 5777 for local
    handler:null,
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {         
      if (typeof web3 !== 'undefined') {
        App.web3 = new Web3(Web3.givenProvider);
      } else {
        App.web3 = new Web3(App.url);
      }
      ethereum.enable();  

      $.getJSON('flagIndex.json',(id)=>{     
        $.getJSON('flags.json',(d)=>{
          var index = id;
          for(var i in d[index]){
            $('#flagpic').html("<img src='http://www.geognos.com/api/en/countries/flag/"+i.toUpperCase()+".png'/>");
            $('#country-name').html(d[index][i]) 
          }
          
        })
      })
         
      return App.initContract();  
    },

    initContract: function() { 
      App.contracts.Farmville = new App.web3.eth.Contract(App.abi,App.address, {});
      // console.log(random)
      $.getJSON('flags.json',(d)=>{
        var index = Math.floor((Math.random() * 243) + 1);
        
        for(var i in d[index]){
          $('#flag').addClass('flag-'+i)
          $('#country-name').html(d[index][i])
        }
        
      })     
      return App.bindEvents();
    },  
  
    bindEvents: function() {  
  $(document).on('click', '#initilaizeCounter', function(){
     App.populateAddress().then(r => App.handler = r[0]);
     App.handleregisterVendor(jQuery('#Initialize').val());
  });



},

populateAddress : async function(){
  // App.handler=App.web3.givenProvider.selectedAddress;
    return await ethereum.request({method : 'eth_requestAccounts'});
},  
 
 handleregisterVendor:function(incrementValue){
      if (incrementValue===''){
        alert("Please enter a valid incrementing value.")
        return false
      }
      var option={from:App.handler} 
      App.contracts.Farmville.methods.registerVendor(incrementValue, true, false)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Counter is incremented by " + incrementValue);
      }})
    },

  abi:[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "item_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stock",
        "type": "uint256"
      }
    ],
    "name": "addItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "item_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "nums",
        "type": "uint256"
      }
    ],
    "name": "buyProduce",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum Farmville.Phase",
        "name": "x",
        "type": "uint8"
      }
    ],
    "name": "changeState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "vendor_rating",
        "type": "uint256"
      }
    ],
    "name": "giveRating",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "cust_name",
        "type": "string"
      }
    ],
    "name": "registerCustomer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "l_comp",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "s_comp",
        "type": "bool"
      }
    ],
    "name": "registerVendor",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "s_comp",
        "type": "bool"
      }
    ],
    "name": "updateHealthComplaince",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "l_comp",
        "type": "bool"
      }
    ],
    "name": "updateLocComp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "internalType": "enum Farmville.Phase",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      }
    ],
    "name": "viewVendorLocation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      }
    ],
    "name": "viewVendorRating",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vendor",
        "type": "address"
      }
    ],
    "name": "viewVendorSafety",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

  }
  
  $(function() {
    $(window).load(function() {
      App.init();
      toastr.options = {
        // toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        // }
      };
    });
  });
  
