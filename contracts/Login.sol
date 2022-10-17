// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract Login {
	struct User {
		string username;
		string role;
	}
	mapping(address => User) users;

	function signin() public view returns (User memory) {
		return (users[msg.sender]);
	}

	function signup(string memory _role, string memory _username) public {
		User memory newUser;
		newUser.role = _role;
		newUser.username = _username;
		users[msg.sender] = newUser;
	}
}
