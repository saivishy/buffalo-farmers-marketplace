//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

interface ERC20MYN {
   function transfer(address receiver, uint numTokens) external payable returns (bool);
}

contract Farmville {
  
    uint vendors_count = 0;

    struct itemInfo {
        uint price;
        uint stock;
        
    }
    struct VendorInfo {  
        bool member;
        uint wal_balance;
        uint rating;
        uint rating_count;
        uint market_loc;
        bool safety_comp;
        bool loc_comp;
        mapping(string => itemInfo) items;
    }

    struct CustomerInfo {                  
        string name;
    }

    address chairperson;
    mapping(address => VendorInfo) vendors;  
    mapping(address => CustomerInfo) customers;  
    
    enum Phase {Init, Regs, Buy}  
    Phase public state = Phase.Init;

    modifier validPhase(Phase reqPhase) 
    { require(state == reqPhase); 
      _; 
    } 

    modifier onlyChair(){
        require(msg.sender == chairperson);
        _;
    }

    modifier locComp(){
        require(vendors[msg.sender].loc_comp);
        _;
    }

    modifier healthComp(){
        require(vendors[msg.sender].safety_comp);
        _;
    }

    modifier isMember(){
        require(vendors[msg.sender].member);
        _;
    }

    modifier checkBalance(uint num){
        require(msg.value>=num, 'Not enough money given to buy');
        _;
    }
    constructor() public {
        chairperson = msg.sender;
        state = Phase.Regs;
    }
    
    function changeState(Phase x) onlyChair public {
        
        require (x > state );
       
        state = x;
     }

    function registerVendor (address vendor, bool l_comp, bool s_comp) onlyChair validPhase(Phase.Regs) public payable {
        if(vendors[vendor].member){revert();}
        vendors_count+=1;
        vendors[vendor].member = true;
        vendors[vendor].wal_balance = 0;
        vendors[vendor].loc_comp = l_comp;
        vendors[vendor].safety_comp = s_comp;
        vendors[vendor].rating = 0;
        vendors[vendor].market_loc = vendors_count;

    }

    function addItem(string memory item_name, uint price, uint stock) locComp healthComp isMember public{
        itemInfo memory temp_item;
        temp_item.price = price;
        temp_item.stock = stock;
        vendors[msg.sender].items[item_name] = temp_item;
    }

    function checkItem(string memory item_name, address vend) view public returns(uint) {
        return vendors[vend].items[item_name].stock;
    }

    function updateLocComp(address vendor, bool l_comp) onlyChair public{
        vendors[vendor].loc_comp = l_comp;
    }

    function updateHealthComplaince(address vendor, bool s_comp) onlyChair public{
        vendors[vendor].safety_comp = s_comp;
    }

    function registerCustomer(string memory cust_name) public payable{
        customers[msg.sender].name = cust_name;
    }
    
    function buyProduce(address payable vendor, string memory item_name , uint nums) validPhase(Phase.Buy) checkBalance(vendors[vendor].items[item_name].price * nums) public payable{
        if((vendors[vendor].safety_comp == false) || (nums>vendors[vendor].items[item_name].stock)) {revert();}
        uint amt;
        vendors[vendor].items[item_name].stock = vendors[vendor].items[item_name].stock - nums;
        amt = vendors[vendor].items[item_name].price * nums;
        
        vendors[vendor].wal_balance+=amt;
        address payable vendor_address = vendor;
        // vendor_address.transfer(amt * (10 ** 18));
        ERC20MYN(vendor).transfer(vendor_address, amt);
    }


    function giveRating(address vendor, uint vendor_rating) public payable{
        vendors[vendor].rating = vendors[vendor].rating + vendor_rating;
        vendors[vendor].rating_count = vendors[vendor].rating_count + 1;
    }

    function viewVendorRating(address vendor) view public returns(uint) {
        if(vendors[vendor].rating_count == 0) {revert('Not enough ratings');}
        return uint(vendors[vendor].rating/vendors[vendor].rating_count);
    }

    function viewVendorLocation(address vendor) view public returns(bool) {
        return vendors[vendor].loc_comp;
    }

    function viewVendorSafety(address vendor) view public returns(bool) {
        return vendors[vendor].safety_comp;
    }

    function viewPhase() view public returns(Phase) {
        return state;
    }

    function viewVendorMarketLocation(address vendor) view public returns(uint) {
        return vendors[vendor].market_loc;
    }
}
