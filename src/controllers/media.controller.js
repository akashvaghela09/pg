const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const { config } = require("../configs/config");
const { domain, axiosConfig } = config;
const { cleanTitlesPG } = require("../utils/filter");

const getTitleDetails = async (req, res) => {
    try {
        let returnResponse = {};
        
        const response = await axios.get(`${domain}/title/tt4154796/parentalguide`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;
        
        // Parental Guide for Title without any spoilers
        let parentalGuideData = [];
        
        // Scrap Nudiity Section
        let nuditySection = page.querySelector("#advisory-nudity");
        if (nuditySection) {
            let nudity = cleanTitlesPG(nuditySection);
            parentalGuideData.push(nudity);
        }

        // Scrap Violence Section
        let violenceSection = page.querySelector("#advisory-violence");
        if (violenceSection) {
            let violence = cleanTitlesPG(violenceSection);
            parentalGuideData.push(violence);
        }

        // Scrap Profanity Section
        let profanitySection = page.querySelector("#advisory-profanity");
        if (profanitySection) {
            let profanity = cleanTitlesPG(profanitySection);
            parentalGuideData.push(profanity);
        }

        // Scrap Alcohol Section
        let alcoholSection = page.querySelector("#advisory-alcohol");
        if (alcoholSection) {
            let alcohol = cleanTitlesPG(alcoholSection);
            parentalGuideData.push(alcohol);
        }

        // Scrap Frightening Section
        let frighteningSection = page.querySelector("#advisory-frightening");
        if (frighteningSection) {
            let frightening = cleanTitlesPG(frighteningSection);
            parentalGuideData.push(frightening);
        }

        // Parental Guide for Title with spoilers
        let parentalGuideSpoilersData = [];

        // Scrap Nudiity Spoilers Section
        let nuditySSection = page.querySelector("#advisory-spoiler-nudity");
        if (nuditySSection) {
            let nuditySS = cleanTitlesPG(nuditySSection);
            parentalGuideSpoilersData.push(nuditySS);
        }

        // Scrap Violence Spoilers Section
        let violenceSSection = page.querySelector("#advisory-spoiler-violence");
        if (violenceSSection) {
            let violenceSS = cleanTitlesPG(violenceSSection);
            parentalGuideSpoilersData.push(violenceSS);
        }

        // Scrap Profanity Spoilers Section
        let profanitySSection = page.querySelector("#advisory-spoiler-profanity");
        if (profanitySSection) {
            let profanitySS = cleanTitlesPG(profanitySSection);
            parentalGuideSpoilersData.push(profanitySS);
        }

        // Scrap Alcohol Spoilers Section
        let alcoholSSection = page.querySelector("#advisory-spoiler-alcohol");
        if (alcoholSSection) {
            let alcoholSS = cleanTitlesPG(alcoholSSection);
            parentalGuideSpoilersData.push(alcoholSS);
        }

        // Scrap Frightening Spoilers Section
        let frighteningSSection = page.querySelector("#advisory-spoiler-frightening");
        if (frighteningSSection) {
            let frighteningSS = cleanTitlesPG(frighteningSSection);
            parentalGuideSpoilersData.push(frighteningSS);
        }

        returnResponse.parentalGuide = parentalGuideData;
        returnResponse.parentalGuideWithSpoilers = parentalGuideSpoilersData;

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
