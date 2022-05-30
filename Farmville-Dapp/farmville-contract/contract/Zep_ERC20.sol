pragma solidity ^0.8.13;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC20/ERC20.sol" ;

contract FarmToken is ERC20{
    constructor() ERC20("FarmToken", "BuFA"){
        _mint(msg.sender,100000*10**18);
    }
}