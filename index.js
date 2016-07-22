/**
 * Copyright (C) 2016 pantojs.xyz
 * dependency-map.js
 *
 * Dependency map represents a multiple
 * to multiple dependency relation.
 *
 * For example,
 * 
 * a.js   -> b.js
 *        -> c.js
 * a.css  -> a.jpg
 *        -> a.eot
 * d.js   -> a.js
 *        -> e.js
 *        -> a.css
 * a.html -> a.js
 *        -> b.js
 *        -> a.css
 *        -> b.css
 *        -> a.png
 *
 * Now we have a graph:
 * 
 * --------------------------
 * a.html -> a.js  -> b.js
 *                 -> c.js
 *        -> a.css -> a.jpg
 *                 -> a.eot
 *        -> b.css
 *        -> a.png
 * --------------------------
 * d.js   -> a.js  -> b.js
 *                 -> c.js
 *        -> e.js
 *        -> a.css -> a.jpg
 *                 -> a.eot
 * --------------------------
 *
 * Note that any change on a node MUST
 * affect its ancestors, so we have to
 * be able to find all the ancestors of
 * the node.
 * 
 * changelog
 * 2016-07-05[22:32:35]revised
 * 2016-07-22[12:33:47]:support match
 *
 * @author yanni4night@gmail.com
 * @version 0.2.0
 * @since 0.1.0
 */
'use strict';

const uniq = require('lodash/uniq');
const defineFrozenProperty = require('define-frozen-property');
const minimatch = require('minimatch');

/** Class representing a dependency map */
class DependencyMap {
    constructor() {
        defineFrozenProperty(this, '_map', new Map());
    }
    /**
     * Add a dependency pair. The KEY depends
     * on the VALUEs.
     * 
     * @param {string}    key
     * @param {...string} values
     */
    add(key, ...values) {
        let deps = this._map.get(key);

        if (!deps) {
            this._map.set(key, (deps = [])) ;
        }

        values.forEach(dep => {
            if (dep !== key) {
                deps.push(dep);
            }
        });

        return this;
    }
    /**
     * Unlink a dependency pair, or all pairs
     * if KEY is not present.
     * 
     * @param  {string|undefined} key
     * @return {DependencyMap} this
     */
    clear(key) {
        if (!key) {
            this._map.clear();
        } else {
            this._map.remove(key);
        }
        return this;
    }
    /**
     * Resolve the files who depend on the KEYs.
     * 
     * @param  {...string} keys
     * @return {Array}
     */
    resolve(...keys) {
        const result = [];

        uniq(keys).map(key => {
            this.resolveKey(key, result, key);
        });

        return result;// It's unique!
    }
    /**
     * Resolve the files who depend on a KEY.
     *
     * Preventing from "A" depends on "A", <b>ignore</b>
     * takes the origin key.
     * 
     * @param  {string} key
     * @param  {Array} result The dependencies
     * @param  {string} ignore
     * @return {undefined}
     */
    resolveKey(key, result, ignore) {
        for (let [dfn, deps] of this._map) {
            if (result.indexOf(dfn) === -1 && dfn !== key && dfn !== ignore) {
                let found = false;
                for (let i = 0; i < deps.length; ++i) {
                    if (deps[i] === key || minimatch(key, deps[i])) {
                        result.push(dfn);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    this.resolveKey(dfn, result, ignore);
                }
            }
        }
    }
}

module.exports = DependencyMap;