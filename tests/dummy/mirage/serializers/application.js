import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
    serialize(response, request) {
        let json = JSONAPISerializer.prototype.serialize.apply(this, arguments),
            collection = json.data,
            where = request.queryParams,
            serializedResponse = {},
            meta = {'total': collection.length};;

        // json api sort/pagination
        if (where) {
            // remove any null/undefined/empty/false values in query/where object
            for (var i in where) {
                if (where[i] === null || where[i] === undefined || where[i] === '' || where[i] === 'false') {
                    delete where[i];
                }
                // convert true string to boolean true
                if (where[i] === 'true') {
                    where[i] = true;
                }
            }

            // Strip page[] from key
            for (var key in where) {
                if (key.indexOf('page') > -1) {
                    let value = where[key];
                    // Strip filter[] from key
                    let pageKey = key.replace('page[', '').replace(']', '');

                    key = pageKey;
                    where[key] = value;
                }
            }

            // Fixes persistent data from let reduced = collection;
            let reduced = collection.reduce(function(group, item) {
                group.push(item);
                return group;
            }, []);

            // Sort
            let sortedReduced = reduced;
            if (where['sort']) {
                sortedReduced = reduced.sort(this._dynamicSort(where['sort']));
            }

            // Offset
            let offsetSortedReduced  = sortedReduced;
            if (where['offset'] && where['offset'] < reduced.length) {
                offsetSortedReduced = reduced.slice(where['offset']);
            }

            // Limit
            let limitOffsetSortedReduced = offsetSortedReduced;
            if (where['limit'] > 0) {
                limitOffsetSortedReduced = offsetSortedReduced.slice(0, where['limit']);
            }

            serializedResponse.data = limitOffsetSortedReduced;
            meta.total = reduced.length;
        }

        serializedResponse.meta = meta;

        return serializedResponse;
    },

    // Sort attribute.property based on property
    _dynamicSort(property) {
        let sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            let result = (a['attributes'][property] < b['attributes'][property]) ? -1 :
                (a['attributes'][property] > b['attributes'][property]) ? 1 : 0;
            return result * sortOrder;
        };
    },
});
