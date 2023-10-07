import express from "express";
import fs from "fs";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 8080;
const apiKey = JSON.parse(fs.readFileSync('key.json', 'utf-8')).key;
const baseURL = "https://bhagavad-gita3.p.rapidapi.com/v2";
const config = {
    headers: {
        'X-RapidAPI-Key': apiKey
    }
};
let newURL = "";
let searchData = {};
let result;

const getSearchData = (req, res, next) => {
    searchData.chapter = req.body.chapter;
    searchData.verse = req.body.verse;
    // console.log(searchData);
    next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(getSearchData);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/search", async (req, res) => {
    if(searchData.chapter != '' && searchData.verse != '') {
        console.log('.................................................................');
        console.log('1');
        newURL = `${baseURL}/chapters/${searchData.chapter}/verses/${searchData.verse}/`;
        try {
            const response = await axios.get(newURL, config);
            result = response.data;
            // console.log(result);
            res.render("chapterverse.ejs", { data: JSON.stringify(result) });
        } catch(error) {
            console.error("Unable to make request: ", error.message);
            res.render("error.ejs", { error: JSON.stringify(error.message) });
        }
    } else if(searchData.chapter != '' && searchData.verse == '') {
        console.log('.................................................................');
        console.log('2');
        newURL = `${baseURL}/chapters/${searchData.chapter}/`;
        try {
            const response = await axios.get(newURL, config);
            result = response.data;
            // console.log(result);
            res.render("chapter.ejs", { data: JSON.stringify(result) });
        } catch(error) {
            console.error("Unable to make request: ", error.message);
            res.render("error.ejs", { error: JSON.stringify(error.message) });
        }
    } else if(searchData.chapter == '' && searchData.verse != '') {
        console.log('.................................................................');
        console.log('3');
        console.error("Please enter chapter number also.");
        res.render("error.ejs", { error: JSON.stringify("Please enter chapter number also.") });
    } else if(searchData.chapter == '' && searchData.verse == '') {
        console.log('.................................................................');
        console.log('4');
        newURL = `${baseURL}/chapters/`;
        try {
            const response = await axios.get(newURL, config);
            result = response.data;
            // console.log(result);
            res.render("noinput.ejs", { data: JSON.stringify(result) });
        } catch(error) {
            console.error("Unable to make request: ", error.message);
            res.render("error.ejs", { error: JSON.stringify(error.message) });
        }
    }
});

app.listen(port, () => {
    console.log(`Listening to port: ${port}.`);
});