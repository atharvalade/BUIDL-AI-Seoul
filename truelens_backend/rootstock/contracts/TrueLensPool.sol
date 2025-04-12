// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

/**
 * @title TrueLensPool
 * @dev Manages the pool of TRUE tokens for verification rewards
 */
contract TrueLensPool is Ownable {
    // Hyperlane integration
    IMailbox public mailbox;
    IInterchainSecurityModule public ism;
    uint32 public sagaDomainId;
    
    // Token management
    IERC20 public trueToken;
    
    // User levels management
    mapping(address => uint256) public userLevels;
    mapping(address => uint256) public userExp;
    mapping(uint256 => uint256) public levelExpRequirement;
    mapping(uint256 => uint256) public levelRewardsMultiplier;
    
    // Events
    event UserLevelUp(address indexed user, uint256 newLevel);
    event RewardsDistributed(address indexed user, uint256 amount);
    event PoolUpdated(uint256 newPoolSize);
    event MessageReceived(uint32 origin, bytes32 sender, bytes message);
    
    constructor(
        address _trueTokenAddress,
        address _mailboxAddress,
        address _ismAddress,
        uint32 _sagaDomainId
    ) Ownable(msg.sender) {
        trueToken = IERC20(_trueTokenAddress);
        mailbox = IMailbox(_mailboxAddress);
        ism = IInterchainSecurityModule(_ismAddress);
        sagaDomainId = _sagaDomainId;
        
        // Initialize level requirements (example values)
        levelExpRequirement[1] = 100;
        levelExpRequirement[2] = 300;
        levelExpRequirement[3] = 600;
        levelExpRequirement[4] = 1000;
        levelExpRequirement[5] = 1500;
        
        // Initialize level reward multipliers (examples)
        levelRewardsMultiplier[1] = 100; // 1.0x
        levelRewardsMultiplier[2] = 110; // 1.1x
        levelRewardsMultiplier[3] = 120; // 1.2x
        levelRewardsMultiplier[4] = 135; // 1.35x
        levelRewardsMultiplier[5] = 150; // 1.5x
    }
    
    /**
     * @dev Handle messages from the SAGA chainlet
     * @param _origin The domain ID of the origin chain
     * @param _sender The address of the sender on the origin chain
     * @param _message The message payload
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external {
        // Verify that message comes from the mailbox with proper verification
        require(msg.sender == address(mailbox), "Caller must be mailbox");
        require(_origin == sagaDomainId, "Origin must be SAGA chainlet");
        
        // Process the message
        (address user, uint256 amount, bool isReward) = abi.decode(_message, (address, uint256, bool));
        
        if (isReward) {
            // This is a reward distribution
            distributeRewards(user, amount);
        } else {
            // This is an experience update
            updateUserExp(user, amount);
        }
        
        emit MessageReceived(_origin, _sender, _message);
    }
    
    /**
     * @dev Distribute rewards to a user
     * @param _user Address of the user
     * @param _baseAmount Base amount of rewards
     */
    function distributeRewards(address _user, uint256 _baseAmount) internal {
        uint256 userLevel = userLevels[_user];
        if (userLevel == 0) userLevel = 1; // Default to level 1
        
        // Apply level multiplier
        uint256 multiplier = levelRewardsMultiplier[userLevel];
        uint256 adjustedAmount = (_baseAmount * multiplier) / 100;
        
        // Transfer rewards
        trueToken.transfer(_user, adjustedAmount);
        
        // Update experience
        updateUserExp(_user, adjustedAmount / 10); // 10% of rewards as exp
        
        emit RewardsDistributed(_user, adjustedAmount);
    }
    
    /**
     * @dev Update user experience and check for level up
     * @param _user Address of the user
     * @param _expAmount Amount of experience to add
     */
    function updateUserExp(address _user, uint256 _expAmount) internal {
        uint256 currentLevel = userLevels[_user];
        if (currentLevel == 0) {
            userLevels[_user] = 1;
            currentLevel = 1;
        }
        
        userExp[_user] += _expAmount;
        
        // Check for level up
        uint256 nextLevel = currentLevel + 1;
        if (nextLevel <= 5 && userExp[_user] >= levelExpRequirement[nextLevel]) {
            userLevels[_user] = nextLevel;
            emit UserLevelUp(_user, nextLevel);
        }
    }
    
    /**
     * @dev Send message to SAGA chainlet
     * @param _recipient Address of the recipient on the SAGA chainlet
     * @param _message Message payload
     */
    function sendMessageToSaga(address _recipient, bytes memory _message) external onlyOwner {
        uint256 fee = mailbox.quoteDispatch(
            sagaDomainId,
            addressToBytes32(_recipient),
            _message
        );
        
        mailbox.dispatch{value: fee}(
            sagaDomainId,
            addressToBytes32(_recipient),
            _message
        );
    }
    
    /**
     * @dev Convert address to bytes32
     * @param _addr Address to convert
     * @return result Converted bytes32
     */
    function addressToBytes32(address _addr) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(_addr, 32))
        }
    }
    
    /**
     * @dev Set level experience requirement
     * @param _level Level to set
     * @param _expRequired Experience required
     */
    function setLevelExpRequirement(uint256 _level, uint256 _expRequired) external onlyOwner {
        require(_level > 0 && _level <= 5, "Invalid level");
        levelExpRequirement[_level] = _expRequired;
    }
    
    /**
     * @dev Set level rewards multiplier
     * @param _level Level to set
     * @param _multiplier Multiplier value (100 = 1.0x)
     */
    function setLevelRewardsMultiplier(uint256 _level, uint256 _multiplier) external onlyOwner {
        require(_level > 0 && _level <= 5, "Invalid level");
        levelRewardsMultiplier[_level] = _multiplier;
    }
    
    /**
     * @dev Get current pool size
     * @return Pool size in TRUE tokens
     */
    function getPoolSize() external view returns (uint256) {
        return trueToken.balanceOf(address(this));
    }
    
    /**
     * @dev Allow contract to receive ETH for gas fees
     */
    receive() external payable {}
} 