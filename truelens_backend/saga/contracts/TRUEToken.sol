// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TRUEToken
 * @dev TrueLens token contract for verifying news and distributing rewards
 */
contract TRUEToken is ERC20, Ownable {
    // The administrator who can mint tokens
    address public administrator;
    
    // Event for token minting
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor that gives the msg.sender all existing tokens
     */
    constructor(address _administrator) ERC20("TrueLens Token", "TRUE") Ownable(msg.sender) {
        administrator = _administrator;
        // Mint 1 million tokens to the administrator initially
        _mint(administrator, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Mint new tokens - only the admin can do this
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == administrator || msg.sender == owner(), "Only administrator or owner can mint");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Change administrator
     * @param _newAdministrator New administrator address
     */
    function setAdministrator(address _newAdministrator) external onlyOwner {
        administrator = _newAdministrator;
    }
} 