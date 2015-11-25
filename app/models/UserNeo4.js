
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:root@localhost:7474');


module.exports = {

  list: function(cb){
    var query = [
        'MATCH (user:User)',
        'RETURN user',
    ].join('\n')

    db.cypher({
        query: query,
    }, function (err, results) {
        if (err) return cb(err);
        if (!results.length) {
            err = new Error('No such user with username: ' + username);
            return cb(err);
        }
        cb(results);
    });
  },

  findById: function (id, callback) {
    var query = [
        'MATCH (n)',
        'MATCH (n) WHERE id(n)={id}',
        'RETURN n',
    ].join('\n')

    var params = {
        id: id,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with id: ' + id);
            return callback(err);
        }
        var user = results[0];
        callback(null, user);
    });
  },

  get: function (username, callback) {
    var query = [
        'MATCH (user:User {username: {username}})',
        'RETURN user',
    ].join('\n')

    var params = {
        username: username,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with username: ' + username);
            return callback(err);
        }
        console.log(results);
        callback(results);
    });
  },

  create: function (props, callback) {
    var query = [
        'CREATE (user:User {props})',
        'RETURN user',
    ].join('\n');

    var params = {
        props: props
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        user = results[0]['user'];
        callback(user);
    });
  }


}

