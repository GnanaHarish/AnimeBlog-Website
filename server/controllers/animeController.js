require("../models/database");
const Category = require("../models/Category");
const Blog = require("../models/Blog");
//GET Homepage
exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);

        const blogs = await Blog.find({}).sort({ _id: -1 }).limit(limitNumber);
        const shounen = await Blog.find({ "categories": "SHOUNEN" }).limit(limitNumber);
        const action = await Blog.find({ "categories": "ACTION" }).limit(limitNumber);
        const josei = await Blog.find({ "categories": "JOSEI" }).limit(limitNumber);

        const blog = { blogs, shounen, action, josei };
        res.render('index', { title: 'AnimeWorld - Home', categories, blog });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }

}

//GET Categories
exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'AnimeWorld - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }

}

//GET Categories By Id
exports.exploreCategoriesById = async (req, res) => {
    try {
        const categoryName = req.params.name;
        const limitNumber = 20;
        const categoriesById = await Blog.find({ categories: categoryName }).limit(limitNumber);
        res.render('categories', { title: 'AnimeWorld - Categories', categoriesById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured While Getting Categories" });
    }
}


//GET Blog/:id
exports.exploreBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        res.render('blog', { title: 'AnimeWorld - ' + blog.name, blog });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }

}


//Seach
exports.searchBlog = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let blog = await Blog.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'AnimeWorld - Search', blog, searchedTerm: searchTerm })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in search" });
    }
}

//Explore Latest
exports.exploreLatest = async (req, res) => {
    try {
        const blogs = await Blog.find().limit(20).sort({ _id: -1 });
        res.render("explore", { blogs })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }
}


//Random Blog
exports.randomBlog = async (req, res) => {
    try {
        let count = await Blog.find().countDocuments();
        var random = Math.floor(Math.random() * count)
        const randomBlog = await Blog.findOne().skip(random).exec();
        res.render('random', { randomBlog });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }
}

//Create Blog : GET
exports.createBlog = async (req, res) => {
    try {
        const infoErrorObj = req.flash('infoErrors');
        const infoSucessObj = req.flash('infoSucess');
        const fileNotUpload = req.flash('fileNotUpload')
        res.render("create-blog", { title: 'AnimeWorld - Create Blog', infoErrorObj, infoSucessObj, fileNotUpload })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured in homepage" });
    }
}

//Create Blog : POST
exports.createBlogOnPost = async (req, res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            req.flash('fileNotUpload', "Please upload a image for your blog.");
            //res.redirect("/create-blog")
        }
        else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require("path").resolve("./") + '/public/uploads/' + newImageName;
            imageUploadFile.mv(uploadPath, function (err) {
                if (err) {
                    req.flash('fileNotUpload', "Error While Uploading Image");
                    console.log(err);
                }
            })
        }


        const newBlog = new Blog({
            name: req.body.name,
            description: req.body.description,
            username: req.body.usesrname,
            ratings: req.body.ratings,
            categories: req.body.category,
            image: newImageName
        })
        await newBlog.save();
        req.flash('infoSucess', 'Blog has been added successfully');
        res.redirect("/create-blog")
    } catch (error) {
        req.flash('infoErrors', error);
        res.redirect("/create-blog");
    }
}