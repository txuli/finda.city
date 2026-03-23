import mongoose from "mongoose"
import Redis from 'ioredis';
import { log } from "discord-logify";

const logger= new log()
const connection = mongoose.connect(process.env.DB_CONNECTION || "")
  .then(() => logger.Info("MongoDB connected"))
  .catch((err) => logger.Error(`MongoDB connection error, ${err}`));

export default connection 

export const redisClient = new Redis({
  host: 'redis',         // o el hostname del contenedor si estás en docker-compose
  port: 6379,
  password: process.env.REDIS_PASSWD,
  enableOfflineQueue: false, // opcional, pero recomendable para rate limiting
});

redisClient.on('connect', () => {
  logger.Info('Redis connected');
});

redisClient.on('error', (err) => {
  logger.Error(`Redis connection error: ${err}`);
});
