var React = require("react");
var { Link } = require("react-router");

class PostSummary extends React.Component {
  render () {
    var {
      post: {
        title,
        summary,
        slug,
        tags,
      }
    } = this.props;
    var tagEls = tags.map(t => <Link to={`/tags/${t}`} key={t} className="tag"> {t} </Link>);
    return (
      <div className="post-summary">
        <Link to={ `/posts/${slug}` }>
          <h4 className="title">{ title }</h4>
        </Link>
        <p>{ summary }</p>
        <Link to={ `/posts/${slug}` }>
          <span className="read-more">read more</span>
        </Link>
        <span className="tags">Tagged with { tagEls }</span>
      </div>
    );
  }
}

export default PostSummary;
