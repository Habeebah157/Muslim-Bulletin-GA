import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleBack = () => {
    navigate("/events");
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { text: newComment, id: Date.now() }]);
    setNewComment("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-blue-900">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-4 text-blue-600 hover:text-blue-800 underline"
      >
        ← Back to Events
      </button>

      {/* Event Header */}
      <div className="bg-blue-100 rounded-xl p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">🎉 Event Title Placeholder {eventId}</h1>
        <p className="text-sm mb-1">📅 Date: June 30, 2025</p>
        <p className="text-sm mb-1">⏰ Time: 6:00 PM - 9:00 PM</p>
        <p className="text-sm mb-1">📍 Location: Placeholder City</p>
        <p className="text-sm italic text-blue-700 mt-2">
          Hosted by: Jane Doe
        </p>
      </div>

      {/* Description */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">
          📝 Description
        </h2>
        <p>
          This is a placeholder for the event description. You can describe what
          the event is about, who it's for, and anything else you'd like.
        </p>
      </div>

      {/* Calendar Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-inner">
        <h2 className="text-xl font-semibold text-blue-600 mb-3">
          📅 Add to Calendar
        </h2>
        <div className="h-24 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
          [Calendar Placeholder]
        </div>
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Connect to Google Calendar
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-inner">
        <h2 className="text-xl font-semibold text-blue-600 mb-3">
          🗺️ Event Location Map (Coming Soon)
        </h2>
        <div className="h-60 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
          [Map Placeholder]
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          💬 Questions & Comments
        </h2>

        <div className="space-y-2 mb-4">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-blue-50 p-3 rounded-lg border border-blue-100"
            >
              {comment.text}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your question or comment..."
            className="flex-grow border border-blue-300 rounded px-3 py-2"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
