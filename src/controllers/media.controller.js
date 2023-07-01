const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const { config } = require("../configs/config");
const { domain, axiosConfig } = config;
const { cleanTitlesPG, cleanCertificationList } = require("../utils/filter");
const fs = require("fs");

const getTitleDetails = async (req, res) => {
    try {
        const titleId = req.params.id;
        let returnResponse = {};

        const response = await axios.get(`${domain}/title/${titleId}`, axiosConfig);
        // Create a JSDOM instance with the fetched HTML content
        const dom = new JSDOM(response.data);
        const page = dom.window.document;

        const h1Element = page.querySelector('h1[data-testid="hero__pageTitle"]');
        const title = h1Element?.textContent;
        returnResponse.title = title;

        const subHeaderElement = h1Element?.nextElementSibling;
        const liElements = subHeaderElement.querySelectorAll('li.ipc-inline-list__item');

        if (liElements.length >= 3) {
            // Extract the information from the <li> elements
            const releaseDate = liElements[0].textContent.trim();
            const certificate = liElements[1].textContent.trim();
            const runtime = liElements[2].textContent.trim();

            returnResponse.releaseDate = releaseDate;
            returnResponse.certificate = certificate;
            returnResponse.runtime = runtime;
        } else {
            console.log('Insufficient data found in the <ul> element.');
        }

        const ratingElement = page.querySelector('div[data-testid="hero-rating-bar__aggregate-rating__score"]');
        const rating = ratingElement?.textContent;
        const ratedByElement = ratingElement?.nextElementSibling.nextElementSibling;
        const ratedBy = ratedByElement?.textContent.trim();
        returnResponse.rating = {
            score: rating,
            count: ratedBy,
            info: `${rating} based on ${ratedBy} user ratings`
        };
        
        const metaScoreElement = page.querySelector('span.metacritic-score-box');
        const metaScore = metaScoreElement?.textContent.trim();
        returnResponse.metaScore = metaScore;

        const reviewElement = page.querySelector('ul[data-testid="reviewContent-all-reviews"]');
        const threeElements = reviewElement?.querySelectorAll('span.three-Elements');
        const reviews = [];

        threeElements.forEach((element) => {
            let item = {};

            let score = element.querySelector('span.score')?.textContent.trim();
            let label = element.querySelector('span.label')?.textContent.trim();

            item.count = score;
            item.type = label;
            
            if(label !== "Metascore"){
                reviews.push(item);
            }
        });
        returnResponse.reviews = reviews;

        const genreSection = page.querySelector('div[data-testid="genres"]');
        const genreElements = genreSection?.querySelectorAll('span.ipc-chip__text');
        const genres = Array.from(genreElements, element => element.textContent.trim());
        returnResponse.genres = genres;

        const plotSection = page.querySelector("span[data-testid='plot-xl']");
        const plot = plotSection?.textContent;
        returnResponse.plot = plot;

        const posterElement = page.querySelector('div[role="group"][data-testid="hero-media__poster"]');
        const posterSrc = posterElement?.querySelector('img')?.srcset;
        const posterSrcArray = posterSrc.split(' ');
        const reversedArray = posterSrcArray.reverse();
        const poster = reversedArray[1];
        returnResponse.poster = poster;

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

        const castSection = page.querySelector('div.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid[data-testid="shoveler-items-container"]');
        const castArray = castSection?.querySelectorAll('div[data-testid="title-cast-item"]');
        const cast = [];

        castArray.forEach(element => {
            let item = {};

            const nameElement = element.querySelector('a[data-testid="title-cast-item__actor"]');
            const name = nameElement?.textContent;
            const artistId = element.querySelector("a")?.href.split('/')[2];
            item.name = name;
            item.artistId = artistId;

            const posterSrc = element?.querySelector('img')?.srcset;
            if(posterSrc){
                const posterSrcArray = posterSrc.split(' ');
                const reversedArray = posterSrcArray.reverse();
                const poster = reversedArray[1];
                item.image = poster;
            }

            const characterElement = element.querySelector('a[data-testid="cast-item-characters-link"]');
            const character = characterElement?.textContent;
            item.character = character;

            cast.push(item);
        });

        returnResponse.cast = cast;

        const moreLikeThisSection = page.querySelector('section[data-testid="MoreLikeThis"]')
        const moreLikeThisGrid = moreLikeThisSection.querySelector('div.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--nowrap.ipc-shoveler__grid[data-testid="shoveler-items-container"]');
        const childDivs = Array.from(moreLikeThisGrid.querySelectorAll('div'));
        const moreLikeThis = [];

        childDivs.forEach((element) => {
            let item = {};

            const titleElement = element.querySelector('span[data-testid="title"]');
            const title = titleElement?.textContent.trim();

            const ratingElement = element.querySelector('span.ipc-rating-star.ipc-rating-star--base.ipc-rating-star--imdb.ipc-rating-star-group--imdb');
            const rating = ratingElement?.textContent.trim();

            const posterElement = element.querySelector('img');
            const posterSrc = posterElement?.srcset;
            const posterSrcArray = posterSrc?.split(' ');
            const reversedArray = posterSrcArray?.reverse();
            const poster = reversedArray ? reversedArray.length > 1 ? reversedArray[1] : null : null;

            const href = element?.querySelector('a')?.href;
            const id = href?.split('/')[2];

            if (title && rating && poster) {
                item.title = title;
                item.rating = rating;
                item.image = poster;
                item.titleId = id;

                moreLikeThis.push(item);
            }
        });

        returnResponse.moreLikeThis = moreLikeThis;

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
