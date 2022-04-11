//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <=0.6.0;
contract Farmville {
  
    uint vendors_count = 0;

    struct itemInfo {
        // string name;
        uint price;
        uint stock;
        
    }
    struct VendorInfo {  
        bool member;
        uint wal_balance;
        uint rating;
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
        vendors[msg.sender].member = true;
        vendors[msg.sender].wal_balance = 0;
        vendors[msg.sender].loc_comp = l_comp;
        vendors[msg.sender].safety_comp = s_comp;
        vendors[msg.sender].rating = 0;
        vendors[msg.sender].market_loc = vendors_count;

    }

    function addItem(string memory item_name, uint price, uint stock) locComp healthComp isMember public{
        itemInfo memory temp_item;
        // temp_item.name = item_name;
        temp_item.price = price;
        temp_item.stock = stock;
        vendors[msg.sender].items[item_name] = temp_item;
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
    
    function buyProduce(address vendor, string memory item_name , uint nums) validPhase(Phase.Buy) public payable{
        if((vendors[vendor].safety_comp == false) || (nums>vendors[vendor].items[item_name].stock)) {revert();}
        uint amt;
        amt = vendors[vendor].items[item_name].price * nums;
        
        vendors[vendor].wal_balance+=amt;

        msg.sender.transfer(amt);
    }

    function viewRating(address vendor) view public returns(uint) {
        return vendors[vendor].rating;
    }

    function giveRating(address vendor, uint vendor_rating) public payable{
        vendors[vendor].rating = vendor_rating;
    }

    function viewVendor(address vendor) view public returns(string memory) {
        string memory output="";
        output = string(abi.encodePacked("[", vendors[vendor].market_loc, ",", vendors[vendor].rating, ",", vendors[vendor].safety_comp, ",", vendors[vendor].loc_comp, "]"));
        return output;
    }
}
