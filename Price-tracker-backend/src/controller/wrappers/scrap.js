const axios = require("axios");
const cheerio = require("cheerio");

const productURL = "https://www.amazon.com/dp/B07XVCP7F5";

axios
  .get(productURL)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const imageElements = $("#landingImage"); // Find all img elements

    imageElements.each((index, element) => {
      const imageUrl = $(element).attr("src"); // Get the 'src' attribute of the img element
      console.log(imageUrl);
    });
  })
  .catch((error) => {
    console.error("Error fetching the page:", error);
  });
