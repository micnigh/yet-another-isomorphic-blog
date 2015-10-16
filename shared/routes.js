/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

import { Route, IndexRoute } from "react-router";

var LayoutPage = require("./page/LayoutPage");
var Home = require("./component/Home");
var Post = require("./component/Post");

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

  return (
    <Route path="/" component={LayoutPage}>
      <IndexRoute component={(routeProp) => <Home posts={data.posts.byDate}/>}/>
      { postRoutes }
    </Route>
  );
}
/* eslint-enable no-unused-vars */
