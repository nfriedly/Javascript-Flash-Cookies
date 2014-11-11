/*global SwfStore: false, jasmine: false, describe: false, it: false, expect: false, runs: false, waitsFor: false, beforeEach: false, afterEach: false*/
describe("SwfStore", function() {
    "use strict";

    var SWF_PATH = "../dist/storage.swf?" + (new Date()).getTime();

    var onerror;
    var loaded;
    var config;
    var instance;

    beforeEach(function() {
        onerror = jasmine.createSpy("onerror").andThrow('onerror callback fired');
        loaded = false;
        /**
         * @param {string} [config.swf_url=storage.swf] - Url to storage.swf. Must be an absolute url (with http:// and all) to work cross-domain
         * @param {functon} [config.onready] Callback function that is fired when the SwfStore is loaded. Recommended.
         * @param {function} [config.onerror] Callback function that is fired if the SwfStore fails to load. Recommended.
         * @param {string} [config.namespace="swfstore"] The namespace to use in both JS and the SWF. Allows a page to have more than one instance of SwfStore.
         * @param {string} [config.path] The path fo the LSO - similar to a cookie's path, setting it to "/" allows other .swf files on the domain to read/write to it
         * @param {integer} [config.timeout=10] The number of seconds to wait before assuming the user does not have flash.
         * @param {boolean} [config.debug=false] Is d
         */
        config = {
            swf_url: SWF_PATH,
            onready: function() {
                loaded = true;
            },
            timeout: 4.5,
            onerror: onerror,
            namespace: "_" + Math.random(),
            debug: true
        };
    });

    function getInstance(cb) {
        runs(function() {
            instance = new SwfStore(config);
        });
        waitsFor(function() {
            return loaded;
        });
        runs(cb);
    }

    afterEach(function() {
        if (instance) {
            instance.clearAll();
            instance = null;
        }
    });

    it("should exist", function() {
        expect(SwfStore).toBeDefined();
    });

    it("should be able to create a new instance", function() {
        expect(new SwfStore(config)).toBeDefined();
    });

    it("should use the given swf_url config", function() {
        var instance = new SwfStore(config);
        expect(instance.config.swf_url).toBe(SWF_PATH);
    });

    it("should fire the callback after the SWF loads", function() {
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
        getInstance(function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.set("myKey", "myValue");
            expect(instance.get("myKey")).toBe("myValue");
        });
    });


    it("should allow you to clear previously set values", function() {
        getInstance(function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.clear("myKey");
            expect(instance.get("myKey")).toBe(null);
        });
    });

    it("should allow you to clear all values", function() {
        getInstance(function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.clear("myKey");
            instance.set("key1", "val1");
            instance.set("key2", "val2");
            instance.clearAll();
            expect(instance.get("myKey")).toBe(null);
            expect(instance.getAll()).toEqual({});
        });
    });

    describe('getAll', function() {
        it("should return multiple keys", function() {
            getInstance(function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("key1", "val1");
                instance.set("key2", "val2");
                expect(instance.getAll()).toEqual({
                    key1: "val1",
                    key2: "val2"
                });
            });
        });
        it("should not choke keys that begin with numbers", function() {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstance(function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("42532093b13e5cbb0f4e4d2", "val1");
                expect(instance.getAll()).toEqual({
                    "42532093b13e5cbb0f4e4d2": "val1"
                });
            });
        });

        it("should not choke keys that contain dots", function() {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstance(function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("15BWminori.jpg", "val1");
                expect(instance.getAll()).toEqual({
                    "15BWminori.jpg": "val1"
                });
            });
        });


        it("should not choke keys that contain quotes", function() {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstance(function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("'singlequotes'", "val1");
                instance.set('"doublequotes"', "val2");
                expect(instance.getAll()).toEqual({
                    "'singlequotes'": "val1",
                    '"doublequotes"': "val2"
                });
            });
        });
    });
});
