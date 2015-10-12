var React = require("react");
var PostSummary = require("./PostSummary");

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      posts: this.props.posts.slice(0,10),
    };
  }

  render () {
    var { posts } = this.state;
    var renderedPosts = posts.map(p => <PostSummary key={p.slug} post={p}/>);
    return (
      <div>
        { renderedPosts }
      </div>
    );
  }
}

export default Home;
