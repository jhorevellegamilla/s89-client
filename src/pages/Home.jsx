import { useEffect, useState, UseContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import UserContext from "../context/UserContext";
import api from "../api";
import { Link } from 'react-router-dom';


import Navbar from "../components/Navbar";
import CommentList from "../components/CommentList";
import PostCard from "../components/PostCard";

import Modal from 'bootstrap/js/dist/modal';

export default function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		api.get("/posts")
			.then(res => setPosts(res.data))
			.catch(err => console.error(err));
	}, []);

	return (
		<div className="container mt-5">
			<h2>What's New?</h2>
			{posts.map(post => (
				<div key={post._id} className="card mb-3">
					<div className="card-body">
						<h5 className="card-title">{post.title}</h5>
						<p className="card-text">{post.content.slice(0, 100)}...</p>
						<Link to={`/posts/${post._id}`} className="btn btn-primary">Read More</Link>
					</div>
				</div>
			))}
		</div>
	);
}
