//var fs = require('fs');

var es=require('event-stream'); // event stream
var dxcomXMLParser;


var xml2js = require('xml2js');
var util = require('util');
var moment = require('moment');

var glucoseReadingsFromCGM;
var glucoseMeterReadings;
var sugars=[];// new Array(); // an array to hold all of the sugar objects. 
var calibrations=[];//new Array(); // an array to hold all of the calibration objects
var sugar={};//new Object(); // an object of type sugar. It has a value, a time, and a type
var calibration={};//new Object(); // an object of type calibration. It has a value a time and a type. this is what the glucometer says

var DEXCOM_TIME = 'YYYY-MM-DD HH:mm:ss'; //constant used fo formatting output
var OUTPUT_TIME = 'YYYY-MM-DDTHH:mm:ss'; // constant used for formatting output
var responder;
var stream;

var Glucose;
var i;




dxcomXMLParser=function () {

  console.log('Instantiated');
  


    stream = es.pipeline(es.split(), es.map(function(data, cb) {
    
    if(data){
//fs.readFile('example.xml', function(err, data) {

        xml2js.parseString(data, function (err, result) {
    	glucoseReadingsFromCGM=result.Patient.GlucoseReadings;
        glucoseMeterReadings=result.Patient.MeterReadings; 
    	//console.log(util.inspect(sugars, false, null))
        //console.log(sugars);
        //console.log(result);
        //console.log("CGM Readings" + glucoseReadingsFromCGM[0].Glucose.length);
        
        for(i=0; i<glucoseReadingsFromCGM[0].Glucose.length; i++){
            sugar={};//new Object();
            sugar.Value=glucoseReadingsFromCGM[0].Glucose[i].$.Value;
            sugar.type='cbg';
            //sugar.InternalTime=glucoseReadingsFromCGM[0].Glucose[i].$.InternalTime;
            sugar.DisplayTime=reformatISO(glucoseReadingsFromCGM[0].Glucose[i].$.DisplayTime);
            sugars.push(sugar);
           //console.log(glucoseReadingsFromCGM[0].Glucose[i].$.Value + glucoseReadingsFromCGM[0].Glucose[i].$.InternalTime + glucoseReadingsFromCGM[0].Glucose[i].$.DisplayTime);
        } // end loop over cgm readings
        //console.log (sugars)
        //console.log("Meter Readings:" + glucoseMeterReadings[0].Meter.length);
        for(i=0; i<glucoseMeterReadings[0].Meter.length; i++){
            calibration={};//new Object();
            calibration.Value=glucoseMeterReadings[0].Meter[i].$.Value;
            calibration.type='cal'; // TODO: Create an object to hold these constants
            calibration.DisplayTime=reformatISO(glucoseMeterReadings[0].Meter[i].$.DisplayTime);
            calibrations.push(calibration);
              //console.log(glucoseMeterReadings[0].Meter[i].$.Value + " " + glucoseMeterReadings[0].Meter[i].$.InternalTime + " " + glucoseMeterReadings[0].Meter[i].$.DisplayTime);
          } // end loop over meter/calibration readings
        //console.log(calibrations);
    }); // end parsestring() 
  } // end if (data)
  return cb();
})); // end es.pipeline(yadda yadda yadda); 
} // end dxcomXMLParser=function()



dxcomXMLParser.desalinate = function( ) {
  return dxcomParser().desalinate( );
};

dxcomXMLParser.sugars = function( ) {
  console.log("Inside dxcomParser.sugars = function( )");
  return dxcomParser().sugars;

};

dxcomXMLParser.cbg = function( ) {
  console.log("Inside dxcomParser.cbg = function( )");
  return dxcomParser().calibrations;
};


dxcomXMLParser.prototype.sayHello = function() {
  console.log("Hello!");
  };


function reformatISO (str) {     // copied directly from dexcom-stream
  var m = moment(str, DEXCOM_TIME);
  return m.format(OUTPUT_TIME);
}

function validTime (str) {        // // copied directly from dexcom-stream
  return moment(str, OUTPUT_TIME).isValid( );
}



es.pipeline(process.openStdin( ), dxcomXMLParser.sugars(), es.writeArray(done));
  function done (err, data) {
    console.log('records', data);
    console.log('FOUND ', data.length, 'records');
    }


module.exports = dxcomXMLParser; 