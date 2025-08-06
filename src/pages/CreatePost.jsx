import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', form);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="form-control mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          className="form-control mb-2"
          rows="6"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        ></textarea>
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}