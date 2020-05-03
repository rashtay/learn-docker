const express = require("express");
const redis = require("redis");
const app = express();
const PORT = 8080;

const client = redis.createClient({
  // The docker image becomes the address of the redis server
  host: "redis-server",
  // Default port
  port: 6379,
});
client.set("visits", 0);

app.get("/", (req, res) => {
  client.get("visits", (err, visits) => {
    res.send(`No. of visits is ${visits}`);
    client.set("visits", parseInt(visits, 10) + 1);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
