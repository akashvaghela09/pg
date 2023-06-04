const log = (message) => {
    let stamp = Date.now();
    let date = new Date(stamp);
    date = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');

    try {
        let callAddress = new Error().stack.split("at ")[2].split(" ")[1];
        let fileName = callAddress.split("/").pop().split(")")[0];
        // console.log(`${date} ${fileName} | `, message);
        console.log(`${fileName} | `, message);
    } catch (error) {
        console.log(`${date} | ${message}`)
    }
};

const waitFor = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const undefinedFilter = (obj) => {
    let newObj = {};

    for (let key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }

    return newObj;
}

module.exports = {
    log,
    waitFor,
    undefinedFilter
}