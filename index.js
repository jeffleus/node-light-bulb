var awsIot = require('aws-iot-device-sdk');
var colors = require('colors');
var prettyjson = require('prettyjson');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourAWSRegion>'
// with a unique client identifier and the AWS region you created your
// certificate in (e.g. 'us-east-1').  NOTE: client identifiers must be
// unique within your AWS account; if a client attempts to connect with a
// client identifier which is already in use, the existing connection will
// be terminated.
//
var device = awsIot.device({
   keyPath: './certs/private.pem.key',
  certPath: './certs/certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'node-light-switch',
    region: 'us-west-2' 
});

const updateTopic = '$aws/things/LightSwitch/shadow/update';
const docsTopic = '$aws/things/LightSwitch/shadow/update/documents';
const deltaTopic = '$aws/things/LightSwitch/shadow/update/delta';
const getTopic = '$aws/things/LightSwitch/shadow/get/accepted';

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connect');
    
    var update = { "state": { "desired": { "lightPower": 1, "lightColor": "R" } } };
    
    device.subscribe(updateTopic);
    device.subscribe(docsTopic);
    device.subscribe(deltaTopic);
    device.subscribe(getTopic);
    device.publish('$aws/things/LightSwitch/shadow/get', '');
    });

device
  .on('message', function(topic, payload) {
    console.log('*'.repeat(40).rainbow);
    console.log('MSG: ', topic);
    console.log('*'.repeat(40).rainbow);
    console.log(prettyjson.render(JSON.parse(payload)));
    console.log('\n');
//    var data = JSON.parse(payload.toString());
////    debugger;    
//    if (data.state.desired) {
//        console.log('shadow', 'desired', JSON.stringify(data.state.desired).green);        
//    }
//    if (data.state.reported) {
//        console.log('shadow', 'reported', JSON.stringify(data.state.reported).red);
//    }
  });