const express = require("express");
const redis = require("redis");
const app = express();
const PORT = 8080;

const client = redis.createClient();
client.set("visits", 0);

app.get("/", (req, res) => {
  client.get("visits", (err, visits) => {
    res.send(`No. of visits is ${visits}`);
    client.set("visits", parseInt(visit, 10) + 1);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
