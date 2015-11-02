export default [
  { path: "api/1.0/posts/list/", methods: require("./1.0/posts/list").methods },
  { path: "api/1.0/posts/slug/:slug/", methods: require("./1.0/posts/slug").methods },
];
