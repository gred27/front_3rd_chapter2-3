import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';

import { deleteComment as deleteCommentApi } from '~/entities/comment/api/commentApi';
import { useCommentsStore } from '~/entities/comment/model/commentsStore';

import { Button } from '~/shared/ui/Button';
import { HighlightText } from '~/shared/ui/HighlightText';

export const Comment = (postId?: number) => {
  const deleteCommentAction = useCommentsStore.use.deleteCommentAction();
  const updateCommentAction = useCommentsStore.use.updateCommentAction();
  const comments = useCommentsStore.use.comments();
  const setNewComment = useCommentsStore.use.setNewComment();
  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentApi(id);
      deleteCommentAction(id, postId);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: comments?.[postId].find((c) => c.id === id).likes + 1 }),
      });
      const data = await response.json();

      updateCommentAction(data);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }));
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{HighlightText({ text: comment.body, highlight: searchQuery })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowEditCommentDialog(true);
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
