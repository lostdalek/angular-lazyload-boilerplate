module.exports = function(){

    var playerCollection = [{
        "id": 1,
        "name": "Player 1",
        "team": 1
    }, {
        "id": 2,
        "name": "Player 2",
        "team": 1
    }];

    var _getPlayer = function(searchId) {
        searchId = parseInt(searchId, 10);

        var found = false,
            playerCollectionLength = playerCollection.length;
        for(var i = 0; i < playerCollectionLength; i++) {
            var cuPlayer = playerCollection[i];
            if( cuPlayer.id === searchId) {
                found = cuPlayer;
            }
        }
        return found;
    };


    return {
        list: function(){
            return playerCollection;
        },
        get: function(id) {
            return _getPlayer(id);
        }
    }
};

