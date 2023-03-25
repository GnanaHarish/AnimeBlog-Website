const express = require("express");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");


const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(cookieParser("AnimeBlogSecure"));
app.use(session({
    secret: "AnimeBlogSecure",
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set("view engine", "ejs");
const route = require("./server/routes/animeRoute.js");
app.use("/", route);



app.listen(process.env.PORT || 8080, () => {
    console.log("Server is up and running");
})