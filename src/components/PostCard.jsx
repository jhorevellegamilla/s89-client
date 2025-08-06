import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
	return (
		<div className="card mb-3">
			<div className="card-body">
				<h5>{post.title}</h5>
				<p>{post.content.slice(0, 100)}...</p>
				<Link to={`/posts/${post._id}`} className="btn btn-primary">Read More</Link>
			</div>
		</div>
	);
}
