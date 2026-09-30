// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FoodBridgeDonation
 * @notice Decentralized Surplus Food Allocation Smart Contract for FoodBridge Platform
 * @dev Compatible with Ethereum & Polygon (Amoy Testnet)
 */
contract FoodBridgeDonation {
    address public owner;

    enum DonationStatus {
        Created,
        Matched,
        Accepted,
        PickupScheduled,
        InTransit,
        Delivered,
        Completed,
        Cancelled
    }

    struct Donation {
        uint256 id;
        address donorAddress;
        string donorName;
        string foodName;
        string category;
        uint256 quantity;
        string unit;
        string ipfsHash;
        uint256 expiryTimestamp;
        address matchedNgoAddress;
        string ngoName;
        DonationStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    uint256 private donationCounter;
    mapping(uint256 => Donation) public donations;
    mapping(address => bool) public verifiedDonors;
    mapping(address => bool) public verifiedNgos;

    // Events
    event DonationCreated(
        uint256 indexed donationId,
        address indexed donorAddress,
        string foodName,
        uint256 quantity,
        string ipfsHash
    );

    event DonationMatched(
        uint256 indexed donationId,
        address indexed ngoAddress,
        uint8 compatibilityScore
    );

    event DonationAccepted(
        uint256 indexed donationId,
        address indexed ngoAddress,
        uint256 timestamp
    );

    event PickupConfirmed(
        uint256 indexed donationId,
        address indexed logisticsPartner,
        uint256 pickupTimestamp
    );

    event DeliveryConfirmed(
        uint256 indexed donationId,
        address indexed recipientNgo,
        uint256 deliveryTimestamp
    );

    event DonationCompleted(
        uint256 indexed donationId,
        uint256 timestamp,
        string verificationHash
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only FoodBridge Admin can execute");
        _;
    }

    modifier onlyVerifiedDonor() {
        require(verifiedDonors[msg.sender], "Caller is not a verified donor");
        _;
    }

    modifier onlyVerifiedNgo() {
        require(verifiedNgos[msg.sender], "Caller is not a verified NGO");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function verifyDonor(address _donor) external onlyOwner {
        verifiedDonors[_donor] = true;
    }

    function verifyNgo(address _ngo) external onlyOwner {
        verifiedNgos[_ngo] = true;
    }

    function createDonation(
        string memory _donorName,
        string memory _foodName,
        string memory _category,
        uint256 _quantity,
        string memory _unit,
        string memory _ipfsHash,
        uint256 _expiryTimestamp
    ) external returns (uint256) {
        donationCounter++;
        uint256 newId = donationCounter;

        donations[newId] = Donation({
            id: newId,
            donorAddress: msg.sender,
            donorName: _donorName,
            foodName: _foodName,
            category: _category,
            quantity: _quantity,
            unit: _unit,
            ipfsHash: _ipfsHash,
            expiryTimestamp: _expiryTimestamp,
            matchedNgoAddress: address(0),
            ngoName: "",
            status: DonationStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit DonationCreated(newId, msg.sender, _foodName, _quantity, _ipfsHash);
        return newId;
    }

    function acceptDonation(uint256 _donationId, string memory _ngoName) external {
        Donation storage donation = donations[_donationId];
        require(donation.id != 0, "Donation does not exist");
        require(donation.status == DonationStatus.Created || donation.status == DonationStatus.Matched, "Invalid status for acceptance");

        donation.matchedNgoAddress = msg.sender;
        donation.ngoName = _ngoName;
        donation.status = DonationStatus.Accepted;

        emit DonationAccepted(_donationId, msg.sender, block.timestamp);
    }

    function confirmPickup(uint256 _donationId) external {
        Donation storage donation = donations[_donationId];
        require(donation.status == DonationStatus.Accepted, "Donation not ready for pickup");
        donation.status = DonationStatus.InTransit;

        emit PickupConfirmed(_donationId, msg.sender, block.timestamp);
    }

    function confirmDelivery(uint256 _donationId) external {
        Donation storage donation = donations[_donationId];
        require(donation.status == DonationStatus.InTransit, "Donation not in transit");
        donation.status = DonationStatus.Delivered;

        emit DeliveryConfirmed(_donationId, donation.matchedNgoAddress, block.timestamp);
    }

    function completeDonation(uint256 _donationId, string memory _verificationHash) external {
        Donation storage donation = donations[_donationId];
        require(donation.status == DonationStatus.Delivered, "Donation not delivered yet");
        
        donation.status = DonationStatus.Completed;
        donation.completedAt = block.timestamp;

        emit DonationCompleted(_donationId, block.timestamp, _verificationHash);
    }

    function getDonation(uint256 _donationId) external view returns (Donation memory) {
        return donations[_donationId];
    }
}
