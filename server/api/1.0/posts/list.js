import chalk from "chalk";
import data from "../../../../shared/data.json";
import queryString from "query-string";

var isDev = "development" === process.env.NODE_ENV;

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

  // if (isDev) {
  //   var samplePosts = [];
  //   for (var i of [1, ...100]) {
  //     samplePosts.push({
  //       title: `${i}`,
  //       slug: `${i}`,
  //       summary: `${i} summary`,
  //       tags: [],
  //     });
  //   }
  //   posts = posts.concat(samplePosts);
  // }

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
    data: postsOnPage,
    meta: {
      "total-pages": Math.ceil(posts.length / pageSize),
    }
  });
};

export var extractQueryParams = function (queryParams) {
  var params = queryString.parse(queryParams);
  return {
    page: {
      number: params["page[number]"],
      size: params["page[size]"],
    },
    filter: {
      tag: params["filter[tag]"],
    },
    sort: params["sort"].split(","),
  };
};

export var methods = {
  get: async function (req, res) {
    var { params: { queryParams }} = req;
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
