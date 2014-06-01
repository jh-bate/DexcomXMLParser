var es = require('event-stream')
  , dxcomXMLParser = require('../')
  , mystream=require('stream')
  , r=require('stream').Readable
  , buf;
  


/*console.log("In example");
mystream=process.openStdin( );

mystream
  .on('data',  function (data) { console.log('Data! ' + data.length, data.toString());  })
  .on('error', function (err)  { console.error('Error', err); })
  .on('end',   function ()     { console.log('All done!');    });
	
} */


if (!module.parent) {
  es.pipeline(process.openStdin( )
    , dxcomXMLParser.cbg( ), es.writeArray(done));
  function done (err, data) {
    console.log('records', data);
    console.log('FOUND ', data.length, 'records');
    }
}

