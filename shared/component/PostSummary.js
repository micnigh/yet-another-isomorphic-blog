var React = require("react");
var { Link } = require("react-router");

class PostSummary extends React.Component {
  render () {
    var {
      post: {
        title,
        summary,
        slug,
      }
    } = this.props;
    return (
      <div className="post-summary">
        <Link to={ `/posts/${slug}` }>
          <h2>{ title }</h2>
        </Link>
        <p>{ summary }</p>
      </div>
    );
  }
}

export default PostSummary;
