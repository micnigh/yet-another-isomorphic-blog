# yet-another-isomorphic-blog

Demo of isomorphic react blog.

See it in action [here](https://micnigh.github.io/yet-another-isomorphic-blog/)

## Quick start

```bash
git clone https://github.com/micnigh/yet-another-isomorphic-blog
cd yet-another-isomorphic-blog
npm install
npm install -g gulp # if not already installed globally

```

## tasks

```bash
gulp # alias gulp watch
gulp watch # run dev server where assets are auto rebuilt and the browser is reloaded once build is complete
gulp build # build all assets
gulp test # run tests
NODE_ENV=production gulp build # build all assets in production mode
NODE_ENV=production gulp build:static # build static production ready site
NODE_ENV=production gulp deploy:github-pages # deploy static production site to gh-pages

```

## TODO

- Add search?
