var React = require("react");
var { Link } = require("react-router");
var { baseUrl } = require("../baseUrl");

class Post extends React.Component {
  render () {
    var {
      post : {
        title: title,
        content: content,
        tags: tags,
      }, prev, next
    } = this.props;
    var prevLinkEl = prev === null ? <span className="prev">prev</span> : <span onClick={() => this.props.setTransitionName("in-from-left") }><Link to={`${baseUrl}posts/${prev.slug}`} className="prev" setTransitionName={this.props.setTransitionName}>prev - {prev.title}</Link></span>;
    var nextLinkEl = next === null ? <span className="next">next</span> : <span onClick={() => this.props.setTransitionName("in-from-right") }><Link to={`${baseUrl}posts/${next.slug}`} className="next" setTransitionName={this.props.setTransitionName}>{next.title} - next</Link></span>;
    var tagEls = tags.map(t => <Link to={`${baseUrl}tag/${t}`} key={t} className="tag"> {t} </Link>);
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
