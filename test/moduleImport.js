/* Copyright (c) 2020 Robert Steckroth, Bust0ut <RobertSteckroth@gmail.com>

Brace document resides under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  this file is a part of Brace document 

  Brace document is plugin platform which caters to automatic markdown generation.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var cache = utils.cacheManager(require)
module.paths.unshift(path.join(__dirname, "..", ".."))
var it_will = global
global.module = module

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		it("requirejs in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e; }})()).to.be.true 
			it_will.stop = false 
			done()
		})

		it("git is available in the system as a program", function(done) {
			it_will.stop = true 
			utils.Spawn("git", [], function() {
				it_will.stop = false 
				done()
			}, function() {
				expect(false, "git is not available as a system program").to.be.true
				done()
			})
		})

	})

	var err_cb = function(error) { 
		expect(false, error).to.be.true
		done() 
	}

	describe("using the testing example directory -> " + path.join("test", "example"), function() {

		var requirejs, parser
		beforeEach(function(done) {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
			requirejs(["./brace_document"], function(brace_document) { 
				parser = brace_document 
				done()
			})
		})
		afterEach(cache.dump.bind(cache))

		it("the module will load when not passed any option data to it", function(done) {
			parser("text", (exit_code) => {
				
			//	expect(exit_code).to.equal(2)
				done()
			}, err_cb)
		})
		it("the module will laod the proper plugins when given a plugin path and plugin regex", function(done) {
			parser({plugins: true, pluginPath: path.join(__dirname, "example"), pluginRegex: ".*testplugin$"}, (exit_code) => {

				//expect(exit_code).to.equal(9)
				done()
			}, err_cb)
		})
		it("the module will load when not passed any option data to it", function(done) {
			parser(null, (exit_code) => {
				
			//	expect(exit_code).to.equal(2)
				done()
			}, err_cb)
		})
		it("the module will load when bad option data is passed to it", function(done) {
			parser({"badOption": true}, (exit_code) => {
				
			//	expect(exit_code).to.equal(2)
				done()
			}, err_cb)
		})
	})
})

