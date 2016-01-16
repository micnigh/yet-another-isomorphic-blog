import chalk from "chalk";
import data from "../../../../shared/data.json";

export var getPost = function ({
  slug,
}) {
  var post = data.posts.bySlug[slug];
  var postIndex = data.posts.byDate.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    return Promise.reject({ message: `Post by slug ${slug} not found.` });
  }
  var prev = data.posts.byDate[postIndex + 1] || undefined;
  var next = data.posts.byDate[postIndex - 1] || undefined;
  post = Object.assign({}, post, {
    prev: prev === undefined ? undefined : {
      title: prev.title,
      slug: prev.slug,
    },
    next: next === undefined ? undefined : {
      title: next.title,
      slug: next.slug,
    },
  });
  return Promise.resolve({
    data: post,
  });
};

export var methods = {
  get: async function (req, res) {
    var queryParams = undefined;
    if (typeof req.params.queryParams !== "undefined") {
      var { params: queryParams } = req;
    }
    try {
      var post = await getPost({
        slug: req.params.slug,
      });
      res.status(200).json(post);
    } catch (error) {
      res.status(500).send("Invalid request");
      if (typeof error.stack !== "undefined") {
        console.log(chalk.red(error.stack));
      } else {
        console.log(chalk.red(error.message));
      }
    }
  }
};
