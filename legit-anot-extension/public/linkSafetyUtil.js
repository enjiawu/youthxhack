async function getSafetyScore(url) {
    const state = {
        link: '',
        totalVisits: {},
        visitDuration: {},
        pagesPerVisit: {},
        bounceRate: {},
        originOfUsers: {},
        error: null,
        isSubmitted: false,
        isVoted: false,
        totalVotes: 0,
        communityRating: 0,
        barColor: '#FF0000',
        issuer: 'NA',
        hasThreats: false,
        safetyRating: 'Unknown',
        overallRating: 0,
        checks: 0,
        valid_from: 'NA',
        valid_to: 'NA'
    };

    const hasThreats = () => {
        state.hasThreats = true;
    };

    const clearThreats = () => {
        state.hasThreats = false;
    };

    const fetchGoogleSafeBrowsing = async (url) => {
        try {
            const response = await fetch('http://localhost:5050/api/check-safe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: normalizeURL(url) }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const threatsFound = data.hasThreats;

            if (threatsFound) {
                hasThreats();
            } else {
                clearThreats();
            }

            if (!state.hasThreats) {
                state.overallRating += 10;
            }
        } catch (error) {
            console.error('Error checking website safety:', error);
            clearThreats();
        }
    };

    const analyzeUrl = async (url) => {
        const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `based on these factors analyze the safety and legitimacy of this url, ${url}, give me a rating low/medium/high in terms of safety and legitimacy...`;
        const result = await model.generateContent(prompt);
        const rating = await result.response.text().toLowerCase();
        const safetyRating = rating.includes('low') ? 'Low!!' : rating.includes('medium') ? 'Medium!' : rating.includes('high') ? 'High' : 'Unknown';
        state.safetyRating = safetyRating;

        if (state.safetyRating === "High") {
            state.overallRating += 20;
        } else if (state.safetyRating === "Medium!") {
            state.overallRating += 10;
        }
    };

    const fetchSslCert = async (url) => {
        url = normalizeURL(url);

        try {
            const response1 = await fetch(`http://localhost:5050/api/ssl-data?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response1.json();
            state.issuer = data.issuer.O;
            state.valid_from = data.valid_from.slice(0, 6) + data.valid_from.slice(15, 20);
            state.valid_to = data.valid_to.slice(0, 6) + data.valid_to.slice(15, 20);

            if (state.issuer === 'NA') {
                console.log("No SSL certificate found");
            } else if (trustedProviders.includes(state.issuer)) {
                state.overallRating += 25;
            } else {
                state.overallRating += 12.5;
            }

            if (response1.ok) {
                state.issuer = data.issuer.O;
                state.valid_from = data.valid_from;
                state.valid_to = data.valid_to;
            } else {
                const response2 = await fetch(`http://localhost:5050/api/ssl-cert?url=${encodeURIComponent(url)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response2.ok) throw new Error('Network response was not ok');

                const sslCertData = await response2.json();
                state.issuer = sslCertData.issuer.O;
                state.valid_from = sslCertData.valid_from;
                state.valid_to = sslCertData.valid_to;

                const postResponse = await fetch(`http://localhost:5050/api/ssl-data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: url,
                        issuer: sslCertData.issuer.O,
                        valid_from: sslCertData.valid_from,
                        valid_to: sslCertData.valid_to,
                    })
                });

                if (!postResponse.ok) {
                    console.error('Failed to save SSL data to collection');
                }
            }
        } catch (error) {
            console.error('Error fetching SSL cert:', error);
        } finally {
            console.log(state.issuer);
        }
    };

    function normalizeURL(url) {
        return url;
    }

    const trustedProviders = [
        'Amazon', 'DigiCert', 'Comodo', 'GlobalSign', 'Let\'s Encrypt',
        'Symantec', 'GeoTrust', 'Thawte', 'RapidSSL', 'Entrust', 'GoDaddy',
        'SSL.com', 'Actalis', 'Certum', 'Trustwave', 'VeriSign', 'QuoVadis',
        'Starfield', 'WoSign', 'SECTIGO', 'Google Trust Services'
    ];

    await fetchGoogleSafeBrowsing(url);
    await analyzeUrl(url);
    await fetchSslCert(url);

    return state.overallRating;
}
