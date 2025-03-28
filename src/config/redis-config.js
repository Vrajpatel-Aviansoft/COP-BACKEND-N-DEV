const Redis = require('ioredis');

const redisUrl = process.env.COP_REDIS_URL;
const token = redisUrl.split(':')[2].split('@')[0];


const redis = new Redis(redisUrl, {
  password: token,
});

// redis.set('key', 'value');
// redis.get('key', (err, result) => {
//   console.log(result); // Output: value
// });
