var Service, Characteristic;
var parseString = require('xml2js').parseString;
var http = require('http');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-foscam-nightlight", "FoscamNightLight", FoscamNightLightAccessory);
}

function FoscamNightLightAccessory(log, config) {
  this.log = log;
  this.config = config;
  this.name = config["name"];
  this.description = config["description"];
  this.hostname = config["hostname"] || "foscam";
  this.port = config["port"] || "88";
  this.username = config["username"] || "admin";
  this.password = config["password"] || "root";

  this.service = new Service.Switch(this.name);

  this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
    
  this.log("Foscam Night Light Initialized")
}

FoscamNightLightAccessory.prototype.getState = function(callback) {
  var that = this
  xmlToJson("http://" + this.hostname + ":" + this.port +"/cgi-bin/CGIProxy.fcgi?cmd=getNightLightState&usr="+this.username+"&pwd="+this.password, function(err, data) {
    if (err) return callback(err);
    that.log("Foscam NightLight Get State: " + JSON.stringify(data));
    callback(null, parseFloat(data.CGI_Result.state[0]))
  })
}

FoscamNightLightAccessory.prototype.setState = function(toggle, callback) {
  var newstate = 0
  if (toggle) newstate = 1
  var that = this
  xmlToJson("http://" + this.hostname + ":" + this.port +"/cgi-bin/CGIProxy.fcgi?cmd=setNightLightState&state="+newstate+"&usr="+this.username+"&pwd="+this.password, function(err, data) {
    if (err) return callback(err);
    that.log("Foscam NightLight Set State " + newstate + ": " + JSON.stringify(data));
    callback()
  })
}

FoscamNightLightAccessory.prototype.getServices = function() {
  return [this.service];
}

function xmlToJson(url, callback) {
  var req = http.get(url, function(res) {
    var xml = '';
    res.on('data', function(chunk) {
      xml += chunk;
    });
    res.on('error', function(e) {
      callback(e, null);
    }); 
    res.on('timeout', function(e) {
      callback(e, null);
    }); 
    res.on('end', function() {
      parseString(xml, function(err, result) {
        if (err) return callback(err, null);
        callback(null, result);
      });
    });
  });
}
