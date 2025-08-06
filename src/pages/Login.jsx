import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    try {
      const route = isRegister ? 'register' : 'login';

      const payload = isRegister
        ? { email: form.email, password: form.password, username: form.username }
        : { email: form.email, password: form.password };

      const res = await api.post(`/users/${route}`, payload);

      if (isRegister) {
            setIsRegister(false);
            setForm({ email: '', password: '', username: '' });
            alert("Registered successfully! Please log in.");
          } else {
            localStorage.setItem('token', res.data.token);
            user.setNewToken(res.data.token);
            navigate('/');
          }

        } catch (err) {
          setError(err.response?.data?.error || 'Something went wrong');
          console.error(err);
        }
      };

  useEffect(() => {
    if (user.token) {
      navigate('/');
    }
  }, [user.token]);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-3 text-center">{isRegister ? 'Register' : 'Login'}</h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {isRegister && (
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          )}

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn btn-info w-100">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            className="btn btn-link text-info"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have an account?' : 'Need an account?'}
          </button>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}
      </div>
    </div>
  );
}
