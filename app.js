const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const postsFile = path.join(__dirname, "posts.json");

// Read posts.json
const getPosts = () => {
    try {
        const data = fs.readFileSync(postsFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write posts.json
const savePosts = (posts) => {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf8");
};

// Route to display all posts
app.get("/posts", (req, res) => {
    const posts = getPosts();
    res.render("home", { posts });
});

// Route to display a single post by ID
app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to render the add post form
app.get("/add-post", (req, res) => {
    res.render("addPost");
});

// Route to handle adding a new post
app.post("/add-post", (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect("/posts");
});

// Initialize sample posts.json
const initialPosts = [
    {
        "id": 1,
        "title": "First Blog Post",
        "content": "This is the content of the first post."
    },
    {
        "id": 2,
        "title": "Second Blog Post",
        "content": "This is the content of the second post."
    }
];
if (!fs.existsSync(postsFile)) {
    savePosts(initialPosts);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
