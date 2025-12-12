import { Request, Response } from 'express';

// Mock posts data
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to VartaVerse',
    content: 'This is your first post on VartaVerse!',
    description: 'This is your first post on VartaVerse!',
    category: 'general',
    authorId: '1',
    author: 'Admin',
    avatar: 'A',
    color: 'from-media-berry-crush to-media-dark-raspberry',
    timestamp: '2 hours ago',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 5,
    likes: 5,
    commentsCount: 2,
    comments: 2,
    averageRating: 4.5,
    rating: 4.5,
    tags: ['welcome', 'introduction']
  },
  {
    id: '2',
    title: 'Getting Started Guide',
    content: 'Learn how to make the most of VartaVerse platform.',
    description: 'Learn how to make the most of VartaVerse platform.',
    category: 'guide',
    authorId: '1',
    author: 'Admin',
    avatar: 'A',
    color: 'from-media-pearl-aqua to-media-powder-blush',
    timestamp: '4 hours ago',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 12,
    likes: 12,
    commentsCount: 8,
    comments: 8,
    averageRating: 4.8,
    rating: 4.8,
    tags: ['guide', 'tutorial']
  },
  {
    id: '3',
    title: 'Community Guidelines',
    content: 'Please follow these guidelines to maintain a positive community.',
    description: 'Please follow these guidelines to maintain a positive community.',
    category: 'announcement',
    authorId: '1',
    author: 'Admin',
    avatar: 'A',
    color: 'from-media-powder-blush to-media-berry-crush',
    timestamp: '1 day ago',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 3,
    likes: 3,
    commentsCount: 1,
    comments: 1,
    averageRating: 4.2,
    rating: 4.2,
    tags: ['rules', 'community']
  }
];

export const handleGetPosts = (req: Request, res: Response) => {
  const { page = 1, limit = 10, category, sort } = req.query;
  
  let filteredPosts = [...mockPosts];
  
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Return in PostsResponse format
  res.json({
    posts: filteredPosts,
    total: filteredPosts.length,
    page: Number(page),
    limit: Number(limit)
  });
};

export const handleCreatePost = (req: Request, res: Response) => {
  const { title, content, category } = req.body;
  
  if (!title || !content || !category) {
    return res.status(400).json({
      error: 'Title, content, and category are required'
    });
  }
  
  const newPost = {
    id: (mockPosts.length + 1).toString(),
    title,
    content,
    description: content,
    category,
    authorId: '1',
    author: 'User',
    avatar: 'U',
    color: 'from-media-berry-crush to-media-pearl-aqua',
    timestamp: 'Just now',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 0,
    likes: 0,
    commentsCount: 0,
    comments: 0,
    averageRating: 0,
    rating: 0,
    tags: []
  };
  
  mockPosts.push(newPost);
  
  res.status(201).json(newPost);
};