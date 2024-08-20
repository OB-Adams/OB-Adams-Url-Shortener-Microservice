require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const dns = require("dns");
const urlParser = require("url");
const crypto = require("crypto");
const app = express();

const port = process.env.PORT || 3000;
const mongo_url = process.env.MONGO_URL;

let urlCollection;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongo_url, {
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 50000,
    });
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("urlshortener");
    urlCollection = db.collection("urls");

    const defaultShortUrl = await urlCollection.findOne({ shorturl: "1" });
    if (!defaultShortUrl) {
      await urlCollection.insertOne({
        original_url: "https://github.com/OB-Adams",
        shorturl: "1",
      });
      console.log("Default document added!");
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectToMongoDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/dist"));

const generateShortId = () => {
  return crypto.randomBytes(2).toString("hex");
};

app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;

  if (!/^https?:\/\//i.test(url)) {
    url = "http://" + url;
  }

  const hostname = urlParser.parse(url).hostname;

  if (!hostname) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(hostname, async (err, address) => {
    if (!address) {
      return res.json({ error: "invalid url" });
    } else {
      const shorturl = generateShortId();
      const urlDoc = {
        original_url: url,
        shorturl: shorturl,
      };

      try {
        const result = await urlCollection.insertOne(urlDoc);
        console.log("Document inserted:", result);
        return res.json({ original_url: url, shorturl: shorturl });
      } catch (err) {
        return res.json({ error: "could not save URL", details: err });
      }
    }
  });
});

app.get("/api/shorturl/:shorturl?", async (req, res) => {
  const { shorturl } = req.params;

  if (!shorturl) {
    return res.json({ error: "enter shorturl" });
  }

  try {
    const urlEntry = await urlCollection.findOne({ shorturl: shorturl });
    if (!urlEntry) {
      return res.json({
        error: "short url not in database",
        shorturl: shorturl,
      });
    } else {
      return res.redirect(urlEntry.original_url);
    }
  } catch (err) {
    return res.json({ error: "database error", details: err });
  }
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
