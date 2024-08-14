export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  followers: string[];
  following: string[];
  likedPosts: string[];
  createdAt: string;
}

export interface Post {
  _id: string;
  user: User;
  text: string;
  img?: string | null;
  likes: string[];
  comments: string[];
  createdAt: string;
}

export interface CreatePostData {
  text: string;
  img: string | null;
}

export interface GetPostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}
