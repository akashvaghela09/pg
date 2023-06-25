const cleanTitlesPG = (pgSection) => {
    let finalResponse = {};

    let title = pgSection.querySelector("h4.ipl-list-title").textContent;
    let level = pgSection.querySelector("span.ipl-status-pill").textContent;
    let votes = pgSection.querySelector("a.advisory-severity-vote__message").textContent;

    finalResponse.title = title;
    finalResponse.level = level;
    finalResponse.votes = votes;
    finalResponse.list = [];

    // Get the <ul> element by its class name
    let ulTag = pgSection.querySelector("ul.ipl-zebra-list");

    // Get all <li> elements within the <ul> element
    let liTags = ulTag.querySelectorAll("li.ipl-zebra-list__item");

    // Loop through each <li> and extract the text
    for (let i = 0; i < liTags.length; i++) {
        let text = liTags[i].textContent.trim(); // Trim to remove leading/trailing whitespace
        let cleanText = text.split("Edit").join("");
        finalResponse.list.push(cleanText.trim());
    }

    return finalResponse;
};

module.exports = {
    cleanTitlesPG
}