const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const { config } = require("../configs/config");
const { domain } = config;
const fs = require("fs");

const getTitleDetails = async (req, res) => {
    // const { type = "" } = req.query;

    // res.status(400).json({
    //     message: "Invalid Match Type"
    // });
    // return;

    const axiosConfig = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
        }
    };

    try {
        const response = await axios.get(`https://www.imdb.com/title/tt4154796/parentalguide`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;

        let returnResponse = {};
        let parentalGuideData = [];

        // Scrap Nudiity Section
        let nuditySection = page.querySelector("#advisory-nudity");
        let nudity = {};
        let nudityTitle = nuditySection.querySelector("h4.ipl-list-title").textContent;
        let nudityLevel = nuditySection.querySelector("span.ipl-status-pill").textContent;
        let nudityVotes = nuditySection.querySelector("a.advisory-severity-vote__message").textContent;

        nudity.title = nudityTitle;
        nudity.level = nudityLevel;
        nudity.votes = nudityVotes;
        nudity.list = [];

        // Get the <ul> element by its class name
        let nudityUlTag = nuditySection.querySelector("ul.ipl-zebra-list");

        // Get all <li> elements within the <ul> element
        let nudityLiTags = nudityUlTag.querySelectorAll("li.ipl-zebra-list__item");

        // Loop through each <li> and extract the text
        for (let i = 0; i < nudityLiTags.length; i++) {
            let text = nudityLiTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
            let cleanText = text.split("Edit").join("");
            nudity.list.push(cleanText.trim());
        }
        parentalGuideData.push(nudity);

        // Scrap Violence Section
        let violenceSection = page.querySelector("#advisory-violence");
        let violence = {};
        let violenceTitle = violenceSection.querySelector("h4.ipl-list-title").textContent;
        let violenceLevel = violenceSection.querySelector("span.ipl-status-pill").textContent;
        let violenceVotes = violenceSection.querySelector("a.advisory-severity-vote__message").textContent;

        violence.title = violenceTitle;
        violence.level = violenceLevel;
        violence.votes = violenceVotes;
        violence.list = [];

        // Get the <ul> element by its class name
        let violenceUlTag = violenceSection.querySelector("ul.ipl-zebra-list");

        // Get all <li> elements within the <ul> element
        let violenceLiTags = violenceUlTag.querySelectorAll("li.ipl-zebra-list__item");

        // Loop through each <li> and extract the text
        for (let i = 0; i < violenceLiTags.length; i++) {
            let text = violenceLiTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
            let cleanText = text.split("Edit").join("");
            violence.list.push(cleanText.trim());
        }

        parentalGuideData.push(violence);

        // Scrap Profanity Section
        let profanitySection = page.querySelector("#advisory-profanity");
        let profanity = {};
        let profanityTitle = profanitySection.querySelector("h4.ipl-list-title").textContent;
        let profanityLevel = profanitySection.querySelector("span.ipl-status-pill").textContent;
        let profanityVotes = profanitySection.querySelector("a.advisory-severity-vote__message").textContent;

        profanity.title = profanityTitle;
        profanity.level = profanityLevel;
        profanity.votes = profanityVotes;
        profanity.list = [];

        // Get the <ul> element by its class name
        let profanityUlTag = profanitySection.querySelector("ul.ipl-zebra-list");

        // Get all <li> elements within the <ul> element
        let profanityLiTags = profanityUlTag.querySelectorAll("li.ipl-zebra-list__item");

        // Loop through each <li> and extract the text
        for (let i = 0; i < profanityLiTags.length; i++) {
            let text = profanityLiTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
            let cleanText = text.split("Edit").join("");
            profanity.list.push(cleanText.trim());
        }

        parentalGuideData.push(profanity);

        // Scrap Alcohol Section
        let alcoholSection = page.querySelector("#advisory-alcohol");
        let alcohol = {};
        let alcoholTitle = alcoholSection.querySelector("h4.ipl-list-title").textContent;
        let alcoholLevel = alcoholSection.querySelector("span.ipl-status-pill").textContent;
        let alcoholVotes = alcoholSection.querySelector("a.advisory-severity-vote__message").textContent;

        alcohol.title = alcoholTitle;
        alcohol.level = alcoholLevel;
        alcohol.votes = alcoholVotes;
        alcohol.list = [];

        // Get the <ul> element by its class name
        let alcoholUlTag = alcoholSection.querySelector("ul.ipl-zebra-list");

        // Get all <li> elements within the <ul> element
        let alcoholLiTags = alcoholUlTag.querySelectorAll("li.ipl-zebra-list__item");

        // Loop through each <li> and extract the text

        for (let i = 0; i < alcoholLiTags.length; i++) {
            let text = alcoholLiTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
            let cleanText = text.split("Edit").join("");
            alcohol.list.push(cleanText.trim());
        }

        parentalGuideData.push(alcohol);

        // Scrap Frightening Section
        let frighteningSection = page.querySelector("#advisory-frightening");
        let frightening = {};

        let frighteningTitle = frighteningSection.querySelector("h4.ipl-list-title").textContent;
        let frighteningLevel = frighteningSection.querySelector("span.ipl-status-pill").textContent;
        let frighteningVotes = frighteningSection.querySelector("a.advisory-severity-vote__message").textContent;

        frightening.title = frighteningTitle;
        frightening.level = frighteningLevel;
        frightening.votes = frighteningVotes;
        frightening.list = [];

        // Get the <ul> element by its class name
        let frighteningUlTag = frighteningSection.querySelector("ul.ipl-zebra-list");

        // Get all <li> elements within the <ul> element
        let frighteningLiTags = frighteningUlTag.querySelectorAll("li.ipl-zebra-list__item");

        // Loop through each <li> and extract the text
        for (let i = 0; i < frighteningLiTags.length; i++) {
            let text = frighteningLiTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
            let cleanText = text.split("Edit").join("");
            frightening.list.push(cleanText.trim());
        }

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
