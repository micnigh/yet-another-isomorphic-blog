import chalk from "chalk";
import data from "../../../../shared/data.json";

export var getPostsOnPage = function ({
  elements,
  page: {
    number: pageNumber = 1,
    size: pageSize = 10,
  },
}) {
  return elements.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

export var getPosts = function ({
  page: {
    number: pageNumber = 1,
    size: pageSize = 10,
  },
  filter: {
    tag: tag = null,
  },
  sort: sort = ["date"],
}) {
  var posts = null;
  if (tag !== null) {
    posts = data.tags[tag];
  } else {
    posts = data.posts.byDate;
  }
  var postsOnPage = getPostsOnPage({
    elements: posts,
    page: {
      number: pageNumber,
      size: pageSize,
    },
  });

  if (sort[0] === "-date") {
    postsOnPage = postsOnPage.reverse();
  }

  return Promise.resolve({
    data: posts,
    meta: {
      "total-pages": Math.ceil(posts.length / pageSize),
    }
  });
};

export var extractQueryParams = function (queryParams) {
  return {
    page: {
      number: undefined,
      size: undefined,
    },
    filter: {
      tag: undefined,
    },
    sort: undefined,
  };
};

export var methods = {
  get: async function (req, res) {
    var queryParams = undefined;
    if (typeof req.params.queryParams !== "undefined") {
      var { params: queryParams } = req;
    }
    try {
      var posts = await getPosts(extractQueryParams(queryParams));
      res.status(200).json(posts);
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
