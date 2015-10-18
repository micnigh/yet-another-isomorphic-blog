var React = require("react");
var { Link } = require("react-router");
var { baseUrl } = require("../baseUrl");

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
    var tagEls = tags.map(t => <Link to={`${baseUrl}tag/${t}`} key={t} className="tag"> {t} </Link>);
    return (
      <div className="post-summary">
        <Link to={ `${baseUrl}posts/${slug}` }>
          <h4 className="title">{ title }</h4>
        </Link>
        <p>{ summary }</p>
        <Link to={ `${baseUrl}posts/${slug}` }>
          <span className="read-more">read more</span>
        </Link>
        <span className="tags">Tagged with { tagEls }</span>
      </div>
    );
  }
}

export default PostSummary;
