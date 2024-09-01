//Run node server.js

const express = require('express');
const https = require('https');
const tls = require('tls');
const url = require('url');
const { MongoClient } = require('mongodb');
const cors = require('cors');


const app = express();
const port = 5050;
app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from this origin
  }));

app.use(express.json());

//Function to get Upvotes/Downvotes
const mongoDbPassword = process.env.MONGODB;
const uri = "mongodb+srv://ilovemcgriddless:z2aroq2dARlqFASQ@youthhack.ztat8.mongodb.net/";

async function createConnection(dbName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
}

async function fetchLikesDislikes(database, targetUrl) {
    try {
        const collection = database.collection('likes');
        let foundObject = await collection.findOne({ "url": targetUrl });
        if (!foundObject) {
            return { likes: 0, dislikes: 0 };
        } else {
            return { likes: foundObject.likes, dislikes: foundObject.dislikes };
        }
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching likes and dislikes');
    }
}

async function upvote(database, targetUrl) {
    try {
        const collection = database.collection('likes');
        const result = await collection.updateOne(
            { url: targetUrl },
            { $inc: { likes: 1 } }
        );
        if (result.matchedCount === 0) {
            // If no document matched the query, create a new one
            await collection.insertOne({ url: targetUrl, likes: 1, dislikes: 0 });
        }
    } catch (err) {
        console.error(err);
        throw new Error('Error upvoting');
    }
}

async function downvote(database, targetUrl) {
    try {
        const collection = database.collection('likes');
        const result = await collection.updateOne(
            { url: targetUrl },
            { $inc: { dislikes: 1 } }
        );
        if (result.matchedCount === 0) {
            // If no document matched the query, create a new one
            await collection.insertOne({ url: targetUrl, likes: 0, dislikes: 1 });
        }
    } catch (err) {
        console.error(err);
        throw new Error('Error downvoting');
    }
}

app.get('/api/likes-dislikes', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); // Replace with your database name
        const result = await fetchLikesDislikes(db, targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upvote', async (req, res) => {
    console.log("CALLED")
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou');
        await upvote(db, url);
        await client.close();
        res.status(200).json({ message: 'Upvote successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/downvote', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou');
        await downvote(db, url);
        await client.close();
        res.status(200).json({ message: 'Downvote successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Function to get SSL certificate
function getSSLCertificate(targetUrl) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(targetUrl);
        const options = {
            host: parsedUrl.hostname,
            port: 443,
            method: 'GET',
            rejectUnauthorized: false,
        };

        const req = https.request(options, (res) => {
            const certificate = res.connection.getPeerCertificate();
            if (certificate) {
                resolve(certificate);
            } else {
                reject('No certificate found');
            }
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

// API endpoint to analyze SSL certificate for a given URL
app.get('/api/ssl-cert', async (req, res) => {
    const { url: targetUrl } = req.query; // Extract URL from query parameters

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const certificate = await getSSLCertificate(targetUrl);
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching SSL certificate info' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});