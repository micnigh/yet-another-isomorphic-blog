var gulp = require("gulp");
var _ = require("underscore");
var marked = require("gulp-marked");
var frontMatter = require("gulp-front-matter");
var es = require("event-stream");
var hljs = require("highlight.js");
var fs = require("fs");
var path = require("path");

var generateTask = function({
  taskName,
  dependsOn,
}) {
  gulp.task(taskName, dependsOn, function (done) {
    var data = {
      posts: {
        bySlug: {},
        byDate: [],
      },
      tags: {},
    };

    gulp.src([
      "posts/*.md",
    ])
      .pipe(frontMatter({
        remove: true,
      }))
      .pipe(marked({
        langPrefix: "hljs ", // add hljs class to <code> https://github.com/chjj/marked/pull/418
        highlight: function (code) {
          return hljs.highlightAuto(code).value;
        },
      }))
      .pipe(es.map(function (file, cb) {
        var slug = path.basename(file.relative, ".html");

        var post = _.extend({}, file.frontMatter, {
          slug: slug,
          content: file.contents.toString(),
        });

        addPost(data, post);

        return cb(null, file);
      }))
      .on("end", function () {
        data.posts.byDate = sortPostsByDate(data.posts.byDate);
        _.each(data.tags, (posts, tag) => {
          data.tags[tag] = sortPostsByDate(posts);
        });
        fs.writeFile("shared/data.json", JSON.stringify(data, null, 2), done);
      });
  });
};

var addPost = function (data, post) {
  data.posts.bySlug[post.slug] = post;
  data.posts.byDate.push(post);

  post.tags.forEach(t => {
    if (typeof data.tags[t] === "undefined") {
      data.tags[t] = [ post ];
    } else {
      data.tags[t].push(post);
    }
  });
};

var sortPostsByDate = function (posts) {
  return posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
};

module.exports = {
  generateTask,
};
