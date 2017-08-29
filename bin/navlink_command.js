#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "/../"),
proc = require("child_process")

proc.fork(lib + "navlink.js", process.argv.slice(2), {execArgv: process.execArgv})
