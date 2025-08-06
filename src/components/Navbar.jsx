import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function Navbar() {
	const user = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		user.clearToken();
		navigate("/login");
	};

	const isAdmin = () => {
		if (!user.token) return false;
		try {
			const decoded = JSON.parse(atob(user.token.split('.')[1]));
			return decoded.isAdmin;
		} catch {
			return false;
		}
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-info bg-info px-3">
			<Link className="navbar-brand" to="/">WeLink</Link>

			<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarNav">
				<ul className="navbar-nav ms-auto align-items-center">

					<li className="nav-item">
						<Link className="nav-link" to="/">Home</Link>
					</li>

					{user.token ? (
						<>
							{!isAdmin() && (
								<li className="nav-item">
									<Link className="nav-link" to="/posts/create">Create Post</Link>
								</li>
							)}

							{isAdmin() && (
								<li className="nav-item">
									<Link className="nav-link" to="/admin">Admin Dashboard</Link>
								</li>
							)}

							<li className="nav-item">
								<button className="btn btn-outline-dark ms-3" onClick={handleLogout}>Logout</button>
							</li>
						</>
					) : (
						<li className="nav-item">
							<Link className="btn btn-outline-dark ms-2" to="/login">Login</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
}
