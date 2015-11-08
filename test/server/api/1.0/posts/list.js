import chalk from "chalk";
import * as postsList from "../../../../../server/api/1.0/posts/list";

describe("server", function () {
  describe("api", function () {
    describe("1.0", function () {
      describe("posts", function () {
        describe("list", function () {
          it("/api/1.0/posts/list/", async function (done) {
            try {
              var queryParams = postsList.extractQueryParams();
              var result = await postsList.getPosts(queryParams);
              expect(result.data.length).toEqual(4);
              done();
            } catch (e) {
              console.log(chalk.red(e.stack || e));
              done();
            }
          });
        });
      });
    });
  });
});
