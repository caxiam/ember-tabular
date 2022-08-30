export const getLastPretenderRequest = (server) => {
    var requests = server.pretender.handledRequests;
    return requests[requests.length - 1];
};

export const getPretenderRequest = (server, method, type) => {
    function isJson(str) {
        try { JSON.parse(str); } catch (e) { return false; } return true;
    }

    var requests = server.pretender.handledRequests,
        pretenderRequests = [];

    for (var i = requests.length - 1; i >= 0; i--) {
        var requestBody = JSON.parse(requests[i].responseText);
        if (requestBody.data) {
            requestBody = requestBody.data;
        } else {
            if (isJson(requests[i].requestBody) && JSON.parse(requests[i].requestBody) && JSON.parse(requests[i].requestBody).data) {
                requestBody = JSON.parse(requests[i].requestBody).data;
            } else {
                requestBody = requestBody.data;
            }
        }
        if (type) {
            if (requestBody.constructor === Array) {
                if (requests[i].method === method && requestBody[0] && requestBody[0].type === type) {
                    pretenderRequests.push(requests[i]);
                }
            } else {
                if (requests[i].method === method && requestBody && requestBody.type === type) {
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
};

export const getPretenderRequestBody = (request) => {
    return JSON.parse(request.requestBody);
};

export const getPretenderResponseBody = (request) => {
    return JSON.parse(request.responseText);
};

export const assertIn = (assert, subject, value, description) => {
  return assert.equal(subject.indexOf(value) > -1, true, description);
};
