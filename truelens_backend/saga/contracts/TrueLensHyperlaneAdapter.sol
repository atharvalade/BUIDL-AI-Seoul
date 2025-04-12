// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import "./TRUEToken.sol";
import "./TrueLensVerification.sol";

/**
 * @title TrueLensHyperlaneAdapter
 * @dev Adapter for sending messages from SAGA to Rootstock via Hyperlane
 */
contract TrueLensHyperlaneAdapter is Ownable {
    // Hyperlane integration
    IMailbox public mailbox;
    IInterchainSecurityModule public ism;
    uint32 public rootstockDomainId;
    bytes32 public rootstockPoolContract;
    
    // TrueLens contracts
    TRUEToken public trueToken;
    TrueLensVerification public verification;
    
    // Events
    event MessageSent(bytes32 messageId, address indexed user, uint256 amount, bool isReward);
    event MessageReceived(uint32 origin, bytes32 sender, bytes message);
    
    constructor(
        address _trueTokenAddress,
        address _verificationAddress,
        address _mailboxAddress,
        address _ismAddress,
        uint32 _rootstockDomainId,
        address _rootstockPoolContract
    ) Ownable(msg.sender) {
        trueToken = TRUEToken(_trueTokenAddress);
        verification = TrueLensVerification(_verificationAddress);
        mailbox = IMailbox(_mailboxAddress);
        ism = IInterchainSecurityModule(_ismAddress);
        rootstockDomainId = _rootstockDomainId;
        rootstockPoolContract = bytes32(uint256(uint160(_rootstockPoolContract)));
    }
    
    /**
     * @dev Send reward distribution message to Rootstock
     * @param _user User to receive rewards
     * @param _amount Amount of rewards
     */
    function sendRewardMessage(address _user, uint256 _amount) external onlyOwner {
        bytes memory message = abi.encode(_user, _amount, true);
        
        uint256 fee = mailbox.quoteDispatch(
            rootstockDomainId,
            rootstockPoolContract,
            message
        );
        
        bytes32 messageId = mailbox.dispatch{value: fee}(
            rootstockDomainId,
            rootstockPoolContract,
            message
        );
        
        emit MessageSent(messageId, _user, _amount, true);
    }
    
    /**
     * @dev Send experience update message to Rootstock
     * @param _user User to update experience for
     * @param _expAmount Amount of experience
     */
    function sendExpMessage(address _user, uint256 _expAmount) external onlyOwner {
        bytes memory message = abi.encode(_user, _expAmount, false);
        
        uint256 fee = mailbox.quoteDispatch(
            rootstockDomainId,
            rootstockPoolContract,
            message
        );
        
        bytes32 messageId = mailbox.dispatch{value: fee}(
            rootstockDomainId,
            rootstockPoolContract,
            message
        );
        
        emit MessageSent(messageId, _user, _expAmount, false);
    }
    
    /**
     * @dev Handle messages from Rootstock
     * @param _origin Origin domain ID
     * @param _sender Sender address as bytes32
     * @param _message Message payload
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external {
        require(msg.sender == address(mailbox), "Caller must be mailbox");
        require(_origin == rootstockDomainId, "Origin must be Rootstock");
        require(_sender == rootstockPoolContract, "Sender must be pool contract");
        
        // Process message from Rootstock
        // This could include updates to verification status or other synchronization
        
        emit MessageReceived(_origin, _sender, _message);
    }
    
    /**
     * @dev Update the Rootstock pool contract address
     * @param _rootstockPoolContract New address
     */
    function setRootstockPoolContract(address _rootstockPoolContract) external onlyOwner {
        rootstockPoolContract = bytes32(uint256(uint160(_rootstockPoolContract)));
    }
    
    /**
     * @dev Allow contract to receive ETH for gas fees
     */
    receive() external payable {}
} 