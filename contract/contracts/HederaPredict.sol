// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HederaPredict
 * @dev Smart contract for managing supply chain predictions and data
 */
contract HederaPredict is Ownable, Pausable, ReentrancyGuard {
    // Structs
    struct SupplyChainMetrics {
        uint256 disruptions;
        uint256 efficiency;
        uint256 cost;
        uint256 leadTime;
        uint256 inventoryLevels;
        uint256 qualityScore;
    }

    struct Prediction {
        uint256 expectedDisruptions;
        uint256 projectedEfficiency;
        uint256 estimatedCosts;
        uint256 riskScore;
        string[] recommendations;
    }

    struct PredictionData {
        bytes32 id;
        address submitter;
        uint256 timestamp;
        SupplyChainMetrics metrics;
        Prediction prediction;
        uint256 confidence;
        bool isConfirmed;
        bool isProcessed;
    }

    // State variables
    mapping(bytes32 => PredictionData) public predictions;
    mapping(address => bytes32[]) public userPredictions;
    mapping(address => bool) public authorizedPredictors;
    
    uint256 public totalPredictions;
    uint256 public minConfidenceThreshold;
    uint256 public predictionFee;

    // Events
    event PredictionSubmitted(
        bytes32 indexed id,
        address indexed submitter,
        uint256 timestamp,
        uint256 confidence
    );

    event PredictionConfirmed(
        bytes32 indexed id,
        uint256 timestamp,
        uint256 riskScore
    );

    event PredictorAuthorized(address indexed predictor, bool status);
    event ConfidenceThresholdUpdated(uint256 newThreshold);
    event PredictionFeeUpdated(uint256 newFee);

    // Modifiers
    modifier onlyAuthorizedPredictor() {
        require(authorizedPredictors[msg.sender], "Not authorized to make predictions");
        _;
    }

    modifier validPrediction(bytes32 _id) {
        require(predictions[_id].submitter != address(0), "Prediction does not exist");
        _;
    }

    // Constructor
    constructor(uint256 _minConfidenceThreshold, uint256 _predictionFee) Ownable(msg.sender) Pausable() ReentrancyGuard() {
        minConfidenceThreshold = _minConfidenceThreshold;
        predictionFee = _predictionFee;
        authorizedPredictors[msg.sender] = true;
    }

    // External functions
    function submitPrediction(
        SupplyChainMetrics memory _metrics,
        Prediction memory _prediction,
        uint256 _confidence
    ) external payable nonReentrant whenNotPaused onlyAuthorizedPredictor returns (bytes32) {
        require(msg.value >= predictionFee, "Insufficient prediction fee");
        require(_confidence >= minConfidenceThreshold, "Confidence below threshold");

        bytes32 predictionId = generatePredictionId(_metrics, msg.sender);
        
        PredictionData memory newPrediction = PredictionData({
            id: predictionId,
            submitter: msg.sender,
            timestamp: block.timestamp,
            metrics: _metrics,
            prediction: _prediction,
            confidence: _confidence,
            isConfirmed: false,
            isProcessed: false
        });

        predictions[predictionId] = newPrediction;
        userPredictions[msg.sender].push(predictionId);
        totalPredictions++;

        emit PredictionSubmitted(predictionId, msg.sender, block.timestamp, _confidence);
        
        return predictionId;
    }

    function confirmPrediction(bytes32 _id) external 
        onlyAuthorizedPredictor 
        validPrediction(_id) 
        whenNotPaused 
    {
        PredictionData storage prediction = predictions[_id];
        require(!prediction.isConfirmed, "Prediction already confirmed");
        
        prediction.isConfirmed = true;
        prediction.isProcessed = true;

        emit PredictionConfirmed(
            _id,
            block.timestamp,
            prediction.prediction.riskScore
        );
    }

    // View functions
    function getPrediction(bytes32 _id) external view 
        validPrediction(_id) 
        returns (PredictionData memory) 
    {
        return predictions[_id];
    }

    function getUserPredictions(address _user) external view returns (bytes32[] memory) {
        return userPredictions[_user];
    }

    function getPredictionCount(address _user) external view returns (uint256) {
        return userPredictions[_user].length;
    }

    // Admin functions
    function setConfidenceThreshold(uint256 _newThreshold) external onlyOwner {
        minConfidenceThreshold = _newThreshold;
        emit ConfidenceThresholdUpdated(_newThreshold);
    }

    function setPredictionFee(uint256 _newFee) external onlyOwner {
        predictionFee = _newFee;
        emit PredictionFeeUpdated(_newFee);
    }

    function authorizePredictor(address _predictor, bool _status) external onlyOwner {
        authorizedPredictors[_predictor] = _status;
        emit PredictorAuthorized(_predictor, _status);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal functions
    function generatePredictionId(
        SupplyChainMetrics memory _metrics,
        address _submitter
    ) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _submitter,
                block.timestamp,
                _metrics.disruptions,
                _metrics.efficiency,
                _metrics.cost,
                _metrics.leadTime,
                _metrics.inventoryLevels,
                _metrics.qualityScore
            )
        );
    }
}