var devents = require( '../devents' );

var emitter = new devents.DistributedEventEmitter();

emitter.on( 'event', function( event, value ) {
    console.log( event + ': ' + JSON.stringify( value ) ); 
});

emitter.on( 'connect', function( type ) {
    if ( type === 'sub' )
    {
        setTimeout( function() {
            emitter.emit( 'event', 'd2 - scalar', 1 );
            emitter.emit( 'event', 'd2 - string', 'hi' );
            emitter.emit( 'event', 'd2 - array', [ 1, 2, 3 ] );
            emitter.emit( 'event', 'd2 - hash', { foo: 'bar' } );
        }, 2000 );
    }
});