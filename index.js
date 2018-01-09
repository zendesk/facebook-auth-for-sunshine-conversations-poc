'use strict';

require('dotenv').config();

const axios = require('axios');
const Smooch = require('smooch-core');
const express = require('express');
const bodyParser = require('body-parser');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const SMOOCH_ACCOUNT_KEY_ID = process.env.SMOOCH_ACCOUNT_KEY_ID;
const SMOOCH_ACCOUNT_SECRET = process.env.SMOOCH_ACCOUNT_SECRET;
const PORT = process.env.PORT;

const smooch = new Smooch({
    scope: 'account',
    keyId: SMOOCH_ACCOUNT_KEY_ID,
    secret: SMOOCH_ACCOUNT_SECRET
});

express()
    .use(express.static('public'))
    .use(bodyParser.json())
    .get('/facebook_app_id', (req, res) => {
        res.json({ facebookAppId: FACEBOOK_APP_ID });
    })
    .get('/integrate', (req, res) => {
        const smoochAppId = req.query.id;
        const accessToken = req.query.token;
        smooch.integrations.create(smoochAppId, {
            type: 'messenger',
            pageAccessToken: accessToken,
            appId: FACEBOOK_APP_ID,
            appSecret: FACEBOOK_APP_SECRET
        })
            .then((data) => res.json(data))
            .catch((error) => res.status(400).json({ error: {
                code: error.code,
                message: error.message
            }}));
    })
    .get('/token', async function(req, res) {
        const nonExpiringToken = await getNonExpiringToken(req.query.userAccessToken);
        const data = await getPagesWithTokens(nonExpiringToken);
        res.json(data);
    })
    .listen(PORT, () => console.log('Service running on port', PORT));

async function getNonExpiringToken(userAccessToken) {
    const url = `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${userAccessToken}`
    const response = await axios.get(url);
    return response.data.access_token;
}

async function getPagesWithTokens(userAccessToken) {
    const url = `https://graph.facebook.com/me/accounts?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&access_token=${userAccessToken}&limit=500`
    const response = await axios.get(url);
    return response.data;
}