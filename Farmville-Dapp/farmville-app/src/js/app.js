App = {
    web3: null,
    awsConfig: {
          "region": "aws_region",
          "endpoint": "aws_endpoint",
          "accessKeyId": "aws_access_key", "secretAccessKey": "aws_secret_key"
      },
    contracts: {},
    address:'Farmville_contract_address',
    erc20_address:'erc20_contract_address',
    network_id:3,
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

      return App.initContract();  
    },

    initContract: function() { 
      App.contracts.Farmville = new App.web3.eth.Contract(App.abi,App.address, {});
      App.contracts.ERC20 = new App.web3.eth.Contract(App.abi_erc20,App.erc20_address, {});
      
      App.contracts.Farmville.methods.viewPhase()
      .call()
      .then((r)=>{
        jQuery('#state_value').text(r)
        });

      App.contracts.Farmville.methods.viewTokenBalance(App.web3.givenProvider.selectedAddress)
      .call()
      .then((r)=>{
        jQuery('#token_balance').text(Math.round(r/(10**18))+' BuFA')
        });
      
      App.contracts.Farmville.methods.viewAllowance(App.web3.givenProvider.selectedAddress, App.address)
      .call()
      .then((r)=>{
        jQuery('#allowance-balance').text(Math.round(r/(10**18))+' BuFA')
        });
      
      return App.bindEvents();
    },  
  
    bindEvents: function() {

      $(document).on('click', '#set-ercaddr', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        App.handlesetAddress();
      });


      $(document).on('click', '#registervendor', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        name = jQuery('#vendorname').val()
        address = jQuery('#vendoraddr').val()
        l_comp = JSON.parse($('input[name="h_comp"]:checked').val());
        s_comp = JSON.parse($('input[name="l_comp"]:checked').val());
        App.handleregisterVendor(name, address, l_comp, s_comp);
      });

      $(document).on('click', '#verify-loccomp', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vaddr_lc = jQuery('#vaddr-comp-check').val()
        App.handleupdateLocComp(vaddr_lc);
      });

      $(document).on('click', '#verify-hcomp', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vaddr_sf = jQuery('#vaddr-comp-check').val()
        App.handleupdateHealthComplaince(vaddr_sf);;
      });

      $(document).on('click', '#additem', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        item_name = jQuery('#iname').val();
        price = parseInt(jQuery('#iprice').val());
        stock = parseInt(jQuery('#stock').val());
        App.handleaddItem(item_name, price, stock);
      });

      $(document).on('click', '#viewRatings', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = App.web3.givenProvider.selectedAddress;
        App.handleviewVendorRating(vendor_address);
      });

      $(document).on('click', '#viewhcomp', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        cust_add = App.web3.givenProvider.selectedAddress;
        App.handleviewVendorSafety(cust_add);
      });

      $(document).on('click', '#viewloccomp', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        cust_add = App.web3.givenProvider.selectedAddress;
        App.handleviewVendorLocation(cust_add);
      });

      $(document).on('click', '#viewRatings-cust', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = jQuery('#vname-custView').val();
        App.handleviewVendorRating(vendor_address);
      });

      $(document).on('click', '#giverating', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = jQuery('#vname-custRating').val();
        rating = jQuery('#rating').val();
        App.handlegiveRating(vendor_address, rating);
      });


      $(document).on('click', '#registercust', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         cust_name = jQuery('#cname').val();
         App.handleregisterCustomer(cust_name);

      });

      $(document).on('click', '#buyproduce', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         vendor_address = jQuery('#vname-custBuy').val();
         item_name = jQuery('#iname-custBuy').val();
         stock = parseInt(jQuery('#stock-custBuy').val());
         App.handlebuyProduce(vendor_address, item_name, stock);
      });

      $(document).on('click', '#viewloccomp-cust', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = jQuery('#vname-custView').val();
        App.handleviewVendorLocation(vendor_address);
      });

      $(document).on('click', '#viewhcomp-cust', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = jQuery('#vname-custView').val();
        App.handleviewVendorSafety(vendor_address);
      });

      $(document).on('click', '#check-stock', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        split_text = jQuery('#it_name-address').val().split(',');
        item_name = split_text[0];
        vendor_address = split_text[1];
        App.handlecheckItem(item_name, vendor_address);
      });

      $(document).on('click', '#vendor-market-loc', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        vendor_address = jQuery('#vname-custBuy').val();
        App.handleviewVendorMarketLocation(vendor_address);
      });

      $(document).on('click', '#vendor-produce', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        App.handleviewVendorProduce();
      });

      $(document).on('click', '#changestate', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        phase = parseInt($('input[name="phase"]:checked').val());
        App.handlechangeState(phase);
      });

      $(document).on('click', '#exchange_tokens', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        num_tokens = jQuery('#ether-token').val();
        App.handlegetTokens(num_tokens);
      });

      $(document).on('click', '#allowance', function(){
        App.populateAddress().then(r => App.handler = r[0]);
        num_tokens = jQuery('#token-allow').val();
        method_allowance =document.querySelector('input[name="approve/inc/dec_allowance"]:checked').value;
        App.handleapprove(num_tokens, method_allowance);
      });

      
    },

    populateAddress : async function(){
        return await ethereum.request({method : 'eth_requestAccounts'});
    },  
 
    handleregisterVendor:function(name, address, l_comp, s_comp){
        var option={from:App.handler} 
        App.contracts.Farmville.methods.registerVendor(address, l_comp, s_comp)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Vendor "+ name + " is added");
        }})


      },

    handleaddItem:function(item_name, price, stock){
        var option={from:App.handler} 
        App.contracts.Farmville.methods.addItem(item_name, price, stock)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Item " + item_name + " sucessfully added");
        }})

        
        vendor_address = App.web3.givenProvider.selectedAddress;
        
        var vendor_dict = {'stock':stock, 'item_name':item_name,'price':price};        

        AWS.config.update(App.awsConfig);

        let docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
              TableName: "Vendor_Info",
              Key: {
                  "address": vendor_address
              }
          };
        docClient.get(params, function (err, data) {
            output = JSON.stringify(data, null, 2);
          

        if(output == '{}' )
          {

          var params = {
            TableName: "Vendor_Info",
            Item:  {'address':vendor_address, 'items':[vendor_dict]}
          };
          docClient.put(params, function (err, data) {
            if (err) {
                console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
            } else {
                console.log("users::save::success" );                      
            }
          });

          }
        else
          {
            var flag = true;

            for (const [key, value] of Object.entries(data[Object.keys(data)[0]]['items'])) {
               if((JSON.stringify(value) == JSON.stringify(vendor_dict))){
                flag = false;
                break;
               }
              }
          if(flag){

              var params = {
              TableName: "Vendor_Info",
              Key: { "address": vendor_address },
              UpdateExpression: "SET #attrName = list_append(#attrName, :attrValue)",
              ExpressionAttributeNames : {
                "#attrName" : "items"
              },
              ExpressionAttributeValues : {
                ":attrValue" : [vendor_dict]
              },
              ReturnValues: "UPDATED_NEW"

              };
              docClient.update(params, function (err, data) {});

            }
            }

          })
      
        },


    handleregisterCustomer:function(cust_name){
        var option={from:App.handler} 
        App.contracts.Farmville.methods.registerCustomer(cust_name)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Customer "+ cust_name + " is registered");
        }})
      },


    handlebuyProduce: function(vendor_address, item_name, nums){
        var option={from:App.web3.givenProvider.selectedAddress, to:vendor_address} 
        App.contracts.Farmville.methods.buyProduce(vendor_address, item_name, nums)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Purchase Successful");
        }})
      },

    handleviewVendorLocation:function(vendor_address){
      App.contracts.Farmville.methods.viewVendorLocation(vendor_address)
      .call()
      .then((r)=>{
        jQuery('#lcomp_value').text(r)
        })
      },

    handleviewVendorSafety:function(vendor_address){
      App.contracts.Farmville.methods.viewVendorSafety(vendor_address)
      .call()
      .then((r)=>{
        jQuery('#hcomp_value').text(r)
        })
    },

    handleviewVendorRating:function(vendor_address){
      App.contracts.Farmville.methods.viewVendorRating(vendor_address)
      .call()
      .then((r)=>{
        jQuery('#vendor_rating').text(r)
        })
    },

    handlegiveRating:function(vendor_address, rating){
        var option={from:App.handler} 
        App.contracts.Farmville.methods.giveRating(vendor_address, rating)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Rating Successful");
        }})
      },

    handleupdateHealthComplaince:function(vendor_address){
      var option={from:App.handler} 
      App.contracts.Farmville.methods.updateHealthComplaince(vendor_address,true)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Successfully verified health complaince for vendor.");
        }
      })
    },

    handleupdateLocComp:function(vendor_address){
      var option={from:App.handler} 
      App.contracts.Farmville.methods.updateLocComp(vendor_address,true)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Successfully verified location complaince for vendor.");
        }
      })
    },

    handlecheckItem:function(item_name, vendor_address){
      App.contracts.Farmville.methods.checkItem(item_name, vendor_address)
      .call()
      .then((r)=>{
        jQuery('#stock-value').text(r)
        })
      },

    handleviewVendorMarketLocation:function(vendor_address){
      App.contracts.Farmville.methods.viewVendorMarketLocation(vendor_address)
      .call()
      .then((r)=>{
        jQuery('#market-loc').text('You can find this shop at Booth ' + r +' in the Market.')
        })
      },

    handleviewVendorProduce:function(){
      AWS.config.update(App.awsConfig);
      let docClient = new AWS.DynamoDB.DocumentClient();

      var params = {
        TableName: "Vendor_Info",
        Select: "ALL_ATTRIBUTES"
        };
      docClient.scan(params, function (err, data) {

          var vendor_info = '';

          for (const [key, value] of Object.entries(data[Object.keys(data)[0]])) {
               vendor_info = '<b>'+ value['address'] + '</b>' + '<br>';
               jQuery('#msg').append(vendor_info);
               for (const [item_key, item_value] of Object.entries(value['items']))
               {
                vendor_info =  '<b>' + 'Item: ' + '</b>' + item_value['item_name'] + ' ' + '<b>' + 'Price: ' + '</b>' + item_value['price']+ ' ' + '<b>' + 'Stock: ' + '</b>' + item_value['stock']+'<br>';
                jQuery('#msg').append(vendor_info);
               } 
               }
        
          })
      },

    handlechangeState:function(phase){
    var option={from:App.handler} 
    App.contracts.Farmville.methods.changeState(phase)
    .send(option)
    .on('receipt',(receipt)=>{
      if(receipt.status){
        toastr.success("Successfully changed state to " + phase);
        }
      })
    },

    handlegetTokens:function(num_tokens){
      amount = num_tokens/20;
      var option = {from:App.web3.givenProvider.selectedAddress, to:App.address, value:App.web3.utils.toWei(amount.toString(), 'ether')} 
      var num = BigInt(num_tokens*(10**18))
      App.contracts.Farmville.methods.getTokens(num)
      .send(option)
      .on('receipt',(receipt)=>{  
        if(receipt.status){
          toastr.success("Successfully exchanged ethers to BuFA");
          }
        })

      },

    handleapprove:function(num_tokens, method_allowance){
      var option={from:App.handler};
      var num = BigInt(num_tokens*(10**18))

      if(method_allowance == "approve"){
        App.contracts.ERC20.methods.approve(App.address, num)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Successfully given approval to Marketplace");
            var event_dict = receipt.events.Approval.returnValues;
            delete event_dict[0];
            delete event_dict[1];
            delete event_dict[2];
            toastr.success(JSON.stringify(event_dict));
            }
          })
      }

      else if(method_allowance == "increaseAllowance"){
        App.contracts.ERC20.methods.increaseAllowance(App.address, num)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Successfully given approval to Marketplace");
            var event_dict = receipt.events.Approval.returnValues;
            delete event_dict[0];
            delete event_dict[1];
            delete event_dict[2];
            toastr.success(JSON.stringify(event_dict));
            }
          })
      }

      else if(method_allowance == "decreaseAllowance"){
        App.contracts.ERC20.methods.decreaseAllowance(App.address, num)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            toastr.success("Successfully given approval to Marketplace");
            var event_dict = receipt.events.Approval.returnValues;
            delete event_dict[0];
            delete event_dict[1];
            delete event_dict[2];
            toastr.success(JSON.stringify(event_dict));
            }
          })
      }

      },

    handlesetAddress:function(){
      var option={from:App.handler} 
      App.contracts.Farmville.methods.setAddress(App.erc20_address)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Successfully set ERC20 address in the Marketplace");
          }
        })
    
      },


  abi:[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
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
          "internalType": "address payable",
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
          "internalType": "string",
          "name": "item_name",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "vend",
          "type": "address"
        }
      ],
      "name": "checkItem",
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
          "internalType": "uint256",
          "name": "num_tokens",
          "type": "uint256"
        }
      ],
      "name": "getTokens",
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
          "internalType": "uint256",
          "name": "vendor_rating",
          "type": "uint256"
        }
      ],
      "name": "giveRating",
      "outputs": [],
      "stateMutability": "nonpayable",
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
        },
        {
          "internalType": "bool",
          "name": "s_comp",
          "type": "bool"
        }
      ],
      "name": "registerVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "erc20",
          "type": "address"
        }
      ],
      "name": "setAddress",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "viewAllowance",
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
      "inputs": [],
      "name": "viewPhase",
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
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "viewTokenBalance",
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
      "name": "viewVendorMarketLocation",
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
  ],
  abi_erc20:[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
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
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
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
  
