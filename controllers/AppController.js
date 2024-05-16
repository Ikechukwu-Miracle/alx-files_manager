import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  async getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).json(status);
  },

  async getStats(req, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    const stats = {
      users: nbUsers,
      files: nbFiles,
    };
    res.status(200).json(stats);
  },
};

export default AppController;
