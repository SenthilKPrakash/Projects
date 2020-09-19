require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = {
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
};

const Post = mongoose.model("Post", postSchema);

const defaultHomePost = new Post({
  title: "Welcome",
  body: homeStartingContent
});

app.get("/", function (req, res) {
  Post.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Post.insertMany(defaultHomePost, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
    } else {
      res.render("home", { home: homeStartingContent, copyMessages: foundItems });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/remove", function (req, res) {
  res.render("remove");
});

app.get("/post/:id", function (req, res) {

  let requestedTopic = req.params.id;

  Post.findOne({ _id: requestedTopic }, function (err, foundTopic) {
    if (!err) {
      res.render("post", { topic: foundTopic.title, body: foundTopic.body });
    }
  });
});

app.post("/compose", function (req, res) {
  const title = req.body.titleMessage;
  const body = req.body.bodyMessage;

  const insertPost = new Post({
    title: title,
    body: body
  });

  insertPost.save();
  res.redirect("/");
});

app.post("/remove", function (req, res) {
  const title = req.body.titleMessage;
  Post.deleteOne({ title: title }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successful deletion");
    }
  });

  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port successfully");
});
