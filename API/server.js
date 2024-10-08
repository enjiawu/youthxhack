//Run node server.js

const express = require('express');
const https = require('https');
const tls = require('tls');
const url = require('url');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const port = 5050;
app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from this origin
  }));

app.use(express.json());

const mongoDbPassword = process.env.MONGODB;
const uri = "mongodb+srv://ilovemcgriddless:z2aroq2dARlqFASQ@youthhack.ztat8.mongodb.net/";

async function createConnection(dbName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
}

async function fetchSSLData(database, targetUrl) {
    try {
        const collection = database.collection('ssl'); // Collection name: 'ssl'
        const result = await collection.findOne({ url: targetUrl });
        return result || null; // Return the result if found, otherwise return null
    } catch (err) {
        console.error('Error fetching SSL data:', err);
        throw new Error('Error fetching SSL data');
    }
}

async function insertSslData(database, sslData) {
    try {
        const collection = database.collection('ssl');
        const result = await collection.insertOne(sslData);
        return result.insertedId;
    } catch (err) {
        console.error('Error inserting SSL data:', err);
        throw new Error('Error inserting SSL data');
    }
}

//Function to get Upvotes/Downvotes
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

async function fetchTrafficData(database, targetUrl) {
    console.log('Fetching traffic data for URL:', targetUrl); // Debugging line
    try {
        const collection = database.collection('traffic');
        const result = await collection.findOne({ url: targetUrl });
        return result ? result.totalVisit : null;
    } catch (err) {
        console.error('Error:', err);
        throw new Error('Error fetching traffic data');
    }
}


async function fetchVisitDuration(database,targetUrl){
    try{
        const collection = database.collection('traffic');
        const result = await collection.findOne({ url: targetUrl });
        return result ? result.averageVisitDurationInMin : null;
    }catch(error){
        console.error(err);
        throw new Error('Error fetching visit duration');
    }
}

async function fetchPagesPerVisit(database,targetUrl){
    try{
        const collection = database.collection('traffic');
        const result = await collection.findOne({ url: targetUrl });
        return result ? result.pagesPerVisit : null;
    }catch(error){
        console.error(err);
        throw new Error('Error fetching pages per visit');
    }
}

async function fetchBounceRate(database,targetUrl){
    try{
        const collection = database.collection('traffic');
        const result = await collection.findOne({ url: targetUrl });
        return result ? result.bounceRate : null;
    }catch(error){
        console.error(err);
        throw new Error('Error fetching bounce rate');
    }
}

async function fetchOriginOfUsers(database,targetUrl){
    try{
        const collection = database.collection('traffic');
        const result = await collection.findOne({ url: targetUrl });
        return result ? result.originOfUsers : null;
    }catch(error){
        console.error(err);
        throw new Error('Error fetching origin of users');
    }
}

async function fetchAllURLs(database) {
    try {
        // Access the collection
        const collection = database.collection('likes');

        // Find all documents
        const results = await collection.find({}).toArray();

        // Extract the URL from each document
        const urls = results.map(result => result.url);
        console.log(results);
        return results;
    } catch (error) {
        console.error('Error fetching URLs:', error);
        throw new Error('Error fetching URLs from database');
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

app.get("/getTrafficObject", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchTrafficData(db,targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getVisitDuration", async(req,res) =>{
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchVisitDuration(db,targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

app.get("/getPagesPerVisit", async(req,res) =>{
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchPagesPerVisit(db,targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

app.get("/getBounceRate", async(req,res) =>{
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchBounceRate(db,targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

app.get("/getOriginOfUsers", async(req,res) =>{
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchOriginOfUsers(db,targetUrl);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

app.get("/getURLs", async(req,res) =>{
    try {
        const { db, client } = await createConnection('canITrustYou'); 
        const result = await fetchAllURLs(db);
        await client.close();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

app.post('/api/upvote', async (req, res) => {
    console.log("CALLED")
    const { url } = req.body;
    const ipAddress = req.ipAddress;

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

app.get('/api/ssl-data', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const { db, client } = await createConnection('canITrustYou');
        const sslData = await fetchSSLData(db, targetUrl);
        await client.close();
        if (sslData) {
            res.json(sslData);
        } else {
            res.status(404).json({ error: 'SSL data not found for the given URL' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ssl-data', async (req, res) => {
    const { url, issuer, valid_from, valid_to } = req.body;

    if (!url || !issuer || !valid_from || !valid_to) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const { db, client } = await createConnection('canITrustYou');
        const sslData = {
            url,
            issuer: {
                O: issuer.O,
                C: issuer.C
            },
            valid_from,
            valid_to
        };

        const insertedId = await insertSslData(db, sslData);
        await client.close();
        res.status(201).json({ message: 'SSL data inserted successfully', id: insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function checkIfUrlIsBlocked(url) {
    console.log("URL CHECKED ", url);
    // Example logic
    const blockedUrls = ['https://www.malicious.com/', 'https://www.phishing.com/'];
    return blockedUrls.includes(url);
}

app.get('/api/check-url', async (req, res) => {
    const { url } = req.query;
    // Perform your logic to determine if the URL is safe
    // For example, you can check it against a list of unsafe URLs in your database
    const isBlocked = await checkIfUrlIsBlocked(url);
    console.log("IS IT BLOCKED? ", isBlocked);

    res.json({ block: isBlocked });
});

const GOOGLE_SAFE_API_KEY = 'AIzaSyByeLBjadSQnJ7AdU5SIcV7ZBKZwRu0eCk';
const GOOGLE_SAFE_API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_API_KEY}`;

// Function to check if a website is safe using Google Safe Browsing API
const checkGoogleSafeBrowsing = async (url) => {
    try {
        const response = await axios.post(GOOGLE_SAFE_API_URL, {
            client: {
                clientId: 'legit_anot',
                clientVersion: '1.0.0',
            },
            threatInfo: {
                threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
                platformTypes: ['ANY_PLATFORM'],
                threatEntryTypes: ['URL'],
                threatEntries: [{ url }],
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error checking website safety:', error);
        throw error;
    }
};


// API endpoint to check if a website is safe
app.post('/api/check-safe', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Received URL:', url); // Log the URL to ensure it's what you expect

    try {
        const result = await checkGoogleSafeBrowsing(url);

        const hasThreats = result.matches && result.matches.length > 0;

        res.json({
            hasThreats,
            threats: result.matches || [],
        });
    } catch (error) {
        console.error('Error checking website safety:', error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware to log IP addresses
app.use((req, res, next) => {
    req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('User IP Address:', req.ipAddress);
    next();
});

// Route to return the IP address
app.get('/api/ip-address', (req, res) => {
    if (req.ipAddress) {
        res.json({ ip: req.ipAddress });
    } else {
        res.status(404).json({ error: 'IP address not found' });
    }
});

async function checkedData(database, targetUrl, ipAddress) {
    try {
        const collection = database.collection('traffic');
        
        // Calculate the average number of checks across all URLs
        const allUrls = await collection.find({}).toArray();
        const totalChecks = allUrls.reduce((acc, item) => acc + item.checks.length, 0);
        const averageChecks = allUrls.length > 0 ? totalChecks / allUrls.length : 0;

        const result = await collection.findOne({ url: targetUrl });

        if (result) {
            const alreadyChecked = result.checks.includes(ipAddress);
            const checksCount = result.checks.length;

            if (alreadyChecked) {
                // URL already checked by this IP address
                return { message: 'URL already checked by this IP address', checksCount, averageChecks };
            } else {
                // Add the new IP address to the checks array
                await collection.updateOne(
                    { url: targetUrl },
                    { $addToSet: { checks: ipAddress } }
                );

                return { message: 'URL added to checks', checksCount: checksCount + 1, averageChecks };
            }
        } else {
            // If the URL is not found, return message and averageChecks
            return { message: 'URL not found in the database', checksCount: 0, averageChecks };
        }
    } catch (error) {
        console.error('Error in checkedData function:', error);
        throw new Error('Error checking URL');
    }
}

app.get('/api/checked', async (req, res) => {
    const { url } = req.query;
    const ipAddress = req.ip;  // Get the IP address

    console.log('URL:', url); // Debugging line
    console.log('IP Address:', ipAddress); // Debugging line

    if (!url || !ipAddress) {
        return res.status(400).json({ error: 'URL parameter and ipAddress are needed' });
    }

    try {
        const { db, client } = await createConnection('canITrustYou');
        const checkStatus = await checkedData(db, url, ipAddress);
        await client.close();

        if (checkStatus.message === 'URL not found in the database') {
            res.status(404).json({ error: checkStatus.message, averageChecks: checkStatus.averageChecks });
        } else {
            const alreadyChecked = checkStatus.message === 'URL already checked by this IP address';
            res.json({ 
                checked: alreadyChecked, 
                message: checkStatus.message, 
                checkCount: checkStatus.checksCount,
                averageChecks: checkStatus.averageChecks
            });
        }
    } catch (error) {
        console.error('Error in /api/checked route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});