"use strict";

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
    plugins : [
        babel({
            presets: [
                ['es2015', {modules: false}]
            ]
        }),
        nodeResolve({
            jsnext : true,
            main : true
        })
    ]
}