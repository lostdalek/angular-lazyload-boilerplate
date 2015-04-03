module.exports = function(){

    var resourceCollection = [{
        "id": 1,
        "name": "Resource 1",
        "team": 1
    }, {
        "id": 2,
        "name": "Resource 2",
        "team": 1
    }];

    var _getResource = function(searchId) {
        searchId = parseInt(searchId, 10);

        var found = false,
            resourceCollectionLength = resourceCollection.length;
        for(var i = 0; i < resourceCollectionLength; i++) {
            var cuResource = resourceCollection[i];
            if( cuResource.id === searchId) {
                found = cuResource;
            }
        }
        return found;
    };


    return {
        list: function(){
            return resourceCollection;
        },
        get: function(id) {
            return _getResource(id);
        }
    }
};

