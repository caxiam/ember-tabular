import Ember from 'ember';

export default function() {

  Ember.Test.registerHelper('getLastPretenderRequest', function(app, server) {
    var requests = server.pretender.handledRequests;
    return requests[requests.length - 1];
  });

  Ember.Test.registerHelper('getPretenderRequest', function(app, server, method, type) {
    var requests = server.pretender.handledRequests,
      pretenderRequests = [];

    for (var i = requests.length - 1; i >= 0; i--) {
      var requestBody = JSON.parse(requests[i].responseText).data;
      if (type) {
        if (requestBody.constructor === Array) {
          if (requests[i].method === method && requestBody[0].type === type) {
            pretenderRequests.push(requests[i]);
          }
        } else {
          if (requests[i].method === method && requestBody.type === type) {
            pretenderRequests.push(requests[i]);
          }
        }
      } else {
        if (requests[i].method === method) {
          pretenderRequests.push(requests[i]);
        }
      }

    }
    return pretenderRequests;
  });

  Ember.Test.registerHelper('getPretenderRequestBody', function(app, request) {
    return JSON.parse(request.requestBody);
  });

  Ember.Test.registerHelper('assertIn', function(app, assert, subject, value, description) {
    return assert.equal(subject.indexOf(value) > -1, true, description);
  });

  Ember.Test.registerHelper('disableDatePicker', function() {
    find('.picker__input').pickadate('picker').stop();
  });

  Ember.Test.registerHelper('setDatePicker', function(app, selector, date) {
    find(selector).pickadate('picker').set('select', date).close();
  });
}
