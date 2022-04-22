'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-3.0.0',
          npm: {
            devDependencies: {
              'ember-source': '~3.0.0'
            }
          }
        },
      ]
    };
  });
};
