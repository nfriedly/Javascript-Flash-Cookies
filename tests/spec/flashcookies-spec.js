/*global SwfStore: false, jasmine: false, describe: false, it: false, expect: false, beforeEach: false, afterEach: false*/
describe("SwfStore()", function() {
    "use strict";

    var SWF_PATH = "../dist/storage.swf?" + (new Date()).getTime();

    var onerror;
    var config;
    var instance;

    beforeEach(function() {
        onerror = jasmine.createSpy("onerror").and.throwError('onerror callback fired');
        /**
         * @param {string} [config.swf_url=storage.swf] - Url to storage.swf. Must be an absolute url (with http:// and all) to work cross-domain
         * @param {functon} [config.onready] Callback function that is fired when the SwfStore is loaded. Recommended.
         * @param {function} [config.onerror] Callback function that is fired if the SwfStore fails to load. Recommended.
         * @param {string} [config.namespace="swfstore"] The namespace to use in both JS and the SWF. Allows a page to have more than one instance of SwfStore.
         * @param {integer} [config.timeout=10] The number of seconds to wait before assuming the user does not have flash.
         * @param {boolean} [config.debug=false] Is d
         */
        config = {
            swf_url: SWF_PATH,
            timeout: 4.5,
            onerror: onerror,
            namespace: "test_" + Math.random().toString().substr(2),
            debug: true
        };
    });

    function getInstance(cb) {
        config.onready = cb;
        instance = new SwfStore(config);
    }

    function getInstanceAndFinishTest(done, test) {
        getInstance(function() {
            test();
            done();
        });
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

    it("should be able to create a new instance", function(done) {
        config.onready = done;
        instance = new SwfStore(config);
        expect(instance).toBeDefined();
    });

    it("should use the given swf_url config", function(done) {
        config.onready = done;
        instance = new SwfStore(config);
        expect(instance.config.swf_url).toBe(SWF_PATH);
    });

    it("should fire the callback after the SWF loads", function(done) {
        getInstanceAndFinishTest(done, function() {
            expect(onerror).not.toHaveBeenCalled();
        });
    });

    it("should fire the error callback if the SWF fails to load", function(done) {
        var onready = jasmine.createSpy("onready");
        var config = {
            swf_url: "example_invalid_swf_url",
            onready: onready,
            onerror: function() {
                expect(onready).not.toHaveBeenCalled();
                instance = null; // so that we don't try to call clearAll() on it in the afterEach()
                done();
            },
            timeout: 1,
            namespace: "_" + Math.random(),
            debug: true
        };
        instance = new SwfStore(config);
    });

    it("should allow namespaces to contain forward slashes (/)", function(done) {
        config.onready = function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.set("myKey", "myValue");
            expect(instance.get("myKey")).toBe("myValue");
            done();
        };
        config.namespace = "foo/bar";
        instance = new SwfStore(config);
    });

    it("should allow namespaces to contain multiple forward slashes (/)", function(done) {
        config.onready = function() {
            expect(onerror).not.toHaveBeenCalled();
            instance.set("myKey", "myValue");
            expect(instance.get("myKey")).toBe("myValue");
            done();
        };
        config.namespace = "foo/bar/baz";
        instance = new SwfStore(config);
    });

    describe('.set()', function() {
        it("should store values", function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("myKey", "myValue");
                expect(instance.get("myKey")).toBe("myValue");
            });
        });

        it('should clear a value when called with `null`', function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("key1", "val1");
                expect(instance.get("key1")).toBe("val1");
                instance.set("key1", null);
                expect(instance.get("key1")).toBe(null);
            });
        });
    });

    describe('.get()', function() {
        it("should retrieve values", function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("myKey", "myValue");
                expect(instance.get("myKey")).toBe("myValue");
            });
        });
    });

    describe('.clear()', function() {
        it("should clear previously set values", function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.clear("myKey");
                expect(instance.get("myKey")).toBe(null);
            });
        });
    });

    describe('.getAll()', function() {
        it("should return multiple keys", function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("key1", "val1");
                instance.set("key2", "val2");
                expect(instance.getAll()).toEqual({
                    key1: "val1",
                    key2: "val2"
                });
            });
        });
        it("should allow for keys that begin with numbers", function(done) {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("42532093b13e5cbb0f4e4d2", "val1");
                expect(instance.getAll()).toEqual({
                    "42532093b13e5cbb0f4e4d2": "val1"
                });
            });
        });

        it("should allow for keys that contain dots", function(done) {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("15BWminori.jpg", "val1");
                expect(instance.getAll()).toEqual({
                    "15BWminori.jpg": "val1"
                });
            });
        });


        it("should allow fot keys that contain quotes", function(done) {
            // https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
            getInstanceAndFinishTest(done, function() {
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

    describe('.clearAll()', function() {
        it('should remove all values', function(done) {
            getInstanceAndFinishTest(done, function() {
                expect(onerror).not.toHaveBeenCalled();
                instance.set("'singlequotes'", "val1");
                instance.set('"doublequotes"', "val2");
                instance.set("15BWminori.jpg", "val1");
                instance.set("42532093b13e5cbb0f4e4d2", "val1");
                instance.set("myKey", "myVal");
                instance.clearAll();
                expect(instance.get("myKey")).toBe(null);
                expect(instance.getAll()).toEqual({});
            });
        });
    });

});
