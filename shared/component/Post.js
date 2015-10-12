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
    var prevLinkEl = prev === null ? null : <Link to={`/posts/${prev.slug}`}>prev</Link>;
    var nextLinkEl = next === null ? null : <Link to={`/posts/${next.slug}`}>next</Link>;
    var tagEls = tags.map(t => <span>{t}</span>);
    return (
      <div>
        <h1>{title}</h1>
        { prevLinkEl }
        { nextLinkEl }
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}/>
        <div className="tags">{ tagEls }</div>
      </div>
    );
  }
}

export default Post;
