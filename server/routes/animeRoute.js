const express = require("express");
const route = express.Router();
const animeController = require("../controllers/animeController");

route.get("/", animeController.homepage);
route.get("/categories", animeController.exploreCategories);
route.get("/categories/:name", animeController.exploreCategoriesById);
route.get("/blogs/:id", animeController.exploreBlog);
route.post("/search", animeController.searchBlog);
route.get("/explore-latest", animeController.exploreLatest);
route.get("/random-blog", animeController.randomBlog);
route.get("/create-blog", animeController.createBlog);
route.post("/create-blog", animeController.createBlogOnPost);


module.exports = route;