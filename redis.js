const redis = require('ioredis')

const redisClient = new redis({ lazyConnect: true })

module.exports = redisClient