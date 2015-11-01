import _ from "underscore";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import { Route, IndexRoute } from "react-router";

import PageLayout from "./page/PageLayout";
import Home from "./component/Home";
import Post from "./component/Post";
import Tag from "./component/Tag";

import { baseUrl } from "./baseUrl";

/* eslint-disable no-unused-vars */
export default function ({
  data,
}) {
  var postRoutes = data.posts.byDate.map(post => {
    var postIndex = data.posts.byDate.findIndex((p) => p.slug === post.slug);
    var prev = data.posts.byDate[postIndex + 1] || null;
    var next = data.posts.byDate[postIndex - 1] || null;
    return (
      <Route path={`posts/${post.slug}`} key={post.slug} component={(routeProp) => {
        return <Post post={post} prev={prev} next={next} {...routeProp}/>;
      }}/>
    );
  });

  var tagRoutes = _.map(data.tags, (posts, tag) => {
    return (
      <Route path={`tag/${tag}`} key={tag} component={(routeProp) => {
        return <Tag posts={posts} {...routeProp}/>;
      }}/>
    );
  });

  return (
    <Route path={`${baseUrl}`} component={PageLayout}>
      <IndexRoute component={(routeProp) => <Home posts={data.posts.byDate} {...routeProp}/>}/>
      { postRoutes }
      { tagRoutes }
    </Route>
  );
}
/* eslint-enable no-unused-vars */
