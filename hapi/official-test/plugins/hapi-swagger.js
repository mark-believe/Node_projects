const inert = require('inert');
const vision = require('vision');
const package = require('package');
const HapiSwagger = require('hapi-swagger');

const swaggerOptions = {
    info: {
            title: 'Test API Documentation',
            version: package.version,
        },
    grouping: 'tags',
    };

module.exports = [
  inert,
  vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions
  }
]