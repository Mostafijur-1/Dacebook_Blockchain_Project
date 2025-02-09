// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";

contract Dacebook {
    struct User {
        string name;
        string profilePic; // URL to profile picture stored on decentralized storage (e.g., IPFS)
        address userAddress;
        string bio;
        bytes32 passwordHash;
        address[] friends;
    }

    struct Comment {
        string text;
        address userAddress;
    }

    struct Post {
        uint256 id;
        address author;
        string content; // Post content (e.g., text or IPFS URL)
        uint256 timestamp;
        uint256 likes;
        Comment[] comments;
        string[] uploads; // Array of uploaded file URLs (e.g., IPFS CIDs)
    }
     struct Message {
        address sender;
        string content;
        bool file;
        uint256 timestamp;
    }
    struct Conversation {
        address user1;
        address user2;
        Message[] messages;
    }

    mapping(address => User) private users; 
    mapping(address => bool) private registered;
    mapping(address => mapping(address => Conversation)) private conversations;
    mapping(address => Post[]) private userPosts;
    mapping(address => mapping(address => bool)) private friendships;
    mapping(address => mapping(uint256 => mapping(address => bool))) public isLiked; // user -> postID -> liker -> bool
    mapping(address => mapping(address => Message[])) private allMessages;
    uint256 private totalPosts = 0;
    address[] private registeredUsers;

    event UserRegistered(address indexed userAddress, string name);
    event ProfileUpdated(address indexed userAddress, string profilePic, string bio);
    event NewPost(address indexed author, uint256 postId);
    event PostDeleted(address indexed author, uint256 postId);
    event NewMessage(address indexed sender, address indexed receiver, string content);
    event FriendshipToggled(address indexed user, address indexed friend, bool isNowFriend);
    event PostLiked(address indexed user, uint256 postId, bool liked);

   

    // Register with only name and password
    function register(string memory _name, string memory _password) external {
        require(!registered[msg.sender], "User already registered");
        users[msg.sender] = User({
            name: _name,
            profilePic: "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png", // Empty initially
            userAddress: msg.sender,
            bio: "", // Empty initially
            passwordHash: keccak256(abi.encodePacked(_password)),
            friends: new address[](0) // Empty initially
        });
        registered[msg.sender] = true;
        registeredUsers.push(msg.sender); // Track registered users

        emit UserRegistered(msg.sender, _name);
    }

    // Get user details
    function getAllUsers(address msg_sender) external view returns (User[] memory) {
    uint256 totalUsers = registeredUsers.length;
    User[] memory allUsers = new User[](totalUsers);

    for (uint256 i = 0; i < totalUsers; i++) {
        
        if (registeredUsers[i] != msg_sender) {
            allUsers[i] = users[registeredUsers[i]];
        }
        
    }

    return allUsers;
}


    // Update profile with additional information
    function updateProfile(string memory _profilePic, string memory _bio) external {
        require(registered[msg.sender], "User not registered");
        require(bytes(_bio).length <= 256, "Bio is too long");

        // Use a storage pointer to optimize gas usage
        User storage user = users[msg.sender];

        user.profilePic = _profilePic;
        user.bio = _bio;

        emit ProfileUpdated(msg.sender, _profilePic, _bio);
    }

    // Create a new post
    function createPost(string memory _content, string[] memory _uploads) external {
        require(registered[msg.sender], "User not registered");
        uint256 postId = userPosts[msg.sender].length;
        Post storage newPost = userPosts[msg.sender].push();

        newPost.id = postId;
        newPost.author = msg.sender;
        newPost.content = _content;
        newPost.timestamp = block.timestamp;
        newPost.likes = 0;
        newPost.uploads = _uploads;

        totalPosts++; // Increment total post count

        emit NewPost(msg.sender, postId);
    }

    // Delete a post
    function deletePost(uint256 _postId) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[msg.sender].length, "Invalid post ID");
        require(userPosts[msg.sender][_postId].author == msg.sender, "Not the post author");

        // Remove the post
        delete userPosts[msg.sender][_postId];
        totalPosts--; // Decrement total post count

        emit PostDeleted(msg.sender, _postId);
    }

    // Like a post
    function toggleLikeonPost(address _author, uint256 _postId) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");

        if (isLiked[_author][_postId][msg.sender])
            userPosts[_author][_postId].likes--;
        else userPosts[_author][_postId].likes++;

        isLiked[_author][_postId][msg.sender] = !isLiked[_author][_postId][msg.sender]; // toggles like
    }

    // Comment on a post
    function commentOnPost(address _author, uint256 _postId, string memory _comment) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");
        require(bytes(_comment).length > 0, "Comment cannot be empty");

        userPosts[_author][_postId].comments.push(Comment(_comment, msg.sender));
    }

    // Get post count for a specific user
    function getPostCount(address _user) public view returns (uint256) {
        require(registered[_user], "User not registered");
        return userPosts[_user].length;
    }

    // Get total posts count for all users
    function getTotalPostCount() public view returns (uint256) {
        return totalPosts;
    }

  

    // Get user profile
    function getUserProfile(address _user) external view returns (User memory) {
        require(registered[_user], "User not registered");
        return users[_user];
    }

    // Get a user's posts
    function getUserPosts(address _user) public view returns (Post[] memory) {
        require(registered[_user], "User not registered");
        return userPosts[_user];
    }

   

   // Get posts (posts from user and friends)
function getPosts(address _user) external view returns (Post[] memory) {
    require(registered[_user], "User not registered");
    User memory user = users[_user];
    uint totalPostsCount = userPosts[_user].length;
    for (uint i = 0; i < user.friends.length; i++) {
        if (friendships[_user][user.friends[i]]) {
            totalPostsCount += userPosts[user.friends[i]].length;
        }
    }

    Post[] memory feed = new Post[](totalPostsCount);
    uint index = 0;

    for (uint i = 0; i < userPosts[_user].length; i++) {
        feed[index++] = userPosts[_user][i];
    }

    for (uint i = 0; i < user.friends.length; i++) {
        if (friendships[_user][user.friends[i]]) {
            for (uint j = 0; j < userPosts[user.friends[i]].length; j++) {
                feed[index++] = userPosts[user.friends[i]][j];
            }
        }
    }

    // Sorting posts by timestamp (newest first)
    for (uint i = 0; i < totalPostsCount - 1; i++) {
        for (uint j = i + 1; j < totalPostsCount; j++) {
            if (feed[i].timestamp < feed[j].timestamp) {
                Post memory temp = feed[i];
                feed[i] = feed[j];
                feed[j] = temp;
            }
        }
    }

    return feed;
}

//................Messenger .............

  function toggleFriend(address _friend) external {
        require(registered[msg.sender], "User not registered");
        require(registered[_friend], "Friend not registered");
        friendships[msg.sender][_friend] = !friendships[msg.sender][_friend];
    }

  function sendMessage(address _to, string calldata _content, bool _file) external  {
        require(registered[_to], "Receiver not registered");
        require(bytes(_content).length > 0, "Message cannot be empty");

        Message memory newMessage = Message(msg.sender, _content, _file, block.timestamp);

        // Store in both sender and receiver's conversation
        conversations[msg.sender][_to].messages.push(newMessage);
        

        emit NewMessage(msg.sender, _to, _content);
    }

 function getConversation(address msg_sender, address _with) 
    external 
    view 
     
    returns (Message[] memory sentMessages, Message[] memory receivedMessages) 
{
    // Fetch messages sent by msg_sender to _with
    sentMessages = conversations[msg_sender][_with].messages;
    
    // Fetch messages received by msg_sender from _with
    receivedMessages = conversations[_with][msg_sender].messages;
    return (sentMessages, receivedMessages);
}

    
    // Get friends list
    function getFriends(address msg_sender) external view returns (address[] memory) {
        address[] memory tempFriends = users[msg_sender].friends;
        uint256 count = 0;

        for (uint256 i = 0; i < tempFriends.length; i++) {
            if (friendships[msg_sender][tempFriends[i]]) {
                count++;
            }
        }

        address[] memory result = new address[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < tempFriends.length; i++) {
            if (friendships[msg_sender][tempFriends[i]]) {
                result[index++] = tempFriends[i];
            }
        }

        return result;
    }

}