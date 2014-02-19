var util = require( 'util' );
var events = require( 'events' );
var redis = require( 'redis' );

var CHANNEL = 'devents';

function DistributedEventEmitter( options ) {
    var self = this;
    events.EventEmitter.call( self );
    
    var opts = options || {};
    
    self.pubConnected = false;
    self.subConnected = false;

    function EmitError( error ) {
        events.EventEmitter.prototype.emit.apply( self, [ 'error', error ] );
    }

    process.nextTick( function() {
        self.pub = redis.createClient( opts.port, opts.host, opts.options );
        self.sub = redis.createClient( opts.port, opts.host, opts.options );

        self.pub.on( 'error', EmitError );
        self.sub.on( 'error', EmitError );

        self.pub.on( 'connect', function() {
            if (opts.db) {
                self.pub.select(opts.db);
            }
            self.pubConnected = true; 
            events.EventEmitter.prototype.emit.apply( self, [ 'connect', 'pub', self.pub ] );
        });
        
        self.sub.on( 'connect', function() {
            if (opts.db) {
                self.sub.select(opts.db);
            }
            self.sub.on( 'subscribe', function( channel, count ) {
                self.subConnected = true;
                events.EventEmitter.prototype.emit.apply( self, [ 'connect', 'sub', self.sub ] );
            });
            self.sub.subscribe( CHANNEL );
        });

        self.sub.on( 'message', function( channel, message ) {
            var event = JSON.parse( message );
            events.EventEmitter.prototype.emit.apply( self, [ event.event ].concat( event.args ) );
        });

    });
}

util.inherits( DistributedEventEmitter, events.EventEmitter );

DistributedEventEmitter.prototype.emit = function() {
    var self = this;
    
    if ( self.pubConnected )
    {
        self.pub.publish( CHANNEL, JSON.stringify({
            event: arguments.length > 0 ? arguments[ 0 ] : null,
            args: Array.prototype.slice.call( arguments, 1 )
        }));
        return self;
    }
    else
    {
        return events.EventEmitter.prototype.emit.apply( self, arguments );
    }
}

module.exports.DistributedEventEmitter = DistributedEventEmitter;
