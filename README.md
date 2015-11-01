# yet-another-isomorphic-blog

Demo of isomorphic react blog.

[View a demo](https://micnigh.github.io/yet-another-isomorphic-blog/)

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
NODE_ENV=production gulp # run prod like server
NODE_ENV=production gulp build # build all assets in production mode
NODE_ENV=production gulp build:static # build static production ready site
NODE_ENV=production gulp deploy:github-pages # deploy static production site to gh-pages

```

## API

Simple read-only REST api based on [jsonapi](http://jsonapi.org/) and inspired from [twitter api](http://dev.twitter.com/rest/)

Designed to be publishable as a static website.  This adds some unusual restrictions, as the API must be converted to a flat file structure.  We must also reduce the API surface as much as possible, as each request maps to a file.

### Restrictions

 - Use file paths instead of query params
  - `/api/1.0/posts/list?page[2]` -> `/api/1.0/posts/list/page[2]`
 - alphabetical order of params for consistency

### File count

The number of api files is approximately `numPosts * numPageSizes * numTags * numSortTypes`.

### Usage

#### GET /api/1.0/posts/list

Returns list of posts, 10 posts at a time, sorted by post date.

Post data does not include content.

##### params

 - `page[number]=` - page cursor, default = 1
 - `page[size]=` - results per page, possible values = [2, 10, 100], default = 10
 - `filter[tag]=` - filter by tag
 - `sort=` - supports values ["date", "-date"]

##### examples

`GET /api/1.0/posts/list`

```json
{
  "data": [
    { "slug": "", "publishDate": "10/14/2015", "summary": "", "tags": [], },
    { "slug": "", "publishDate": "10/11/2015", "summary": "", "tags": [], },
    ...
  ],
  "meta": {
    "total-pages": "100",
  }
}
```

`GET /api/1.0/posts/list/filter[tag]=javascript`

```json
{
  "data": [
    { "slug": "", "publishDate": "10/14/2015", "summary": "", "tags": ["javascript"], },
    { "slug": "", "publishDate": "10/11/2015", "summary": "", "tags": ["javascript"], },
    ...
  ],
  "meta": {
    "total-pages": "10",
  }
}
```

#### GET /api/1.0/posts/slug/:slug

##### examples

`GET /api/1.0/posts/slug/second-post`

```json
{
  "data": {
    "slug": "second-post",
    "publishDate": "",
    "summary": "",
    "content": "",
    "tags": [""],
    "prevPost": {
      "slug": "first-post",
      "title": "",
    },
    "nextPost": {
      "slug": "third-post",
      "title": "",
    },
    ...
  }
}
```

## TODO

- Pull data in gradually rather than through JS
- Search
- Comment support (disqus?)
