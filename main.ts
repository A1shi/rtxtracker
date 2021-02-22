const cheerio = require("cheerio");
const axios = require("axios");
const settings = require('./yourgay.json')
const openShit = require('open');
let counter = 0;
let validPrices: any[] = [];
let $: any;

setInterval(() => {
axios.get("https://www.newegg.com/p/pl?d=rtx+3080&cm_sp=KeywordRelated-_-rtx+3060-_-rtx+3070-_-INFOCARD&N=100007709&isdeptsrh=1").then((response: any) => {
  $ = cheerio.load(response.data)

  $(".price-current").each((index: Number, e: any) => {
    let price = $(e).find('strong').text()
    if (price < settings["highest-price"]) {
      validPrices.push(e)
    }
  });
  validatePrices();
  })

async function validatePrices () {

  for await (const url of validPrices.map(e => {
    if (!$(e).parent().parent().parent().find('.item-info').find('.item-title').text().includes("MSI") && !$(e).parent().parent().parent().find('.item-info').find('.item-promo')) {
      let url = $(e).parent().parent().parent().find('.item-info').find('.item-title').attr('href')
      return url;
    }
  })) {
    if (counter < settings.maxAmount && url) {
      await openShit(url);
    }
    counter++;
  }
}
}, 60000)


export { };
