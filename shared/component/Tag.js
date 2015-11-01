import React from "react";
import PostSummary from "./PostSummary";

class Tag extends React.Component {
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

export default Tag;
