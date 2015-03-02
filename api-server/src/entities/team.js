module.exports = function(){

    var teamCollection = [{
        "id": 1,
        "name": "Team 1"
    }, {
        "id": 2,
        "name": "Team 2"
    }];

    var _getTeam = function(searchId) {
        searchId = parseInt(searchId, 10);

        var found = false,
            teamCollectionLength = teamCollection.length;
        for(var i = 0; i < teamCollectionLength; i++) {
            var cuTeam = teamCollection[i];
            if( cuTeam.id === searchId) {
                found = cuTeam;
            }
        }
        return found;
    };


    return {
        list: function(){
            return teamCollection;
        },
        get: function(id) {
            return _getTeam(id);
        }
    }
};

