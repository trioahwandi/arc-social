// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ProfileRegistry.sol";

contract FeedContract {

    ProfileRegistry public profileRegistry;

    // Blueprint satu post
    struct Post {
        bytes32 id;
        address author;
        bytes32 contentHash;
        string contentURI;
        bytes32 parentId;
        uint256 timestamp;
        bool isActive;
    }

    // Semua post berdasarkan ID
    mapping(bytes32 => Post) public posts;

    // Semua post milik satu author
    mapping(address => bytes32[]) public postsByAuthor;

    // Global feed — semua post original (bukan reply)
    bytes32[] public globalFeed;

    // Sistem follow
    mapping(address => address[]) public following;
    mapping(address => address[]) public followers;
    mapping(address => mapping(address => bool)) public isFollowing;

    // Events
    event PostCreated(bytes32 indexed postId, address indexed author, bytes32 parentId, uint256 timestamp);
    event PostDeleted(bytes32 indexed postId, address indexed author);
    event Followed(address indexed follower, address indexed target);
    event Unfollowed(address indexed follower, address indexed target);

    // Hubungkan ke ProfileRegistry
    constructor(address _profileRegistry) {
        profileRegistry = ProfileRegistry(_profileRegistry);
    }

    // Buat post baru
    function createPost(
        string calldata _contentURI,
        bytes32 _contentHash,
        bytes32 _parentId
    ) external returns (bytes32 postId) {
        require(profileRegistry.hasProfile(msg.sender), "Harus punya profil dulu");

        postId = keccak256(abi.encodePacked(
            msg.sender, _contentHash, block.timestamp
        ));

        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            contentHash: _contentHash,
            contentURI: _contentURI,
            parentId: _parentId,
            timestamp: block.timestamp,
            isActive: true
        });

        postsByAuthor[msg.sender].push(postId);

        // Kalau bukan reply, masuk ke global feed
        if (_parentId == bytes32(0)) {
            globalFeed.push(postId);
        }

        emit PostCreated(postId, msg.sender, _parentId, block.timestamp);
        return postId;
    }

    // Hapus post (soft delete — data tetap ada di blockchain)
    function deletePost(bytes32 _postId) external {
        Post storage p = posts[_postId];
        require(p.author == msg.sender, "Bukan post milikmu");
        require(p.isActive, "Post sudah dihapus");
        p.isActive = false;
        emit PostDeleted(_postId, msg.sender);
    }

    // Follow user lain
    function follow(address _target) external {
        require(_target != msg.sender, "Tidak bisa follow diri sendiri");
        require(!isFollowing[msg.sender][_target], "Sudah follow user ini");
        require(profileRegistry.hasProfile(_target), "User tidak ditemukan");

        isFollowing[msg.sender][_target] = true;
        following[msg.sender].push(_target);
        followers[_target].push(msg.sender);

        emit Followed(msg.sender, _target);
    }

    // Unfollow user
    function unfollow(address _target) external {
        require(isFollowing[msg.sender][_target], "Belum follow user ini");
        isFollowing[msg.sender][_target] = false;
        emit Unfollowed(msg.sender, _target);
    }

    // Baca satu post — gratis
    function getPost(bytes32 _postId) external view returns (Post memory) {
        return posts[_postId];
    }

    // Baca semua post milik satu author
    function getPostsByAuthor(address _author) external view returns (bytes32[] memory) {
        return postsByAuthor[_author];
    }

    // Baca global feed dengan pagination
    function getGlobalFeed(uint256 _offset, uint256 _limit)
        external view returns (bytes32[] memory)
    {
        uint256 total = globalFeed.length;
        if (_offset >= total) return new bytes32[](0);
        uint256 end = total - _offset;
        uint256 start = end > _limit ? end - _limit : 0;
        bytes32[] memory result = new bytes32[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = globalFeed[i];
        }
        return result;
    }

    // Cek jumlah following dan followers
    function getFollowingCount(address _user) external view returns (uint256) {
        return following[_user].length;
    }

    function getFollowersCount(address _user) external view returns (uint256) {
        return followers[_user].length;
    }
}