loadAPI(6);

var uuid = 'c8541330-ad67-11e8-b568-0800200c9a66';

// example
host.defineController("Charles", "move", "1.0", uuid);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["SimpleTransport"], ["SimpleTransport"]);


/**
 * expose the property names of an object
 */
function exp(obj) {
    for (var key in obj) {
        println(key);
    }
}

function forEach(arrayLike, cb, thisArg) {
    if (typeof thisArg === 'undefined') {
        thisArg = this;
    }
    for (var i = 0; i < arrayLike.length; i++) {
        cb.call(thisArg, arrayLike[i], i);
    }
}

function countTo(size) {
    var a = new Array(size);
    for (var i = 0; i < size; i++) a[i] = i;
    return a;
}

function times(count, cb) {
    var a = countTo(count);
    return a.map(cb);
};

var SIZE = 4;
var TRACK_COUNT = SIZE;
var SCENE_COUNT = SIZE;

function init() {
    println('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    var transport = host.createTransport();
    var application = host.createApplication();
    var project = host.getProject();
    var rootTrackGroup = host.getProject().getRootTrackGroup();

    // We can invoke any action that is available in the GUI shortcuts list from
    // the api.
    var actions = application.getActions();

    // The scene and track banks are important ways that we access the session
    var scenes = host.createSceneBank(SCENE_COUNT);
    var tracks = host.createMainTrackBank(TRACK_COUNT, 2, SCENE_COUNT);

    // Clip always points to the currently selected clip in the gui. Note that
    // it might be empty. The grid width and grid height refer to the size of
    // the window into the clip's piano roll that is accessible. The step size
    // and relative position of the window can be adjusted;
    var clip = host.createLauncherCursorClip(128, 16);

    // Example of selecting an item. 
    tracks.getItemAt(0).getClipLauncherSlots().select(0);

    // If we want to .get() a value, we need to add an observer, or call its
    // markInterested() method. This must be called from directly inside the
    // init function.
    clip.canScrollKeysDown().markInterested();
    clip.canScrollKeysUp().markInterested();

    // Setup Scenes
    times(SCENE_COUNT, function(i) {
        scenes.getScene(i).name().addValueObserver(function(name){
            println('scene ' + i + " changed to " + name);
        });
    });

    // Setup Tracks
    times(TRACK_COUNT, function(i) {
        var track = tracks.getItemAt(i);
        var clipSlots = track.clipLauncherSlotBank();

        clipSlots.itemCount().addValueObserver(function(itemCount) {
            println('track ' + i + ' has ' + itemCount + ' clips.');
        });

        clipSlots.addIsSelectedObserver(function(clipIndex, isSelected) {
            println('track(' + i + ') clip(' + clipIndex + ') sel(' + isSelected + ')');
        });

        times(SCENE_COUNT, function(j){
            clipSlots.getItemAt(j).hasContent().addValueObserver(function(hasContent){
                println('track(' + i + ') clip(' + j + ') hasContent(' + hasContent + ')');
            });
        });
    });


    println('done with init loops');
    forEach(actions, function(a) {
        // println("---" + a.getName());
    });

    host.scheduleTask(function() {

        // Access all the clip launcher slots
        var trackClipSlots = tracks.getItemAt(0).clipLauncherSlotBank();
        trackClipSlots.select(3);

        var track = tracks.getItemAt(0);
        var launcherBank = track.clipLauncherSlotBank();
        var test = launcherBank.createEmptyClip(3, 1);

        println(clip.canScrollKeysDown().get() + ' --- ' + clip.canScrollKeysUp().get())
        clip.scrollToStep(0);
        clip.scrollToKey(0);
        clip.setStepSize(0.5);
        clip.setStep(0, 60, 100, 0.5);
        clip.scrollKeysStepDown();
        clip.setStep(0, 60, 100, 0.125);

    }, null, 10);

    var index = 0;

    transport.addIsPlayingObserver(function(isPlaying){
        if (isPlaying) {
            const scene = scenes.getScene(index)
            println(clip.sh);
            // scene.launch();
            clip.setName("C" + Math.random());
        } else {
            scenes.stop();
            index = (index + 1) % SIZE;
        }
    });
};
