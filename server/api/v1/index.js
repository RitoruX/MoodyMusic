require('dotenv').config()

const router = require('express').Router();
const axios = require('axios');
const { json } = require('express');
const mongoose = require('mongoose');

const API_KEY = process.env.API_KEY;
const SPREAD_URL = `https://sheets.googleapis.com/v4/spreadsheets/19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU/values/A:Z?key=${API_KEY}`;
const MONGODB_URL = process.env.MONGODB_URL;

var users_music = new Map();
var moody_music = new Map();

router.get('/user_music', async(req, res) => {
    const response = await axios.get(SPREAD_URL);
    const spreadsheet_data = response.data.values;
    for (const item of spreadsheet_data.slice(1)) {
        if (users_music.has(item[6])) {
            users_music.get(item[6]).push(item[7]);
        } else {
            users_music.set(item[6], new Array(item[7]));
        }
    }
    res.status(200).json(Object.fromEntries(users_music));
});

router.get('/mood_music', async(req, res) => {
    const spread_response = await axios.get(SPREAD_URL);
    const spreadsheet_data = spread_response.data.values;
    for (const item of spreadsheet_data.slice(1)) {
        var music_request = await axios.get(encodeURI(`https://api.mixcloud.com/search/?q=${item[7]}&type=cloudcast`))
        var music_info = music_request.data
        if (music_info.data.length > 0) {
            for (const info of music_info.data) {
                if (info.tags.length < 0) { moody_music.set(item[6], new Array()); }
                for (const tag of info.tags) {
                    console.log(tag.name);
                    if (moody_music.has(item[6])) {
                        moody_music.get(item[6]).push(tag.name);
                    } else {
                        moody_music.set(item[6], new Array(tag.name));
                    }
                }
            }
        }
    }
    res.status(200).json(Object.fromEntries(moody_music));
});

module.exports = router;