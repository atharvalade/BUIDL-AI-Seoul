// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TrueLensPool.sol";

/**
 * @title TrueLensLeaderboard
 * @dev Manages the leaderboard for TrueLens verifiers
 */
contract TrueLensLeaderboard is Ownable {
    TrueLensPool public trueLensPool;
    
    // Store top verifiers
    address[] public topVerifiers;
    mapping(address => uint256) public verifierScore;
    mapping(address => string) public verifierUsername;
    
    // Benefits for each level
    mapping(uint256 => string) public levelBenefits;
    
    // Events
    event VerifierScoreUpdated(address indexed verifier, uint256 newScore);
    event LeaderboardUpdated(address[] topVerifiers);
    event VerifierAdded(address indexed verifier, string username);
    
    constructor(address _trueLensPoolAddress) Ownable(msg.sender) {
        trueLensPool = TrueLensPool(_trueLensPoolAddress);
        
        // Initialize level benefits
        levelBenefits[1] = "Access to verification marketplace";
        levelBenefits[2] = "10% bonus on rewards";
        levelBenefits[3] = "20% bonus on rewards, access to exclusive content";
        levelBenefits[4] = "35% bonus on rewards, priority verification rights";
        levelBenefits[5] = "50% bonus on rewards, ability to swap TRUE for stablecoins";
    }
    
    /**
     * @dev Register a new verifier
     * @param _username Username for the verifier
     */
    function registerVerifier(string memory _username) external {
        require(bytes(verifierUsername[msg.sender]).length == 0, "Already registered");
        
        verifierUsername[msg.sender] = _username;
        verifierScore[msg.sender] = 0;
        
        emit VerifierAdded(msg.sender, _username);
    }
    
    /**
     * @dev Update the score for a verifier (called by owner or authorized contracts)
     * @param _verifier Address of the verifier
     * @param _scoreChange Score change (can be positive or negative)
     */
    function updateVerifierScore(address _verifier, int256 _scoreChange) external onlyOwner {
        require(bytes(verifierUsername[_verifier]).length > 0, "Verifier not registered");
        
        if (_scoreChange >= 0) {
            verifierScore[_verifier] += uint256(_scoreChange);
        } else {
            uint256 absChange = uint256(-_scoreChange);
            if (absChange > verifierScore[_verifier]) {
                verifierScore[_verifier] = 0;
            } else {
                verifierScore[_verifier] -= absChange;
            }
        }
        
        emit VerifierScoreUpdated(_verifier, verifierScore[_verifier]);
        updateTopVerifiers();
    }
    
    /**
     * @dev Update the top verifiers list (limit to top 100)
     */
    function updateTopVerifiers() internal {
        // This is a simplified implementation
        // In a production environment, you would use a more efficient algorithm
        
        // Get all verifiers
        address[] memory verifiers = new address[](100); // Assuming a max of 100 for simplicity
        uint256 verifierCount = 0;
        
        // For simplicity, we're just creating a sample implementation
        // In a real scenario, you would iterate through all registered verifiers
        verifiers[0] = msg.sender;
        verifierCount = 1;
        
        // Sort verifiers by score (bubble sort for simplicity)
        for (uint256 i = 0; i < verifierCount - 1; i++) {
            for (uint256 j = 0; j < verifierCount - i - 1; j++) {
                if (verifierScore[verifiers[j]] < verifierScore[verifiers[j + 1]]) {
                    // Swap
                    address temp = verifiers[j];
                    verifiers[j] = verifiers[j + 1];
                    verifiers[j + 1] = temp;
                }
            }
        }
        
        // Take top 100 (or fewer if there are less verifiers)
        uint256 topCount = verifierCount > 100 ? 100 : verifierCount;
        topVerifiers = new address[](topCount);
        
        for (uint256 i = 0; i < topCount; i++) {
            topVerifiers[i] = verifiers[i];
        }
        
        emit LeaderboardUpdated(topVerifiers);
    }
    
    /**
     * @dev Get benefits for a specific level
     * @param _level Level to query
     * @return Benefits string
     */
    function getLevelBenefits(uint256 _level) external view returns (string memory) {
        require(_level > 0 && _level <= 5, "Invalid level");
        return levelBenefits[_level];
    }
    
    /**
     * @dev Get a user's level
     * @param _user Address of the user
     * @return User's level
     */
    function getUserLevel(address _user) external view returns (uint256) {
        return trueLensPool.userLevels(_user);
    }
    
    /**
     * @dev Set benefits for a specific level
     * @param _level Level to set
     * @param _benefits Benefits description
     */
    function setLevelBenefits(uint256 _level, string memory _benefits) external onlyOwner {
        require(_level > 0 && _level <= 5, "Invalid level");
        levelBenefits[_level] = _benefits;
    }
    
    /**
     * @dev Get top verifiers
     * @return List of top verifier addresses
     */
    function getTopVerifiers() external view returns (address[] memory) {
        return topVerifiers;
    }
    
    /**
     * @dev Get verifier details
     * @param _verifier Address of the verifier
     * @return username, score, and level
     */
    function getVerifierDetails(address _verifier) external view returns (string memory, uint256, uint256) {
        return (
            verifierUsername[_verifier],
            verifierScore[_verifier],
            trueLensPool.userLevels(_verifier)
        );
    }
} 