const MongoClient = require('mongodb').MongoClient;
const authInfo = require("./auth.json");
const ping = require('ping');
const hosts = [
    '1.1.1.1',
    '8.8.8.8',
    '8.8.4.4'
]
const url = authInfo.mongoURL;
const dbName= "UptimeKeeper";
const collectionName = "deadServers";
const accountSid = authInfo.accountSid;
const authToken = authInfo.authToken;
const client = require('twilio')(accountSid, authToken);
var dateTime = new Date().toString();
var minutes = 1, the_interval = minutes * 60 * 1000;

setInterval(function() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        hosts.forEach(function (host) {
            ping.promise.probe(host, {
                timeout: 2,
            }).then(function (res) {
                console.log(res.alive ? "host: " + host + " is alive!" : "host: " + host + " is dead!");
                if (res.alive == false) {
                    var deadHostObj = {date: dateTime, host: host}
                    dbo.collection(collectionName).insertOne(deadHostObj, function(err, res) {
                        if (err) throw err;
                        client.messages.create({
                            body: 'Host: ' + host + ' went down at ' + dateTime + '!',
                            from: authInfo.fromNumber,
                            to: authInfo.cellNumber
                        }).then(message => console.log(message.sid));
                    });
                }
            });
        });
    });
}, the_interval);