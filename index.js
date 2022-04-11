// Modules
const MongoClient = require('mongodb').MongoClient;
const ping = require('ping');
const csv = require('csv-array');
// Variables from auth.json
const authInfo = require("./auth.json");
const url = authInfo.mongoURL;
const dbName= "UptimeKeeper";
const collectionName = "deadServers";
const accountSid = authInfo.accountSid;
const authToken = authInfo.authToken;
// Declare the client information for twilio
const client = require('twilio')(accountSid, authToken);
// Set date & time
var dateTime = new Date().toString();
// Take command arguments from the CLI, and assign them to variables
var commandLineArguments = process.argv;
var csvFile = commandLineArguments[2];
var minutesToUse = commandLineArguments[3];
// Sets how many minutes to wait based on the CLI
var minutes = minutesToUse, the_interval = minutes * 60 * 1000;
// The part that like, uhh, does everything. I think...
csv.parseCSV(csvFile, function(hosts){
    setInterval(function() {
        // Connects to MongoDB, completly optional
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            // pings each host, for how many there are
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
                            }).then(message => console.log("Message sent successfully!"));
                        });
                    }
                });
            });
        });
    }, the_interval);
}, false);