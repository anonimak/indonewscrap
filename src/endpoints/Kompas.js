'use strict';

const moment = require('moment');

module.exports = {
  meta: {
    name: 'Kompas',
    site_name: 'KOMPAS.com',
    url: 'https://www.kompas.com/',
    index_url: 'http://indeks.kompas.com/?site=all',
    image: 'https://asset.kompas.com/data/2019/kompascom/banner-jmd-3.jpg',
    author: 'Kompas Cyber Media',
    thumbnailUrl:
      'https://asset.kompas.com/data/2017/wp/images/logo-kompascom-jmd.png?v=1',
  },
  elements_news: {
    list: '.article__list',
    getContentTitle: function (content) {
      return content.find('.article__link').text().trim();
    },
    getContentSubTitle: function (content) {
      return content.find('.article__subtitle').text().trim().toLowerCase();
    },
    getContentUrl: function (content) {
      return content.find('.article__link').attr('href') + '?page=all';
    },
    getContentId: function (content) {
      let path = content
        .find('.article__link')
        .attr('href')
        .trim()
        .split('read/')
        .pop();
      let arraySegments = path.split('/');
      let id = arraySegments[3];
      return id;
    },
    getContentDate: function (content) {
      return content.find('.article__date').text();
    },
    getContentTimestamp: function (content) {
      return moment(
        this.generateTime(content.find('.article__date').text())
      ).unix();
    },
    getDetailContent: function (body) {
      return {
        photo: body.find('.photo__wrap').find('img').prop('src'),
        content: body.find('.read__content').text().trim(),
        content_html: body.find('.read__content').html().trim(),
        editor: body.find('.read__credit').find('a').text(),
      };
    },

    generateTime: function (content_time) {
      let date_time = content_time.replace(',', '').split(' ');
      let date = date_time[0].split('/');
      let newFormatDate = date[2] + '-' + date[1] + '-' + date[0];
      let time = date_time[1];
      let newdateTime = newFormatDate + 'T' + time;

      return newdateTime;
    },
  },
  get_url: function (page = null, date = moment().format('YYYY-MM-DD')) {
    if (page) {
      return this.meta.index_url + '&date=' + date + '&page=' + page;
    }
    return this.meta.index_url;
  },
};
