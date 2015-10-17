var React = require("react");
var { Link } = require("react-router");

class Post extends React.Component {
  render () {
    var {
      post : {
        title: title,
        content: content,
        tags: tags,
      }, prev, next
    } = this.props;
    var prevLinkEl = prev === null ? <span className="prev">prev</span> : <Link to={`/posts/${prev.slug}`} className="prev">prev - {prev.title}</Link>;
    var nextLinkEl = next === null ? <span className="next">next</span> : <Link to={`/posts/${next.slug}`} className="next">{next.title} - next</Link>;
    var tagEls = tags.map(t => <Link to={`/tag/${t}`} key={t} className="tag"> {t} </Link>);
    return (
      <div className="post">
        <div className="title-container">
          <h3 className="title">{title}</h3>
          <span className="tags">Tagged with { tagEls }</span>
        </div>
        <div className="post-navigation">
          { prevLinkEl }
          { nextLinkEl }
        </div>
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}/>
        <div className="social"></div>
        <div className="comments"></div>
      </div>
    );
  }
}

export default Post;
