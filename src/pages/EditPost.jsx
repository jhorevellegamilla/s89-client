import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import api from '../api';

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  const currentUser = user.token ? JSON.parse(atob(user.token.split('.')[1])) : null;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        const post = res.data;

        if (post.author._id !== currentUserId) {
          alert("Unauthorized access");
          navigate(`/posts/${postId}`);
        } else {
          setForm({ title: post.title, content: post.content });
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, currentUserId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${postId}`, form);
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post.");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          className="form-control mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="form-control mb-2"
          rows="6"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        ></textarea>
        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}
