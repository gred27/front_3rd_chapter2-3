import { UserDto } from '~/entities/user/api/type';

export type CommentResponseDto = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: UserDto;
};

export interface CommentsResponseDto {
  comments: CommentResponseDto[];
  total: number;
  skip: number;
  limit: number;
}

export type CommentRequestDto = {
  body: string;
  postId: null;
  userId: number;
};