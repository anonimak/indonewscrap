// github.com/remy/nodemon
var nodemon = require('nodemon');
nodemon({
  script: 'server.js',
  ext: 'js json', // watching extensions
  watch: ['./api/'], // watching direktori
});

nodemon
  .on('start', function () {
    console.log('App has started');
  })
  .on('quit', function () {
    console.log('App has quit');
    process.exit();
  })
  .on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
