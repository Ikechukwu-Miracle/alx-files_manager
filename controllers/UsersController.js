import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import sha1 from 'sha1';

const UsersController = {
    async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const userExists = await dbClient.db.collection('users').findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password);

        const newUser = {
            email,
            password: hashedPassword,
            _id: uuidv4(),
        };

        try {
            await dbClient.db.collection('users').insertOne(newUser);
            res.status(201).json({ id: newUser._id, email: newUser.email });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getMe(req, res) {
        const token = req.headers['x-token'];
    
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
    
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const user = await dbClient.db.collection('users').findOne({ _id: userId });
    
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        res.status(200).json({ id: user._id, email: user.email });
    },
};

export default UsersController;
