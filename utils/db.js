class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const url = `mongodb://${host}:${port}/${database}`;

        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.db = null;

        this.connect();
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error; // Rethrow the error to be handled in the calling code
        }
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        try {
            const collection = this.db.collection('users');
            const count = await collection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            throw error;
        }
    }

    async nbFiles() {
        try {
            const collection = this.db.collection('files');
            const count = await collection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting files:', error);
            throw error;
        }
    }
}

const dbClient = new DBClient();

export default dbClient;
