import { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    const res = await api.get('/posts');
    setPosts(res.data);
  };

  const handleDeletePost = async (id) => {
    await api.delete(`/posts/${id}`);
    fetchAllPosts();
  };

  const handleViewComments = async (postId) => {
    const res = await api.get(`/comments/${postId}`);
    setSelectedPostId(postId);
    setComments(res.data);
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    handleViewComments(selectedPostId);
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <h4>All Posts</h4>
      {posts.map((post) => (
        <div key={post._id} className="card mb-3">
          <div className="card-body">
            <h5>{post.title}</h5>
            <p>{post.content.slice(0, 100)}...</p>
            <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeletePost(post._id)}>Delete</button>
            <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewComments(post._id)}>View Comments</button>
          </div>
        </div>
      ))}

      {selectedPostId && (
        <>
          <h4>Comments for Post ID: {selectedPostId}</h4>
          <ul className="list-group">
            {comments.map((comment) => (
              <li key={comment._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span><strong>{comment.author?.username}:</strong> {comment.content}</span>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
