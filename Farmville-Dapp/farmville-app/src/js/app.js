App = {
  web3: null,
  awsConfig: {
        "region": "us-east-2",
        "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
        "accessKeyId": "AKIA6KYCE5RAV2M3VY4C", "secretAccessKey": "FeTEST8+PUFdaKP+j/FNsXth9hu4XMJfXHqFKe6w"
    },
  contracts: {},
  address:'0x7BcAC1626291b6aaAf3bCCbCC7ac9AE17Dc81230',
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
    var option={from:App.handler} 
    App.contracts.Farmville.methods.viewPhase()
    .call()
    .then((r)=>{
      jQuery('#state_value').text(r)
      })
    return App.bindEvents();
  },  

  bindEvents: function() {
    $(document).on('click', '#registervendor', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      name = jQuery('#vendorname').val()
      address = jQuery('#vendoraddr').val()
      l_comp = JSON.parse($('input[name="h_comp"]:checked').val());
      s_comp = JSON.parse($('input[name="l_comp"]:checked').val());
      // console.log(l_comp, s_comp);
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
      App.handleupdateHealthComplaince(vaddr_sf);
    });

    $(document).on('click', '#additem', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      item_name = jQuery('#iname').val();
      price = parseInt(jQuery('#iprice').val());
      stock = parseInt(jQuery('#stock').val());
      App.handleaddItem(item_name, price, stock);
    });

    $(document).on('click', '#viewhcomp', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      cust_add = App.web3.givenProvider.selectedAddress;
      console.log('hcomp_cust_add',cust_add);
      App.handleviewVendorSafety(cust_add);
    });

    $(document).on('click', '#viewloccomp', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      cust_add =App.web3.givenProvider.selectedAddress;
      console.log('loc_comp_cust_add',cust_add);
      App.handleviewVendorLocation(cust_add);
    });

    $(document).on('click', '#viewRatings', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      cust_add = App.web3.givenProvider.selectedAddress;
      console.log('hcomp_cust_add',cust_add);
      App.handleviewVendorRating(cust_add);
    });


    $(document).on('click', '#buyproduce', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handleregisterCustomer(jQuery('#custid').val());
    });

    $(document).on('click', '#registercust', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       split_text = jQuery('#vaddr-iname-nums').val().split(',');
       vendor_address = split_text[0];
       it_name = parseInt(split_text[1]);
       nums = parseInt(split_text[2]);
       App.handlebuyProduce(vendor_address, it_name, nums);

    });

    $(document).on('click', '#viewloccomp-cust', function(){
      App.populateAddress().then(r => App.handler = r[0]);
      vendor_name = jQuery('#vname-custView').val();
      App.handleviewVendorLocation(vendor_name);
    });      
  },

  populateAddress : async function(){
    // App.handler=App.web3.givenProvider.selectedAddress;
      return await ethereum.request({method : 'eth_requestAccounts'});
  },  

  handleregisterVendor:function(name, address, l_comp, s_comp){
      var option={from:App.handler} 
      console.log(name, address, l_comp, s_comp);
      App.contracts.Farmville.methods.registerVendor(address, l_comp, s_comp)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Vendor "+ name + "is added");
      }
    })
  },

  handleaddItem:function(item_name, price, stock){
      var option={from:App.handler} 
      // console.log(item_name, price, stock);
      App.contracts.Farmville.methods.addItem(item_name, price, stock)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Item" + item_name + "sucessfully added");
        }
      })

      // localStorage.removeItem('vendor_info.json');
     
      // "working" code start
      vendor_address = App.web3.givenProvider.selectedAddress;

      var vendor_dict = {'item_name':item_name,'price':price, 'stock':stock};

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
          console.log('output',output);
        

      if(output == 'null' ){
        var params = {
          TableName: "Vendor_Info",
          Item:  {'address':vendor_address, 'items':[vendor_dict]}
          };
       console.log(params)
       docClient.put(params, function (err, data) {
        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
      }
      );
      }
      else{
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
      })

      // "working" code end 
    },

      // console.log(localStorage.getItem('vendor_info.json'));
      // if (localStorage.getItem('vendor_info.json') === null) {
      //   vendor_data = {};
      //   vendor_data[vendor_address] = [vendor_tuple];
      //   localStorage.setItem('vendor_info.json', JSON.stringify(vendor_data));
      // }
      // else{
      //   vendor_data = JSON.parse(localStorage.getItem('vendor_info.json'));
      //   // console.log('vendor_data',vendor_data);
      //   if( vendor_address in vendor_data){
      //     temp_info = vendor_data[vendor_address];
      //     console.log('temp_info',temp_info);
      //     temp_info.push(vendor_tuple);
      //     vendor_data[vendor_address] = temp_info;
      //   }
      //   else{
      //     vendor_data[vendor_address] = [vendor_tuple];
      //   }

      //   localStorage.setItem('vendor_info.json', JSON.stringify(vendor_data));
      //   }
      
      // console.log(localStorage.getItem('vendor_info.json'));

      
    // },

  handleregisterCustomer:function(cust_name){
      var option={from:App.handler} 
      console.log(item_name, price, stock);
      App.contracts.Farmville.methods.registerCustomer(cust_name)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Customer "+ cust_name + "is added");
      }
    })
  },

  handlebuyProduce:function(vendor_address, it_name, nums){
      var option={from:App.handler} 
      console.log(item_name, price, stock);
      App.contracts.Farmville.methods.buyProduce(vendor_address, it_name, nums)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Successful");
      }
    })
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

  handleupdateHealthComplaince:function(vendor_address){
    var option={from:App.handler} 
    App.contracts.Farmville.methods.updateHealthComplaince(vendor_address,"true")
    .send(option)
    .on('receipt',(receipt)=>{
      if(receipt.status){
        toastr.success("Successfully verified health complaince for vendor.");
      }
    })
  },

  handleupdateLocComp:function(vendor_address){
    var option={from:App.handler} 
    App.contracts.Farmville.methods.updateLocComp(vendor_address,"true")
    .send(option)
    .on('receipt',(receipt)=>{
      if(receipt.status){
        toastr.success("Successfully verified location complaince for vendor.");
      }
    })
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
