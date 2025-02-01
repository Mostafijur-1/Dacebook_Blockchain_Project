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

    struct Comment{
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

    mapping(address => User) private users; // Mapping of user addresses to User structs
    mapping(address => bool) private registered; 
    mapping(address => Post[]) private userPosts; 
    mapping(address => mapping(address => bool)) private friendships;
    mapping(address => mapping(address => bool)) private wasFriends;// checks if they were ever friends. 
    mapping(address => mapping(uint256 => mapping(address => bool))) public isLiked; // user -> postID -> liker -> bool
    uint256 private ucount = 0;

    event UserRegistered(address indexed user, string name);
    event NewPost(address indexed author, uint256 postId);
    event NewMessage(address indexed sender, address indexed receiver, string content);
    event FileUploaded(address indexed user, string fileUrl);

    // Register a new user
    function register(string memory _name, string memory _profilePic, string memory _bio, string memory _password) external {
        require(!registered[msg.sender], "User already registered");
        ucount++;
        console.log(ucount);
        users[msg.sender] = User({
            name: _name,
            profilePic: _profilePic,
            userAddress: msg.sender,
            bio: _bio,
            passwordHash: keccak256(abi.encodePacked(_password)),
            friends: new address[](0)
        });
        registered[msg.sender] = true;
        emit UserRegistered(msg.sender, _name);
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

        emit NewPost(msg.sender, postId);
    }


    // Like a post
    function toggleLikeonPost(address _author, uint256 _postId) external {
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");

        if(isLiked[_author][_postId][msg.sender])
            userPosts[_author][_postId].likes--;
        else userPosts[_author][_postId].likes++;

        isLiked[_author][_postId][msg.sender] = !isLiked[_author][_postId][msg.sender]; // toggles like
    }

    // Comment on a post
    function commentOnPost(address _author, uint256 _postId, string memory _comment, address _commenter) external {
        console.log(_postId);
        require(registered[msg.sender], "User not registered");
        require(_postId < userPosts[_author].length, "Invalid post ID");
        userPosts[_author][_postId].comments.push( Comment(_comment, _commenter));
    }

    

    // Add a friend
    function toggleFriend(address _friend) external {
        require(registered[msg.sender], "User not registered");
        require(registered[_friend], "Friend not registered");

        if(!friendships[msg.sender][_friend]){
            if(!wasFriends[msg.sender][_friend]){
                wasFriends[msg.sender][_friend] = true;
                users[msg.sender].friends.push(_friend);
            } 
        }

        friendships[msg.sender][_friend] = !friendships[msg.sender][_friend];
        
    }

    // Get user profile
    function getUserProfile(address _user) external view returns (User memory) {
        require(registered[_user], "User not registered");
        // User memory x = users[_user];
        console.log(users[_user].name);
        return users[_user];
    }

    // Get a user's posts
    function getUserPosts(address _user) public view returns (Post[] memory) {
        console.log(userPosts[_user].length);
        require(registered[_user], "User not registered");
        require(userPosts[_user].length > 0, "Nothing posted yet");
        // Post[] memory x;
        // return x;
        return userPosts[_user];
    }

    // Check if two users are friends
    function areFriends(address _user1, address _user2) public view returns (bool) {
        return friendships[_user1][_user2];
    }

    function getFriends() view public returns(address[] memory){
        User memory user = users[msg.sender];
        uint count = 0;
        for (uint256 i = 0; i < user.friends.length; i++) {
            // console.log(user.friends[i],areFriends(msg.sender, user.friends[i]));
            if(areFriends(msg.sender, user.friends[i])){
                count++;
            }
            // console.log(result[1]==address(0));
        }

        address[] memory result = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            // console.log(user.friends[i],areFriends(msg.sender, user.friends[i]));
            if(areFriends(msg.sender, user.friends[i])){
                result[i] = user.friends[i];
            }
        }
            console.log();
        return result;
    }

    function getFeed() external view returns (Post[] memory) {
        require(registered[msg.sender], "User not registered");
        User memory user = users[msg.sender];
        uint totalPosts = userPosts[msg.sender].length;
        for (uint i = 0; i < user.friends.length; i++) {
            if (friendships[msg.sender][user.friends[i]]) {
                totalPosts += userPosts[user.friends[i]].length;
            }
        }

        Post[] memory feed = new Post[](totalPosts);
        uint index = 0;

        for (uint i = 0; i < userPosts[msg.sender].length; i++) {
            feed[index++] = userPosts[msg.sender][i];
        }

        for (uint i = 0; i < user.friends.length; i++) {
            if (friendships[msg.sender][user.friends[i]]) {
                for (uint j = 0; j < userPosts[user.friends[i]].length; j++) {
                    feed[index++] = userPosts[user.friends[i]][j];
                }
            }
        }

        for (uint i = 0; i < totalPosts - 1; i++) {
            for (uint j = i + 1; j < totalPosts; j++) {
                if (feed[i].timestamp < feed[j].timestamp) {
                    Post memory temp = feed[i];
                    feed[i] = feed[j];
                    feed[j] = temp;
                }
            }
        }
        return feed;
    }
}
