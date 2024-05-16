import redis from 'redis';
import { promisify } from 'util';


class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.client.on('error', (err) => {
            console.log(`${err}`);
        });

        this.getAsync = promisify(this.client.get).bind(this.client);
    }

    isAlive() {
        return this.client.connected;
    }


    async get(key) {
        try {
            return await this.getAsync(key);
        } catch (error) {
            console.error('Error getting value from Redis:', error);
            throw error;
        }
    }

    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;
