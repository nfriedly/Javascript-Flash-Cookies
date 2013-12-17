/*global SwfStore: false, jasmine: false, describe: false, it: false, expect: false, runs: false, waitsFor: false*/
describe("SwfStore", function() {

    var SWF_PATH = "../storage.swf";

    it("should exist", function() {
        expect(SwfStore).toBeDefined();
    });

    it("should be able to create a new instance", function() {
        expect(new SwfStore()).toBeDefined();
    });

    it("should use the given swf_url config", function() {
        var instance = new SwfStore({
            swf_url: SWF_PATH,
            namespace: "_" + Math.random()
        });
        expect(instance.config.swf_url).toBe(SWF_PATH);
    });


    /**
     * @param {string} [config.swf_url=storage.swf] - Url to storage.swf. Must be an absolute url (with http:// and all) to work cross-domain
     * @param {functon} [config.onready] Callback function that is fired when the SwfStore is loaded. Recommended.
     * @param {function} [config.onerror] Callback function that is fired if the SwfStore fails to load. Recommended.
     * @param {string} [config.namespace="swfstore"] The namespace to use in both JS and the SWF. Allows a page to have more than one instance of SwfStore.
     * @param {string} [config.path] The path fo the LSO - similar to a cookie's path, setting it to "/" allows other .swf files on the domain to read/write to it
     * @param {integer} [config.timeout=10] The number of seconds to wait before assuming the user does not have flash.
     * @param {boolean} [config.debug=false] Is d
     */
    it("should fire the callback after the SWF loads", function() {
        var onerror = jasmine.createSpy("onerror");
        var loaded = false;
        var config = {
            swf_url: SWF_PATH,
            onready: function() {
                loaded = true;
            },
            timeout: 4.5,
            onerror: onerror,
            namespace: "_" + Math.random(),
            debug: true
        };
        runs(function() {
            new SwfStore(config);
        });
        waitsFor(function() {
            return loaded;
        });
        runs(function() {
            expect(onerror).not.toHaveBeenCalled();
        });
    });

    it("should fire the error callback if the SWF fails to load", function() {
        var onload = jasmine.createSpy("onload");
        var errored = false;
        var config = {
            swf_url: "example_invalid_swf_url",
            onload: onload,
            onerror: function() {
                errored = true;
            },
            timeout: 1,
            namespace: "_" + Math.random(),
            debug: true
        };
        runs(function() {
            new SwfStore(config);
        });
        waitsFor(function() {
            return errored;
        });
        runs(function() {
            expect(onload).not.toHaveBeenCalled();
        });
    });

    it("should store and retrieve values", function() {
        var onerror = jasmine.createSpy("onerror");
        var loaded = false;
        var config = {
            swf_url: SWF_PATH,
            onready: function() {
                loaded = true;
            },
            timeout: 4.5,
            onerror: onerror,
            namespace: "_" + Math.random(),
            debug: true
        };
        var instance;
        runs(function() {
            instance = new SwfStore(config);
        });
        waitsFor(function() {
            return loaded;
        });
        runs(function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.set("myKey", "myValue");
            expect(instance.get("myKey")).toBe("myValue");
        });
    });


    it("should allow you to clear previously set values", function() {
        var onerror = jasmine.createSpy("onerror");
        var loaded = false;
        var config = {
            swf_url: SWF_PATH,
            onready: function() {
                loaded = true;
            },
            timeout: 4.5,
            onerror: onerror,
            namespace: "_" + Math.random(),
            debug: true
        };
        var instance;
        runs(function() {
            instance = new SwfStore(config);
        });
        waitsFor(function() {
            return loaded;
        });
        runs(function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.clear("myKey");
            expect(instance.get("myKey")).toBe(null);
        });
    });

});
