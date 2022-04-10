//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <=0.6.0;
contract Farmville {
  
    uint vendors_count = 0;

    struct VendorInfo {  
        bool member;
        uint wal_balance;
        uint rating;
        uint market_loc;
        bool safety_comp;
        bool loc_comp;
        mapping(string => uint) items;
    }

    struct CustomerInfo {                  
        string name;
    }

    address chairperson;
    mapping(address => VendorInfo) vendors;  
    mapping(address => CustomerInfo) customers;  
    
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
    }
    
    function registerVendor (address vendor, bool l_comp, bool s_comp) onlyChair public payable {
        if(vendors[vendor].member){revert();}
        vendors_count+=1;
        vendors[msg.sender].member = true;
        vendors[msg.sender].wal_balance = 0;
        vendors[msg.sender].loc_comp = l_comp;
        vendors[msg.sender].safety_comp = s_comp;
        vendors[msg.sender].rating = 0;
        vendors[msg.sender].market_loc = vendors_count;

    }

    function addItem(string memory item_name, uint stock) locComp healthComp isMember public{
        vendors[msg.sender].items[item_name] = stock;
    }

    function updateLocComp(address vendor, bool l_comp) onlyChair public{
        vendors[vendor].loc_comp = l_comp;
    }

    function updateHealthComplaince(address vendor, bool s_comp) onlyChair public{
        vendors[vendor].safety_comp = s_comp;
    }
}