import type { Models } from "appwrite";

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  location?: string;
  tags?: string;
};


export interface IUser extends Models.Document {
  name: string;
  username?: string;
  email: string;
  accountId: string;
  bio?: string;
  imageId?: string;
  imageUrl: string;
  saves?: ISave[];
  posts: IPost[]
}

export type IContextUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IContextType = {
  user: IContextUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IContextUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void
  mediaUrl: string
}

export interface IPost extends Models.Document {
  creator: IUser
  caption?: string
  tags?: string[]
  imageUrl: string
  imageId: string
  location?: string
  likes?: IUser[]
  save?: ISave[]
}

export interface ISave extends Models.Document {
  user: IUser
  post: IPost
}

export type IUpdateProfile = {
  accountId: string
  name: string
  username: string
  email: string
  bio?: string
  imageId: string
  imageUrl: string
  file: File[]
}