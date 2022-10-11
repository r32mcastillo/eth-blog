// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Blog {
    constructor() {}

    struct User {
        address owner;
        string name;

    }
    struct BlogItem {
        address owner;
        string message;
        uint256 id ;
        uint256 likes;
        uint date;
    }

    BlogItem[] private blogItems;
    using Counters for Counters.Counter;
    Counters.Counter private _idCounter;

    User[] private users;

    function addItem(string memory message) public {
        uint256 current = _idCounter.current();
        blogItems.push(BlogItem(msg.sender, message,current,0,getNow()));

        bool isUser = false;
        for(uint256 i = 0 ; i < users.length ; i ++){
            if(users[i].owner == msg.sender){
               isUser = true; 
            }
        }
        if(!isUser){
            users.push(User(msg.sender,"Anonimo"));
        }
        _idCounter.increment();
    }
    function addLike(uint256  id) public {
        for(uint256 i = 0 ; i < blogItems.length; i++){
            if(blogItems[i].id == id){
                blogItems[i].likes += 1;
            }
        }
    }
    function updateNickName(string memory nick) public {
         for(uint256 i = 0 ; i < users.length; i++){
            if(users[i].owner == msg.sender){
                users[i].name = nick;
            }
        }
    }
    function getByOwner() public view returns (BlogItem[] memory) {
        uint256 itemCount = 0;
        for(uint256 i = 0 ; i < blogItems.length; i++){
            if(blogItems[i].owner == msg.sender){
                itemCount += 1;
            }
        }
        BlogItem[] memory myItems = new BlogItem[](itemCount);
        uint256  nextPosition = 0;

        for (uint256 i = 0; i < blogItems.length; i++) {
            if (blogItems[i].owner == msg.sender) {
                myItems[nextPosition] = blogItems[i];
                nextPosition += 1;
            }
        }
        return myItems;
    }
    function getByAddress(address a) public view returns (BlogItem[] memory) {
        uint256 itemCount = 0;
        for(uint256 i = 0 ; i < blogItems.length; i++){
            if(blogItems[i].owner == a){
                itemCount += 1;
            }
        }
        BlogItem[] memory myItems = new BlogItem[](itemCount);
        uint256  nextPosition = 0;

        for (uint256 i = 0; i < blogItems.length; i++) {
            if (blogItems[i].owner == a) {
                myItems[nextPosition] = blogItems[i];
                nextPosition += 1;
            }
        }
        return myItems;
    }
    function getAllItems() public view returns (BlogItem[] memory) {
        return blogItems;
    }
    function getAllUsers() public view returns (User[] memory) {
        return users;
    }
    function getNow() private view returns (uint){
        console.log(1000*block.timestamp);
        return 1000*block.timestamp;
    }
}
