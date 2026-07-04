// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProfileRegistry {
    // Blueprint satu profil user
    struct UserProfile {
        address wallet;
        string username;
        string metadataURI;
        uint256 registeredAt;
        bool isActive;
    }

    // Cari profil berdasarkan wallet address
    mapping(address => UserProfile) public profiles;

    // Cari wallet address berdasarkan username
    mapping(string => address) public usernameToAddress;

    // Cek apakah username sudah dipakai
    mapping(string => bool) public usernameTaken;

    // Cek apakah wallet sudah punya profil
    mapping(address => bool) public hasProfile;

    // Event - dipancarkan saat ada aksi penting
    event ProfileCreated(address indexed wallet, string username, uint256 timestamp);
    event MetadataUpdated(address indexed wallet, string newURI);

    // Daftar username baru
    function register(string calldata _username, string calldata _metadataURI) external {
        require(!usernameTaken[_username], "Username sudah dipakai");
        require(!hasProfile[msg.sender], "Wallet sudah punya profil");
        require(bytes(_username).length >= 3, "Username minimal 3 karakter");

        profiles[msg.sender] = UserProfile({
            wallet: msg.sender,
            username: _username,
            metadataURI: _metadataURI,
            registeredAt: block.timestamp,
            isActive: true
        });

        usernameToAddress[_username] = msg.sender;
        usernameTaken[_username] = true;
        hasProfile[msg.sender] = true;

        emit ProfileCreated(msg.sender, _username, block.timestamp);
    }

    // Update metadata URI (bio, avatar, dll)
    function updateMetadata(string calldata _newURI) external {
        require(hasProfile[msg.sender], "Belum punya profil");
        profiles[msg.sender].metadataURI = _newURI;
        emit MetadataUpdated(msg.sender, _newURI);
    }

    // Baca profil berdasarkan wallet address - gratis, tidak pakai gas
    function getProfile(address _wallet) external view returns (UserProfile memory) {
        return profiles[_wallet];
    }

    // Baca profil berdasarkan username
    function getByUsername(string calldata _username) external view returns (UserProfile memory) {
        address wallet = usernameToAddress[_username];
        return profiles[wallet];
    }
}