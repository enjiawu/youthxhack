const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();

const uri = "mongodb+srv://ilovemcgriddless:z2aroq2dARlqFASQ@youthhack.ztat8.mongodb.net/";
const client = new MongoClient(uri);
const PORT = 3000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
    } catch (error) {
        console.error(error);
    }
}

connectToMongo().catch(console.error);

// Defining endpoints
app.get("/getTrafficObject/:url", async (req, res) => {
    try {
        // Decode the URL parameter
        const url = req.params.url;
        console.log('Requested URL:', url);

        // Fetch the document from MongoDB
        const result = await client.db("canITrustYou").collection('traffic').findOne({ url: url });

        if (result && result.totalVisit && result.totalVisit.monthly) {
            res.json(result.totalVisit.monthly);
        } else {
            res.status(404).json({ error: 'No data found for the given URL' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port 3000.');
});
