var _ = require("underscore");
/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

import { Route, IndexRoute } from "react-router";

var LayoutPage = require("./page/LayoutPage");
var Home = require("./component/Home");
var Post = require("./component/Post");
var Tag = require("./component/Tag");

/* eslint-disable no-unused-vars */
export default function (data) {

  var postRoutes = data.posts.byDate.map(post => {
    var postIndex = data.posts.byDate.findIndex((p) => p.slug === post.slug);
    var prev = data.posts.byDate[postIndex + 1] || null;
    var next = data.posts.byDate[postIndex - 1] || null;
    return (
      <Route path={`posts/${post.slug}`} key={post.slug} component={(routeProp) => {
        return <Post post={post} prev={prev} next={next}/>;
      }}/>
    );
  });

  var tagRoutes = _.map(data.tags, (posts, tag) => {
    return (
      <Route path={`tag/${tag}`} key={tag} component={(routeProp) => {
        return <Tag posts={posts}/>;
      }}/>
    );
  });

  return (
    <Route path="/" component={LayoutPage}>
      <IndexRoute component={(routeProp) => <Home posts={data.posts.byDate}/>}/>
      { postRoutes }
      { tagRoutes }
    </Route>
  );
}
/* eslint-enable no-unused-vars */
