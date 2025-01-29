// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Dacebook {
    struct User {
        string name;
        string profilePic; // URL to profile picture stored on decentralized storage (e.g., IPFS)
        address userAddress;
        string bio;
        bytes32 passwordHash;
        address[] friends;
    }

    struct Post {
        uint256 id;
        address author;
        string content; // Post content (e.g., text or IPFS URL)
        uint256 timestamp;
        uint256 likes;
        string[] comments;
        string[] uploads; // Array of uploaded file URLs (e.g., IPFS CIDs)
    }

    struct Message {
        address sender;
        address receiver;
        string content;
        uint256 timestamp;
    }

    mapping(address => User) private users; // Mapping of user addresses to User structs
    mapping(address => bool) private registered; // Check if a user is registered
    mapping(address => Post[]) private userPosts; // User's posts
    mapping(address => mapping(address => Message[])) private messages; // Messages between users
    mapping(address => mapping(address => bool)) private friendships; // Friendships between users

    event UserRegistered(address indexed user, string name);
    event NewPost(address indexed author, uint256 postId);
    event NewMessage(address indexed sender, address indexed receiver, string content);
    event FileUploaded(address indexed user, string fileUrl);

    // Register a new user
    function register(string memory _name, string memory _profilePic, string memory _bio, string memory _password) external {
        require(!registered[msg.sender], "User already registered");
        users[msg.sender] = User({
            name: _name,
            profilePic: _profilePic,
            userAddress: msg.sender,
            bio: _bio,
            passwordHash: keccak256(abi.encodePacked(_password)),
            friends: new address[](0)   });
        registered[msg.sender] = true;
        emit UserRegistered(msg.sender, _name);
    }

    // Create a new post
    function createPost(string memory _content, string[] memory _uploads) external {
        require(registered[msg.sender], "User not registered");
        uint256 postId = userPosts[msg.sender].length;
        userPosts[msg.sender].push(Post({
            id: postId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likes: 0,
            comments: new string[](0),
       uploads: _uploads
        }));
        emit NewPost(msg.sender, postId);
    }

    // Like a post
    function likePost(address _author, uint256 _postId) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");
        userPosts[_author][_postId].likes++;
    }

    // Comment on a post
    function commentOnPost(address _author, uint256 _postId, string memory _comment) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");
        userPosts[_author][_postId].comments.push(_comment);
    }

    // Upload a file (e.g., to IPFS) and associate it with the user
    function uploadFile(string memory _fileUrl) external {
        require(registered[msg.sender], "User not registered");
        emit FileUploaded(msg.sender, _fileUrl);
    }

    // Send a message
    function sendMessage(address _receiver, string memory _content) external {
        require(registered[msg.sender], "Sender not registered");
        require(registered[_receiver], "Receiver not registered");
        messages[msg.sender][_receiver].push(Message({
            sender: msg.sender,
            receiver: _receiver,
            content: _content,
            timestamp: block.timestamp
        }));
        emit NewMessage(msg.sender, _receiver, _content);
    }

    // Get messages between two users
    function getMessages(address msg_sender,address _withUser) external view returns (Message[] memory) {
        require(registered[msg_sender], "User not registered");
        return messages[msg_sender][_withUser];
    }

    // Add a friend
    function addFriend(address _friend) external {
        require(registered[msg.sender], "User not registered");
        require(registered[_friend], "Friend not registered");
        require(!friendships[msg.sender][_friend], "Already friends");
        friendships[msg.sender][_friend] = true;
        friendships[_friend][msg.sender] = true;
        users[msg.sender].friends.push(_friend);
        users[_friend].friends.push(msg.sender);
    }

    // Get user profile
    function getUserProfile(address _user) external view returns (User memory) {
        require(registered[_user], "User not registered");
        return users[_user];
    }

    // Get a user's posts
    function getUserPosts(address _user) external view returns (Post[] memory) {
        require(registered[_user], "User not registered");
        return userPosts[_user];
    }

    // Check if two users are friends
    function areFriends(address _user1, address _user2) external view returns (bool) {
        return friendships[_user1][_user2];
    }
}
