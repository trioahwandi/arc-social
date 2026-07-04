// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ProfileRegistry.sol";
import "./FeedContract.sol";

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract TipContract {

    ProfileRegistry public profileRegistry;
    FeedContract public feedContract;
    IERC20 public usdc;

    // Catatan tip per post
    struct TipRecord {
        address tipper;
        uint256 amount;
        uint256 timestamp;
    }

    // Total USDC yang diterima per post
    mapping(bytes32 => uint256) public totalTipsPerPost;

    // History tip per post
    mapping(bytes32 => TipRecord[]) public tipHistory;

    // Total USDC yang pernah diterima satu user
    mapping(address => uint256) public totalEarned;

    // Events
    event TipSent(
        bytes32 indexed postId,
        address indexed tipper,
        address indexed creator,
        uint256 amount
    );

    constructor(
        address _profileRegistry,
        address _feedContract,
        address _usdcAddress
    ) {
        profileRegistry = ProfileRegistry(_profileRegistry);
        feedContract = FeedContract(_feedContract);
        usdc = IERC20(_usdcAddress);
    }

    // Kirim tip USDC ke creator
    function tipPost(
        bytes32 _postId,
        address _creator,
        uint256 _amount
    ) external {
        require(_amount > 0, "Amount harus lebih dari 0");
        require(_creator != msg.sender, "Tidak bisa tip diri sendiri");
        require(profileRegistry.hasProfile(msg.sender), "Harus punya profil dulu");
        require(profileRegistry.hasProfile(_creator), "Creator tidak ditemukan");

        // Transfer USDC langsung dari tipper ke creator
        bool ok = usdc.transferFrom(msg.sender, _creator, _amount);
        require(ok, "Transfer USDC gagal");

        // Catat history
        totalTipsPerPost[_postId] += _amount;
        totalEarned[_creator] += _amount;

        tipHistory[_postId].push(TipRecord({
            tipper: msg.sender,
            amount: _amount,
            timestamp: block.timestamp
        }));

        emit TipSent(_postId, msg.sender, _creator, _amount);
    }

    // Baca total tip satu post — gratis
    function getTotalTips(bytes32 _postId) external view returns (uint256) {
        return totalTipsPerPost[_postId];
    }

    // Baca history tip satu post
    function getTipHistory(bytes32 _postId) external view returns (TipRecord[] memory) {
        return tipHistory[_postId];
    }

    // Baca total yang pernah diterima satu user
    function getTotalEarned(address _user) external view returns (uint256) {
        return totalEarned[_user];
    }
}