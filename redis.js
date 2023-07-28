const redis = require("redis");
const redisClient = redis.createClient();

// Optional: Add event listeners to handle errors and monitor the Redis connection
redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});
redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

module.exports = redisClient;
