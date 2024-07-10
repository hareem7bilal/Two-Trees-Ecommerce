const express = require("express");
const path = require("path");
import { MongoClient } from "mongodb";

async function start() {
  const url = `mongodb+srv://hareem7bilal:test@cluster0.xkgyen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);

  const app = express();
  app.use(express.json());
  //app.use('/images', express.static(path.join(__dirname, '../assets')));

  // Log the path to ensure it is correct
  const assetsPath = path.join(__dirname, "../assets");
  console.log("Serving static files from:", assetsPath);

  // Check if the assets directory exists
  const fs = require("fs");
  if (fs.existsSync(assetsPath)) {
    console.log("Assets directory exists.");
  } else {
    console.log("Assets directory does not exist.");
  }

  app.use("/images", express.static(assetsPath));

  await client.connect();
  const db = client.db("fsv-db");

  app.get("/api/hello", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  app.get("/api/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
    //res.json(products);
  });

  async function populateCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("/api/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  app.post("/api/users/:userId/cart", async (req, res) => {
    const productId = req.body.id;
    const userId = req.params.userId;

    const existingUser = await db.collection("users").findOne({ id: userId });
    if (!existingUser) {
      await db.collection("users").insertOne({ id: userId, cartItems: [] });
    }
    await db.collection("users").updateOne(
      { id: userId },
      {
        //$push: {cartItems: productId}
        $addToSet: { cartItems: productId },
      }
    );
    const user = await db.collection("users").findOne({ id: userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        //$push: {cartItems: productId}
        $pull: { cartItems: productId },
      }
    );

    const user = await db.collection("users").findOne({ id: userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.listen(8000, () => {
    console.log("Server is listening on port 8000");
  });
}

start();
