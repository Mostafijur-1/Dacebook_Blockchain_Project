// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  
  struct Access{
     address user; 
     bool access; 
  }
  mapping(address=>string[]) value;
  mapping(address=>mapping(address=>bool)) ownership;
  mapping(address=>Access[]) accessList;
  mapping(address=>mapping(address=>bool)) previousData;

  function add(address _user,string memory url) external {
      value[_user].push(url);
  }
  function allow(address user,address caller) external {//def
      ownership[caller][user]=true; 
      if(previousData[caller][user]){
         for(uint i=0;i<accessList[caller].length;i++){
             if(accessList[caller][i].user==user){
                  accessList[caller][i].access=true; 
             }
         }
      }else{
          accessList[caller].push(Access(user,true));  
          previousData[caller][user]=true;  
      }
    
  }
  function disallow(address user,address caller) public{
      ownership[caller][user]=false;
      for(uint i=0;i<accessList[caller].length;i++){
          if(accessList[caller][i].user==user){ 
              accessList[caller][i].access=false;  
          }
      }
  }

 function display(address _user, address caller) external view returns(string[] memory) {
    require(_user == caller || ownership[_user][caller], "You don't have access");
    return value[_user];
}


  function shareAccess(address caller) public view returns(Access[] memory){
      return accessList[caller];
  }



}

