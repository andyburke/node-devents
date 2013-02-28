# node-devents

A simple Redis-based distributed EventEmitter.

## Installation

    npm install devents

## Usage

    // MACHINE 1 (which also happens to be running redis)
    
    var devents = require( 'devents' );

    // create an event emitter that connects to redis running locally:
    
    var emitter = new devents.EventEmitter();

    // listen for 'some event' and print out the array it gets
    emitter.on( 'some event', function( values ) {
        console.log( values );
    });

    // emit 'some event'
    emitter.emit( 'some event', [ 1, 2, 3 ] );
    
Now, on another machine:

    // MACHINE 2
    var devents = require( 'devents' );

    // create an event emitter that connects to redis running on MACHINE 1
    
    var emitter = new devents.EventEmitter({
        host: 'machine1.company.com',
        port: 6379
    });

    // listen for 'some event' and print out the array it gets
    emitter.on( 'some event', function( values ) {
        console.log( values );
    });

Now, on MACHINE 1 you'd see:

    [ 1, 2, 3 ]

But (amazingly) on MACHINE 2 you'd also see:

    [ 1, 2, 3 ]
    
## Caveats

A DistributedEventEmitter can only really handle JSON-encodable objects as arguments to the events.

That is, arguments are JSON-encoded before being sent to Redis.  Functions on the object prototype
will not work on the other side.  And if your object causes JSON.stringify() to throw, that error
is left uncaught.

Be sure to keep your arguments to basic, JSON-encodable types.

## API

devents.DistributedEventEmitter inherits from events.EventEmitter and you should be able to use it
exactly as you would expect, except that events are routed through Redis (if connected).

Note: When connected to a Redis server, all events are routed through the server which may affect
their latency locally as one would expect.

## TODO

* Testing

## Note on Patches/Pull Requests

* They are very welcome. 
* Fork the project.
* Make your feature addition or bug fix, preferably in a branch.
* Send me a pull request.
