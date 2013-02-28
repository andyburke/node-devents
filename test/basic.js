var devents = require( '../devents' );

var emitter = new devents.DistributedEventEmitter();

emitter.on( 'event', function( event, value ) {
    console.log( event + ': ' + JSON.stringify( value ) ); 
});

emitter.on( 'connect', function( channel ) {
    if ( channel === 'sub' )
    {
        console.log( 'sub' );
        emitter.emit( 'event', 'd1 - scalar', 1 );
        emitter.emit( 'event', 'd1 - string', 'hi' );
        emitter.emit( 'event', 'd1 - array', [ 1, 2, 3 ] );
        emitter.emit( 'event', 'd1 - hash', { foo: 'bar' } );
        emitter.emit( 'done' );
    }
});

emitter.on( 'done', function() {
    process.exit( 0 ); 
});

