import mongoose from "mongoose"
import Redis from 'ioredis';
const connection = mongoose.connect(process.env.DB_CONNECTION || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

export default connection 

export const redisClient = new Redis({
  host: '127.0.0.1',         // o el hostname del contenedor si estás en docker-compose
  port: 26739,
  password: process.env.REDIS_PASSWD,
  enableOfflineQueue: false, // opcional, pero recomendable para rate limiting
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});
