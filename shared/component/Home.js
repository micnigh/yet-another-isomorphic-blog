import React from "react";
import PostSummary from "./PostSummary";
import _ from "underscore";
import superagent from "superagent";
import superagentJsonapify from "superagent-jsonapify";
superagentJsonapify(superagent);
import queryString from "query-string";

class Home extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      "page[number]": 1,
      "page[size]": 10,
      "sort": "date",
      posts: this.props.posts.slice(0,10),
      loading: false,
    };

    //_.defer(() => this.loadMorePosts());
  }

  componentDidMount () {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount () {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll (e) {
    var { srcElement } = e;
    var { body: { scrollTop, scrollHeight, clientHeight }} = srcElement;
    if (scrollTop + scrollHeight >= clientHeight) {
      this.loadMorePosts();
    }
  }

  async loadMorePosts () {
    this.setState({
      loading: true,
    });

    var { body: { data: posts }} = await superagent.get(`/api/1.0/posts/list/${queryString.stringify({
      "page[number]": this.state["page[number]"] + 1,
      "page[size]": this.state["page[size]"],
      "sort": this.state["sort"],
    })}`);

    this.setState({
      posts: this.state.posts.concat(posts),
      loading: false,
    });
  }

  render () {
    var { posts } = this.state;
    var renderedPosts = posts.map(p => <PostSummary key={p.slug} post={p}/>);
    return (
      <div>
        { renderedPosts }
        { this.state.loading ? <span>Loading more posts...</span> : null }
      </div>
    );
  }
}

export default Home;
