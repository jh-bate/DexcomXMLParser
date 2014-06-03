/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */


'use strict';

var dxcomXMLParser, es;
es=require('event-stream'); // event stream
var moment = require('moment');

var xml2js = require('xml2js');
var util = require('util');
var glucoseReadingsFromCGM;
var glucoseMeterReadings;
var sugars=[];// new Array(); // an array to hold all of the sugar objects. 
var calibrations=[];//new Array(); // an array to hold all of the calibration objects
var sugar={};//new Object(); // an object of type sugar. It has a value, a time, and a type
var calibration={};//new Object(); // an object of type calibration. It has a value a time and a type. this is what the glucometer says

var DEXCOM_TIME = 'YYYY-MM-DD HH:mm:ss'; //constant used fo formatting output
var OUTPUT_TIME = 'YYYY-MM-DDTHH:mm:ss'; // constant used for formatting output
var Glucose;
var i;


dxcomXMLParser=function () {
  var stream,responder;
  console.log('Instantiated');
  stream = es.pipeline(es.split(), es.map(function(data, cb) {
    console.log('Just entered the stream thing'); // it never reaches this
    if(data){
      xml2js.parseString(data, function (err, result) {
    	  glucoseReadingsFromCGM=result.Patient.GlucoseReadings;
        glucoseMeterReadings=result.Patient.MeterReadings; 
    	  //console.log(util.inspect(sugars, false, null))
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
        console.log (sugars)
        //console.log("Meter Readings:" + glucoseMeterReadings[0].Meter.length);
        for(i=0; i<glucoseMeterReadings[0].Meter.length; i++){
            calibration={};//new Object();
            calibration.Value=glucoseMeterReadings[0].Meter[i].$.Value;
            calibration.type='cal'; // TODO: Create an object to hold these constants
            calibration.DisplayTime=reformatISO(glucoseMeterReadings[0].Meter[i].$.DisplayTime);
            calibrations.push(calibration);
              //console.log(glucoseMeterReadings[0].Meter[i].$.Value + " " + glucoseMeterReadings[0].Meter[i].$.InternalTime + " " + glucoseMeterReadings[0].Meter[i].$.DisplayTime);
          } // end loop over meter/calibration readings
        console.log(calibrations);
    }); // end parsestring() 
        stream.emit(sugars);
        stream.emit(calibrations);
  } // end if (data)
  return cb();
})); // end es.pipeline(yadda yadda yadda);
console.log('End of stream function');
return stream;

} // end dxcomXMLParser=function()



dxcomXMLParser.desalinate = function( ) {
  return dxcomXMLParser().desalinate( );
};

dxcomXMLParser.sugars = function( ) {
  console.log("Inside dxcomParser.sugars = function( )");
  var ret=dxcomXMLParser().sugars;
  console.log ("About to ret.");
  console.log(ret);
  return ret;
};

dxcomXMLParser.cbg = function( ) {
  console.log("Inside dxcomParser.cbg = function( )");
   dxcomXMLParser();
   return calibrations;
};


dxcomXMLParser.sayHello = function() {
  console.log("Hello!");
  };


function reformatISO (str) {     // copied directly from dexcom-stream
  var m = moment(str, DEXCOM_TIME);
  return m.format(OUTPUT_TIME);
}

function validTime (str) {        // // copied directly from dexcom-stream
  return moment(str, OUTPUT_TIME).isValid( );
}

module.exports = dxcomXMLParser; 