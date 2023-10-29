const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Blog - Digital Chronicles API',
    description: 'API documentation of all endpoints.',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const endpointsFiles = ["../main.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../main.js');
  });