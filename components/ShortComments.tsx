"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Comment = {
  id: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
  };
};

type ShortCommentsProps = {
  shortId: string;
};

export default function ShortComments({ shortId }: ShortCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isSignedIn } = useUser();

  // Fetch comments on load
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/shorts/${shortId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.error("Failed to load comments");
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchComments();
  }, [shortId]);

  // Handle new comment submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/shorts/${shortId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const createdComment = await res.json();

        // Optimistically update UI
        setComments((prev) => [
          {
            ...createdComment,
            user: { name: user?.fullName || "You" },
          },
          ...prev,
        ]);
        setNewComment("");
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting comment");
    }

    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full p-2 border rounded resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Sign in to post a comment.</p>
      )}

      <div className="space-y-3 max-h-[520px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-2">
              <p className="font-semibold">{comment.user.name}</p>
              <p>{comment.text}</p>
              <small className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
