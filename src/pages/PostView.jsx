import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import api from "../api";

export default function PostView() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const user = useContext(UserContext);
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	const currentUser = user.token ? JSON.parse(atob(user.token.split('.')[1])) : null;
	const currentUserId = currentUser?.id;
	const isAdmin = currentUser?.isAdmin;

	const fetchData = async () => {
		try {
			const postRes = await api.get(`/posts/${postId}`);
			const commentRes = await api.get(`/comments/${postId}`);
			setPost(postRes.data);
			setComments(commentRes.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const addComment = async () => {
		if (!user.token) {
			navigate("/login");
			return;
		}
		try {
			await api.post(`/comments/${postId}`, { content: newComment });
			setNewComment("");
			fetchData();
		} catch (err) {
			console.error(err);
			alert("Failed to post comment.");
		}
	};

	const handleDeletePost = async () => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await api.delete(`/posts/${post._id}`);
				navigate("/");
			} catch (err) {
				console.error(err);
				alert("Failed to delete post.");
			}
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Delete this comment?")) return;
		try {
			await api.delete(`/comments/${commentId}`);
			fetchData();
		} catch (err) {
			console.error(err);
			alert("Failed to delete comment.");
		}
	};

	if (!post) return <div></div>;

	return (
		<div className="container mt-4">
			<h2>{post.title}</h2>
			<p className="text-dark">
				By: <strong>{post.author?.username || "Unknown"}</strong> <br />
				<small>Posted on {new Date(post.createdAt).toLocaleString()}</small>
			</p>
			<p>{post.content}</p>

			<div className="mb-3">
				{currentUserId === post.author?._id && (
					<button
						className="btn btn-warning me-2"
						onClick={() => navigate(`/posts/edit/${post._id}`)}
					>
						Edit
					</button>
				)}

				{(currentUserId === post.author?._id || isAdmin) && (
					<button className="btn btn-danger" onClick={handleDeletePost}>
						Delete
					</button>
				)}
			</div>

			<hr />
			<h4>Comments</h4>
			<ul className="list-group mb-3">
				{comments.map((c) => (
					<li key={c._id} className="list-group-item d-flex justify-content-between align-items-start">
						<div>
							<strong>{c.author?.username || "User"}:</strong> {c.content}
							<br />
							<small className="text-muted">
								Posted on {new Date(c.createdAt).toLocaleString()}
							</small>
						</div>

						{isAdmin && (
							<button
								className="btn btn-sm btn-outline-danger"
								onClick={() => handleDeleteComment(c._id)}
							>
								Delete
							</button>
						)}
					</li>
				))}
			</ul>

			{user.token ? (
				<>
					<textarea
						className="form-control mb-2"
						placeholder="Write a comment"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					></textarea>
					<button className="btn btn-primary" onClick={addComment}>Add Comment</button>
				</>
			) : (
				<div className="alert alert-info">
					Please <a href="/login">login</a> to leave a comment.
				</div>
			)}
		</div>
	);
}
