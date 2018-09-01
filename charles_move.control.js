loadAPI(1);
var uuid = 'c8541330-ad67-11e8-b568-0800200c9a66';

// example
host.defineController("Charles", "move", "1.0", uuid);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["SimpleTransport"], ["SimpleTransport"]);

function onMidi() {
    println(arguments);
};

function init() {
    println('Loading charles');

    host.getMidiInPort(0).setMidiCallback(onMidi);
    transport = host.createTransport();
    transport.addIsPlayingObserver(function(isPlaying){
        println('Playing? ' + isPlaying);
    });
};
