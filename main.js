const Path = require('path');
let axios = require('axios').default;
let cheerio = require('cheerio');
const _ = require('lodash');
let endpoints = require('./src/config/endpoints');
let { analyze } = require('./src/config/sentiment');
let fs = require('fs');
const { Signale } = require('signale');
const moment = require('moment');
const signale = new Signale();

let direndpointfile = Path.join(__dirname, `./api/`);

// axios kompas.com
// Want to use async/await? Add the `async` keyword to your outer function/method.
async function init() {
  // consola.info('Running Bot..');
  signale.log(' ......:: Bot Anonimak ::......');
  signale.info('Getting endpoint configuration..');
  let newsList = [];

  // const filename = direndpointfile + 'kompas' + '.json';
  // console.log(
  //   getEndpointData({
  //     filename: filename,
  //     endpointname: 'kompas',
  //   })
  // );
  // return;

  for (let i = 0; i < endpoints.length; i++) {
    let indexNews = 1;
    const interactive = new Signale({
      interactive: true,
    });

    interactive.await(
      `[%d/2] - Crawling endpoint [${endpoints[i].meta.site_name}]`,
      1
    );
    do {
      try {
        let { data } = await axios.get(endpoints[i].get_url(indexNews++));
        let $ = cheerio.load(data);

        if ($(endpoints[i].elements_news.list).length <= 0) {
          interactive.success(
            `[%d/2] - Crawling endpoint [${endpoints[i].meta.site_name}] is successful with ${newsList.length} records`,
            2
          );
          let name = endpoints[i].meta.name.toLowerCase();
          saveEndpointData({
            endpointname: name,
            data: _.compact(newsList),
          });
          break;
        }

        $(endpoints[i].elements_news.list).each((idx, el) => {
          getNews({
            endpoint: endpoints[i],
            element: $(el),
          })
            .then((news) => {
              if (newsList !== null) {
                newsList.push(news);
              }
            })
            .catch((error) => console.error(error));
        });
      } catch (error) {
        // console.error(error);
      }
    } while (true);
  }
}

async function getNews({ endpoint, element }) {
  try {
    let { data } = await axios.get(
      endpoint.elements_news.getContentUrl(element)
    );
    let $ = cheerio.load(data);
    let body = $('body');
    let detailContent = endpoint.elements_news.getDetailContent(body);

    return {
      source: {
        name: endpoint.meta.name,
        site_name: endpoint.meta.site_name,
        url: endpoint.meta.url,
        thumbnail_url: endpoint.meta.thumbnailUrl,
      },
      id: endpoint.elements_news.getContentId(element),
      author: endpoint.meta.author,
      title: endpoint.elements_news.getContentTitle(element),
      sub_title: endpoint.elements_news.getContentSubTitle(element),
      url: endpoint.elements_news.getContentUrl(element),
      url_to_image: detailContent.photo,
      content: detailContent.content,
      content_html: detailContent.content_html,
      published_at: endpoint.elements_news.getContentTimestamp(element),
      analysis: analyze(detailContent.content),
    };
  } catch (error) {
    // console.error(error);
  }
}

const saveEndpointData = ({ endpointname, data }) => {
  const filename = direndpointfile + endpointname + '.json';
  let oldData = getEndpointData(filename);
  if (oldData) {
    data = _.merge(oldData, data);
  }
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(filename, stringifyData);
};

const getEndpointData = (filename) => {
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename);
    const jsonData = JSON.parse(data);
    return filterExpiredEndpointData(jsonData);
  }
  return null;
};

const filterExpiredEndpointData = (data) => {
  let datelimit = moment().subtract(1, 'month').unix();
  return data.filter((content) => content.published_at > datelimit);
};

init();
