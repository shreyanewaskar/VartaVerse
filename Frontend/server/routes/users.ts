import { Request, Response } from 'express';

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];

export const handleLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  // For development: accept any email/password or find existing user
  let user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    // Create temporary user for any login attempt (development only)
    user = {
      id: Date.now(),
      email,
      password,
      name: email.split('@')[0] // Use email prefix as name
    };
  }

  // Generate mock JWT token (in real app, use proper JWT)
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  res.json({
    jwtToken: token,
    userName: user.name,
    userId: user.id
  });
};

export const handleGetMe = (req: Request, res: Response) => {
  // Mock current user data
  const mockUser = {
    id: '1',
    email: 'user@example.com',
    name: 'Current User',
    role: 'user'
  };
  
  res.json(mockUser);
};

export const handleRegister = (req: Request, res: Response) => {
  const { email, password, name, role = 'user', phoneNumber = '', bio = '' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      error: 'Email, password, and name are required' 
    });
  }

  // Check if user exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ 
      error: 'User already exists' 
    });
  }

  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password, // In real app, hash this
    name,
    role,
    phoneNumber,
    bio,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);

  // Return user object (register API returns User, not LoginResponse)
  res.status(201).json({
    id: newUser.id.toString(),
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    phoneNumber: newUser.phoneNumber,
    bio: newUser.bio,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt
  });
};