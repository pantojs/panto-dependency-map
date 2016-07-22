/**
 * Copyright (C) 2016 pantojs.xyz
 * test.js
 *
 * changelog
 * 2016-07-05[22:39:17]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.2.1
 * @since 0.1.0
 */
'use strict';
const assert = require('assert');
const DependencyMap = require('../');

/*global describe,it*/
describe('DependencyMap', () => {
    describe('#add#resolve', () => {
        it('should walk the whole map', () => {
            const dm = new DependencyMap();
            dm.add('a.js', 'b.js', 'c.js');
            dm.add('a.css', 'a.jpg', 'a.eot');
            dm.add('d.js', 'a.js', 'e.js', 'a.css');
            dm.add('a.html', 'a.js', 'b.js', 'a.css', 'b.css', 'a.png');
            let dp = dm.resolve('b.js');
            assert.deepEqual(dp.sort(), ['a.html', 'a.js', 'd.js'], 'b.js');

            dp = dm.resolve('c.js');
            assert.deepEqual(dp.sort(), ['a.html', 'a.js', 'd.js'], 'c.js');

            dp = dm.resolve('a.jpg');
            assert.deepEqual(dp.sort(), ['a.css', 'a.html', 'd.js'], 'a.jpg');

            dp = dm.resolve('a.eot');
            assert.deepEqual(dp.sort(), ['a.css', 'a.html', 'd.js'], 'a.eot');

            dp = dm.resolve('a.css');
            assert.deepEqual(dp.sort(), ['a.html', 'd.js'], 'a.css');

            dp = dm.resolve('b.css');
            assert.deepEqual(dp.sort(), ['a.html'], 'b.css');

            dp = dm.resolve('a.png');
            assert.deepEqual(dp.sort(), ['a.html'], 'a.png');

            dp = dm.resolve('e.js');
            assert.deepEqual(dp.sort(), ['d.js'], 'e.js');

            dp = dm.resolve('a.html', 'd.js');
            assert.deepEqual(dp.sort(), [], 'a.html+d.js');

            dp = dm.resolve('a.jpg', 'b.js');
            assert.deepEqual(dp.sort(), ['a.css', 'a.html', 'a.js', 'd.js'], 'a.jpg+b.js');

        });
        it('should support circle', () => {
            const dm = new DependencyMap();
            dm.add('a.js', 'b.js');
            dm.add('b.js', 'c.js');
            dm.add('c.js', 'a.js');

            let dp = dm.resolve('c.js');
            assert.deepEqual(dp.sort(), ['a.js', 'b.js'], 'c.js');

            dp = dm.resolve('a.js');
            assert.deepEqual(dp.sort(), ['b.js', 'c.js'], 'a.js');

            dp = dm.resolve('b.js');
            assert.deepEqual(dp.sort(), ['a.js', 'c.js'], 'b.js');
        });
        it('should support match', () => {
            const dm = new DependencyMap();
            dm.add('a.js', 'b.jpg');
            dm.add('a.html', '*.js');
            dm.add('b.html', '*.js');

            let dp = dm.resolve('b.jpg');
            assert.deepEqual(dp.sort(), ['a.html', 'a.js', 'b.html'], 'b.jpg');
        });
    });
    describe('#clear', () => {
        it('should clear', () => {
            const dm = new DependencyMap();
            dm.add('a.js', 'b.jpg');
            let dp = dm.resolve('b.jpg');
            assert.deepEqual(dp.sort(), ['a.js'], 'b.jpg');
            dm.clear();
            dp = dm.resolve('b.jpg');
            assert.deepEqual(dp.sort(), [], 'b.jpg');
            dm.add('a.js', 'b.jpg');
            dm.clear('a.js');
            dp = dm.resolve('b.jpg');
            assert.deepEqual(dp.sort(), [], 'b.jpg');
        });
    });
});