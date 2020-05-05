const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // If redis client disconnects from redis server, try reconnecting after every second
  retry_strategy: () => 1000,
});

const fib = (index) => {
  if (index < 2) return 1;

  return fib(index - 1) + fib(index - 2);
};

const subscription = redisClient.duplicate();

subscription.on = (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message, 10)));
};

// Subscribe to any insert event happening in redis
subscription.subscribe("insert");
