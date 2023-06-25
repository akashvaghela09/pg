const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const { config } = require("../configs/config");
const { domain, axiosConfig } = config;
const fs = require("fs");
const { cleanTitlesPG } = require("../utils/filter");

const getTitleDetails = async (req, res) => {
    try {
        const response = await axios.get(`${domain}/title/tt4154796/parentalguide`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;

        let returnResponse = {};
        let parentalGuideData = [];

        // Scrap Nudiity Section
        let nuditySection = page.querySelector("#advisory-nudity");
        let nudity = cleanTitlesPG(nuditySection);
        parentalGuideData.push(nudity);

        // Scrap Violence Section
        let violenceSection = page.querySelector("#advisory-violence");
        let violence = cleanTitlesPG(violenceSection);
        parentalGuideData.push(violence);

        // Scrap Profanity Section
        let profanitySection = page.querySelector("#advisory-profanity");
        let profanity = cleanTitlesPG(profanitySection);
        parentalGuideData.push(profanity);

        // Scrap Alcohol Section
        let alcoholSection = page.querySelector("#advisory-alcohol");
        let alcohol = cleanTitlesPG(alcoholSection);
        parentalGuideData.push(alcohol);

        // Scrap Frightening Section
        let frighteningSection = page.querySelector("#advisory-frightening");
        let frightening = cleanTitlesPG(frighteningSection);
        parentalGuideData.push(frightening);

        returnResponse.parentalGuide = parentalGuideData;

        res.json({ data: returnResponse });
        return;
    } catch (error) {
        console.error("An error occurred:", error);

        res.status(500).json({
            message: "An error occurred",
            error: error
        });
    }
};

module.exports = {
    getTitleDetails,
};
