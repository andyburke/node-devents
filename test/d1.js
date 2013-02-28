var devents = require( '../devents' );

var emitter = new devents.DistributedEventEmitter({
    host: 'localhost',
    port: 6379
});

emitter.on( 'event', function( event, value ) {
    console.log( event + ': ' + JSON.stringify( value ) ); 
});

emitter.on( 'connect', function( type ) {
    if ( type === 'sub' )
    {
        setTimeout( function() {
            emitter.emit( 'event', 'd1 - scalar', 1 );
            emitter.emit( 'event', 'd1 - string', 'hi' );
            emitter.emit( 'event', 'd1 - array', [ 1, 2, 3 ] );
            emitter.emit( 'event', 'd1 - hash', { foo: 'bar' } );
        }, 2000 );
    }
});