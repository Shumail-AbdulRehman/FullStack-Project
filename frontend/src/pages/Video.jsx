import SideBar from '@/components/custom/SideBar';
import VideoMeta from '@/components/custom/Video/VideoMeta';
import VideoPlayer from '@/components/custom/Video/VideoPlayer';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VideosSuggestion from '@/components/custom/Video/VideosSuggestion';
import VideoComment from '@/components/custom/Video/VideoComment';
import AddComment from '@/components/custom/Video/AddComment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

function Video() {
  const queryClient = useQueryClient();
  const { videoId, channelId } = useParams();
  const userData = useSelector((state) => state.auth.userData);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/${videoId}/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comment", videoId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        { withCredentials: true }
      );
      return res.data.data.docs;
    },
  });

  const { mutate: deleteUserComment } = useMutation({
    mutationFn: async (comment) => {
      await axios.delete(`http://localhost:8000/api/v1/comments/c/${comment._id}`, {
        withCredentials: true
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["comment", videoId])
  });

  const deleteComment = (comment) => {
    deleteUserComment(comment);
  };

  const { mutate: updateUserComment } = useMutation({
    mutationFn: async ({ commentId, content }) => {
      console.log("commentId is::",commentId)
      const res = await axios.patch(
        `http://localhost:8000/api/v1/comments/c/${commentId}`,
        { newContent:content },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comment", videoId]);
      setEditingCommentId(null);
      setEditingContent('');
    },
    onError: (err) => console.log("update comment error:", err)
  });

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
  };

  const submitEdit = () => {
    updateUserComment({ commentId: editingCommentId, content: editingContent });
  };

  if (videoLoading || commentsLoading) {
    return <h1 className="text-white text-xl p-10">Loading…</h1>;
  }

  return (
    <div className="grid grid-cols-6 gap-4 px-4 py-3">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-4 flex flex-col gap-6">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <VideoPlayer {...video.video[0]} videoId={videoId} />
        </div>

        <VideoMeta
          isSubscribed={video.isSubscribed}
          isLiked={video.isLiked}
          {...video.video[0]}
        />

        <div className="bg-neutral-900 p-4 rounded-xl shadow-md">
          <AddComment videoId={videoId} />
        </div>

        <div className="bg-neutral-900 p-5 rounded-xl shadow-lg flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            Comments ({comments?.length})
          </h2>

          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-neutral-800 p-4 rounded-lg">
                {editingCommentId === comment._id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="p-2 rounded-md bg-neutral-700 text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={submitEdit}
                        className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 text-sm rounded-md bg-gray-600 hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <VideoComment
                      content={comment.content}
                      createdAt={comment.createdAt}
                      owner={comment.owner?.username}
                      avatar={comment.owner?.avatar}
                    />
                    {comment.owner._id === userData?._id && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => deleteComment(comment)}
                          className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => startEditing(comment)}
                          className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No comments yet.</div>
          )}
        </div>
      </div>

      <div className="col-span-1">
        <VideosSuggestion {...video} />
      </div>
    </div>
  );
}

export default Video;
