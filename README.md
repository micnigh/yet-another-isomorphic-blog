# boilerplate-gulp-generic

Boilerplate gulp project meant to be a good starting point for any type of app.

## Quick start

```bash
git clone https://github.com/micnigh/boilerplate-gulp-generic new-awesome-project
cd new-awesome-project
rm -rf .git
git init .
git add -A
git commit -am "init commit"
npm install
npm install -g gulp # if not already installed globally

```

## tasks

```bash
gulp build # build all assets
gulp watch # run dev server where assets are auto rebuilt and the browser is reloaded once build is complete
gulp test # run tests
NODE_ENV=production gulp build # build all assets in production mode

```
