/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

import { Route, IndexRoute } from "react-router";

var LayoutPage = require("./page/LayoutPage");
var Home = require("./component/Home");
var Post = require("./component/Post");

/* eslint-disable no-unused-vars */
export default function (data) {
  return (
    <Route path="/" component={LayoutPage}>
      <IndexRoute component={(routeProp) => <Home posts={data.posts.byDate}/>}/>
      <Route path="posts/:slug" component={(routeProp) => {
        var post = data.posts.bySlug[routeProp.params.slug];
        var postIndex = data.posts.byDate.findIndex((p) => p.slug === post.slug);
        var prev = data.posts.byDate[postIndex + 1] || null;
        var next = data.posts.byDate[postIndex - 1] || null;
        return <Post post={post} prev={prev} next={next}/>;
      }}/>
    </Route>
  );
}
/* eslint-enable no-unused-vars */
