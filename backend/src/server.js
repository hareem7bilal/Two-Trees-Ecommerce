const express = require("express");
import { MongoClient } from "mongodb";

async function start() {
  const url = `mongodb+srv://hareem7bilal:test@cluster0.xkgyen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);

  const app = express();
  app.use(express.json());

  await client.connect();
  const db = client.db("fsv-db");

  app.get("/hello", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  app.get("/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
    //res.json(products);
  });

  async function populateCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  app.get("/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  app.post("/users/:userId/cart", async (req, res) => {
    const productId = req.body.id;
    const userId= req.params.userId;
    await db.collection("users").updateOne(
      { id: userId },
      {
        //$push: {cartItems: productId}
        $addToSet: { cartItems: productId },
      }
    );
    const user = await db
      .collection("users")
      .findOne({ id: userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  app.delete("/users/:userId/cart/:productId", async (req, res) => {
    const productId = req.params.productId;
    const userId= req.params.userId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        //$push: {cartItems: productId}
        $pull: { cartItems: productId },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
    
  });

  app.listen(8000, () => {
    console.log("Server is listening on port 8000");
  });
}

start();
