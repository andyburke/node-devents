var util = require( 'util' );
var events = require( 'events' );
var redis = require( 'redis' );

var CHANNEL = 'devents';

function DistributedEventEmitter( options ) {
    var self = this;
    events.EventEmitter.call( self );
    
    var opts = options || {};
    self.pub = redis.createClient( opts.port, opts.host, opts.options );
    self.sub = redis.createClient( opts.port, opts.host, opts.options );

    self.pubConnected = false;
    self.subConnected = false;

    self.pub.on( 'connect', function() {
        self.pubConnected = true; 
        self._emit( 'connect', 'pub', self.pub );
    });
    
    self.sub.on( 'connect', function() {
        self.subConnected = true;
        self.sub.subscribe( CHANNEL );
        self._emit( 'connect', 'sub', self.sub );
    });

    function EmitError( error ) {
        self._emit( 'error', error );
    }
    
    self.pub.on( 'error', EmitError );
    self.sub.on( 'error', EmitError );
    
    self.sub.on( 'message', function( channel, message ) {
        var event = JSON.parse( message );
        self._emit.apply( self, [ event.event ].concat( event.args ) );
    });
}

util.inherits( DistributedEventEmitter, events.EventEmitter );

DistributedEventEmitter.prototype._emit = DistributedEventEmitter.prototype.emit;

DistributedEventEmitter.prototype.emit = function( event ) {
    var self = this;
    var args = Array.prototype.slice.call( arguments, 1 );
    
    if ( self.pubConnected )
    {
        self.pub.publish( CHANNEL, JSON.stringify({
            event: event,
            args: args
        }));
        return self;
    }
    else
    {
        return self._emit( event, args );    
    }
}

module.exports.DistributedEventEmitter = DistributedEventEmitter;