define('tests/unit/apps',
    ['tests/unit/helpers'],
    function(h) {

    function mockCapabilities(webApps) {
        return function(injector) {
            return injector.mock('core/capabilities', {
                device_type: function() {return 'foo';},
                webApps: webApps
            });
        };
    }


    describe('apps.incompat', function() {
        it('can work',
           h.injector(mockCapabilities(true)).run(['apps'], function(apps) {
            var product = {
                payment_required: false,
                device_types: ['foo']
            };
            var results = apps.incompat(product);
            assert(!results, 'incompat');
        }));


        it('caches the result',
           h.injector(mockCapabilities(true)).run(['apps'], function(apps) {
            var product = {
                payment_required: false,
                device_types: ['foo']
            };
            var results = apps.incompat(product);
            assert(!results);
            assert('__compat_reasons' in product);
            product.__compat_reasons = 'asdf';
            assert.equal(apps.incompat(product), 'asdf');
        }));


        it('detects payment incompats',
           h.injector(mockCapabilities(true), h.mockSettings())
            .run(['apps'], function(apps) {

            var product = {
                payment_required: true,
                device_types: ['foo']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'not available for your region');
        }));


        it('apps.incompat android & firefoxos',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['desktop']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Firefox Desktop');
        }));


        it('apps.incompat desktop & firefoxos',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['android-mobile', 'android-tablet']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Android');
        }));

        
        it('apps.incompat desktop & android',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['firefoxos']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Firefox OS');
        }));


        it('apps.incompat firefoxos',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['desktop', 'android-mobile', 'android-tablet']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Desktop / Android');
        }));


        it('apps.incompat desktop',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['android-mobile', 'android-tablet', 'firefoxos']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Firefox Android / Firefox OS');
        }));


        it('apps.incompat android',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['desktop', 'firefoxos']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Desktop / Firefox OS');
        }));


        it('apps.incompat none',
           h.injector(mockCapabilities(false)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                price: '1.00',
                device_types: ['desktop', 'firefoxos', 'android-mobile', 'android-tablet']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'try this app on Firefox');
        }));


        it('apps.incompat payments unavailable',
           h.injector(mockCapabilities(true)).run(['apps'], function(apps) {
            var product = {
                payment_required: true,
                device_types: ['foo']
            };
            var results = apps.incompat(product);
            assert(results);
            assert.equal(results.length, 1);
            assert.equal(results[0], 'not available for your region');
        }));
    });
});
