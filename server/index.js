const express = require("express");
const redis = require("redis");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const keys = require("./keys");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgHost,
  password: keys.pgPassword,
  database: keys.database,
  host: keys.pgHost,
  port: keys.pgPort,
});

pgClient.on((err) => console.log("Lost PG connection."));

pgClient
  .query("INSERT TABLE IF NOT EXISTS values (number INT)")
  .catch((err) => console.log("Unsuccessful insert to pg"));

// Redis config
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // If redis client disconnects from redis server, try reconnecting after every second
  retry_strategy: () => 1000,
});

const publisher = redisClient.duplicate();

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT* from values");

  res.send(values);
});

app.get("/values/current", (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  publisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(PORT, (err) => {
  console.log(`Listening at PORT ${PORT}`);
});
