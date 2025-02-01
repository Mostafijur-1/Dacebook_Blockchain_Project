// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
struct Message {
    address from;
    address to;
    string message;
    bool file;
    uint256 timestamp;
}

struct Account {
    string Name;
    address Address;
    string proPic;
    bytes32 passwordHash;
}

contract Messenger {
    mapping(address => Account) addToAcc;
    mapping(address => mapping(address => Message[])) private allMessages;
    mapping(address => bool) private addressToBool; // check registerd
    mapping(address => bytes32) private addressToPass;
    mapping(address => address[]) private userConnections;
    mapping(address => mapping(address=>bool)) private isConnected; // check if connected now
    mapping(string => address) private nameToAdd;

    event newMessage(address indexed _receiver, Message _message);

    function getHashedPass(address _address) public view returns(bytes32){
        require(addressToBool[_address]==true,"Account not registered");
        return addressToPass[_address];
    }

    function send(
        address _to,
        string calldata _data
    ) public returns (bool) {
        console.log(_data);
        require(keccak256(abi.encodePacked(_data)) != keccak256(abi.encodePacked("")), "No message is sent");
        Message memory _message = Message({
            from: msg.sender,
            to: _to,
            message: _data,
            file: false,
            timestamp: block.timestamp 
        });

        if(isConnected[msg.sender][_to] == false){
            userConnections[msg.sender].push(_to);
            userConnections[_to].push(msg.sender);
        } 

        isConnected[msg.sender][_to] = true;
        isConnected[_to][msg.sender] = true;

        allMessages[msg.sender][_to].push(_message);
        allMessages[_to][msg.sender].push(_message);

        emit newMessage(_to, _message);
        return true;
    }

    function register(
        string calldata _name,
        string calldata _plainPass
    ) public {
        require(addToAcc[msg.sender].Address == address(0), "User already registered");
        require(nameToAdd[_name] == address(0), "Username not available");
        Account memory newAcc = Account({
            Name: _name,
            Address: msg.sender,
            proPic: "",
            passwordHash: keccak256(abi.encodePacked(_plainPass))
        });
        addressToPass[msg.sender] = keccak256(abi.encodePacked(_plainPass));
        addToAcc[msg.sender] = newAcc;
        addressToBool[msg.sender] = true;
        nameToAdd[_name] = msg.sender;
    }

    function getMessages(address _msgOf) public view returns (Message[] memory) {
        return allMessages[msg.sender][_msgOf];
    }

    function isRegistered() public view returns (string memory) {
        if (addressToBool[msg.sender]) {
            return addToAcc[msg.sender].Name;
        }
        return "NONE";
    }

    function checkPass(string memory _plainPass) public view returns (bool) {
        return addressToPass[msg.sender] == keccak256(abi.encodePacked(_plainPass));
    }

    function getAllConnectedContacts() public view returns(Account[] memory){
        require(userConnections[msg.sender].length>0, "Not connection made before");
        uint count = 0;
        Account[] memory result = new Account[](userConnections[msg.sender].length);

        for (uint256 i = 0; i < userConnections[msg.sender].length; i++) {
            address contact = userConnections[msg.sender][i];
            if (isConnected[msg.sender][contact] && addToAcc[contact].Address != address(0)) {
                result[count] = addToAcc[contact];
                count++;
            }
        }

        return result;
    }

    function deleteContact(address _address) public returns(bool){
        require(isConnected[msg.sender][_address] == true, "User not Connected yet");
        // console.log(isConnected[msg.sender][_address]);
        isConnected[msg.sender][_address] = false;
        
        address[] storage connections = userConnections[msg.sender];
        for (uint256 i = 0; i < connections.length; i++) {
            if (connections[i] == _address) {
                // Move the last element into the place to delete
                connections[i] = connections[connections.length - 1];
                // Remove the last element
                connections.pop();
                break;
            }
        }

        // console.log(isConnected[msg.sender][_address]);
        delete allMessages[msg.sender][_address];
        return true;
    } 

    function searchUser(string calldata _name) public view returns(Account memory){
        require(nameToAdd[_name]!=address(0),"No user found");
        address user = nameToAdd[_name];
        return addToAcc[user];
    } 
}