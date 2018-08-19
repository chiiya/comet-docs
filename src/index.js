const argv = require('yargs').argv;
const Comet = require('./Comet');

global.Logger = new (require('./Logger'))();
Logger.comet('Starting build');
const comet = new Comet(argv);
comet.execute().then(blueprint => {
  console.log(blueprint.dataStructures);
  Logger.comet('Build completed');
});
