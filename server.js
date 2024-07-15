// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // new
const morgan = require("morgan");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev"));

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Fruit = require("./models/fruit.js");


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
  });

// GET /
// app.get("/", async (req, res) => {
//     res.send("hello, friend!");
//   });
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  // POST /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
      } else {
        req.body.isReadyToEat = false;
      }
      await Fruit.create(req.body);
      res.redirect("/fruits");
    });

    app.get("/fruits", async(req, res) => {
        const allFruits = await Fruit.find();
        res.render('fruits/index.ejs', { fruits: allFruits })
        // res.send("Welcome to the index page!");
        // console.log(allFruits);
      });

      app.get("/fruits/:fruitId", async (req, res) => {
        const foundFruit = await Fruit.findById(req.params.fruitId);
        res.render("fruits/show.ejs", { fruit: foundFruit });
      });
      
      app.delete("/fruits/:fruitId", async (req, res) => {
        await Fruit.findByIdAndDelete(req.params.fruitId);
        res.redirect("/fruits");
      });
      
      app.get("/fruits/:fruitId/edit", async (req, res) => {
        const foundFruit = await Fruit.findById(req.params.fruitId);
        res.render("fruits/edit.ejs", {fruit: foundFruit,});
      });

      app.put("/fruits/:fruitId", async (req, res) => {
        // Handle the 'isReadyToEat' checkbox data
        if (req.body.isReadyToEat === "on") {
          req.body.isReadyToEat = true;
        } else {
          req.body.isReadyToEat = false;
        }
        
        // Update the fruit in the database
        await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
      
        // Redirect to the fruit's show page to see the updates
        res.redirect(`/fruits/${req.params.fruitId}`);
      });
      