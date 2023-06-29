const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const { config } = require("../configs/config");
const { domain, axiosConfig } = config;
const { cleanTitlesPG, cleanCertificationList } = require("../utils/filter");
const fs = require("fs");

const getMetaData = async (titleId) => {
    try {
        let returnResponse = {};

        const response = await axios.get(`${domain}/title/${titleId}`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;

        const h1Element = page.querySelector('h1[data-testid="hero__pageTitle"]');
        const title = h1Element?.textContent;

        const plotSection = page.querySelector("span[data-testid='plot-xl']");
        const plot = plotSection?.textContent;

        const directorSection = page.querySelector(".ipc-metadata-list.ipc-metadata-list--dividers-all.title-pc-list.ipc-metadata-list--baseAlt");

        if (directorSection) {
            const liElements = directorSection.querySelectorAll('li.ipc-metadata-list__item');

            const directors = [];
            const writers = [];
            const stars = [];

            liElements.forEach(li => {
                const label = li.querySelector('.ipc-metadata-list-item__label');
                const nameLinks = li.querySelectorAll('.ipc-metadata-list-item__list-content-item');

                if (label && nameLinks.length > 0) {
                    const labelText = label.textContent.trim();
                    const names = Array.from(nameLinks, link => link.textContent.trim());

                    if (labelText === 'Director' || labelText === 'Directors') {
                        directors.push(...names);
                    } else if (labelText === 'Writer' || labelText === 'Writers') {
                        writers.push(...names);
                    } else if (labelText === 'Stars') {
                        stars.push(...names);
                    }
                }
            });

            returnResponse.directors = directors;
            returnResponse.writers = writers;
            returnResponse.stars = stars;
        } else {
            console.log('The <ul> element was not found.');
        }

        returnResponse.title = title;
        returnResponse.plot = plot;
        return returnResponse;
    } catch (error) {
        console.error("An error occurred:", error);

        res.status(500).json({
            message: "An error occurred",
            error: error
        });
    }
};

const getTitleDetails = async (req, res) => {
    try {
        const titleId = req.params.id;
        let returnResponse = {};

        let metaDataRes = await getMetaData(titleId);
        returnResponse = { ...returnResponse, ...metaDataRes }

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

const getPGDetails = async (req, res) => {
    try {
        const titleId = req.params.id;
        let returnResponse = {};

        const response = await axios.get(`${domain}/title/${titleId}/parentalguide`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;

        // Scrap certification
        let certification = {};
        let certiSection = page.querySelector("#mpaa-rating");
        let certiString = certiSection.querySelectorAll("td")[1].textContent.trim();
        certification.info = certiString;

        // Use a regular expression to capture the content between "Rated" and "for"
        let match = certiString.match(/Rated\s(.*?)\sfor/i);

        // Check if there's a match and extract the captured value
        if (match) {
            let rating = match[1];
            certification.rating = rating;
        }

        let certificationListSection = page.querySelector("#certifications-list");
        let certificationList = cleanCertificationList(certificationListSection);
        certification.list = certificationList;

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

        returnResponse.certification = certification;
        returnResponse.parentalGuide = parentalGuideData;
        returnResponse.parentalGuideWithSpoilers = parentalGuideSpoilersData;

        res.status(200).json({ data: returnResponse });
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
    getPGDetails
};
