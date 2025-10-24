package com.mit.VarnaVerse.UserService.Service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.UserService.Entities.User;


@Service
public interface UserService {

	public User register(User user);

	public User login(User user);
	
	public List<User> getUser();
	
	public User currentUser(User user);
	
	public User updateUser(String email,User user);
	
	public User deleteUser(User user);
	
	public User getUserById(String id);
	
	public List<User> getUserByRole(String role);
}