export default function CommentList({ comments }) {
	return (
		<ul className="list-group mb-3">
			{comments.map(comment => (
				<li className="list-group-item" key={comment._id}>
					<strong>{comment.author?.username || "User"}:</strong> {comment.content}
				</li>
			))}
		</ul>
	);
}
