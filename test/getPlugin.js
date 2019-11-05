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

// Needed because mocha does not use the nodejs function wrapper for modules.
global.module = module

var cache = utils.cacheManager(require)
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		it("r_js in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e; }})()).to.be.true 
			it_will.stop = false 
			done()
		})
		it("brace_document_navlink is in the system as a program", function(done) {
			it_will.stop = true 
			try {
				module.require("brace_document_navlink")
				it_will.stop = false 
				done()
			} 
			catch(error) {
				expect(false, "Brace_document_navlink is not installed in the system").to.be.true
				done()
			}
		})

	})

	describe("finds all of the commonjs modules which are plugins to this module with", function() {

		var cwd = path.join(__dirname, "example"), requirejs
		beforeEach(function() {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
		})
		afterEach(cache.dump.bind(cache))

		it("passing in a path to getPlugin", function(done) {
			requirejs(["document_parse"], function(document_parse) { 

				var test_path = path.join(__dirname, "example")
				var parser = document_parse()

				parser.getPlugin(test_path, function(data) {

					expect(data).to.be.an("object").that.have.all.keys(["collect", "directory", "first", "last"])
					expect(data.directory).to.be.an("array")
					expect(data.directory, "There bracket_document_testplugin was not found at " + test_path).to.have.length(1)
					expect(data.directory[0]).to.include({name: "bracket_document_testplugin"})
					done()

				}, function(error) { expect(true, error).to.be.false; done() })
			})
		})
		it("passing in a path to getPlugin that ends with node_modules", function(done) {
			requirejs(["document_parse"], function(document_parse) { 

				var test_path = path.join(__dirname, "example", "node_modules")
				var parser = document_parse()

				parser.getPlugin(test_path, function(data) {

					expect(data).to.be.an("object").that.have.all.keys(["collect", "directory", "first", "last"])
					expect(data.directory).to.be.an("array")
					expect(data.directory, "There bracket_document_testplugin was not found at " + test_path).to.have.length(1)
					expect(data.directory[0]).to.include({name: "bracket_document_testplugin"})
					done()

				}, function(error) { expect(true, error).to.be.false; done() })
			})
		})
		it("passing in a path to getPlugin and setting a pluginRegex", function(done) {
			requirejs(["document_parse"], function(document_parse) { 

				var test_path = path.join(__dirname, "example")
				var parser = document_parse()
				parser.option.pluginRegex = "^test_plug"

				parser.getPlugin(test_path, function(data) {

					expect(data).to.be.an("object").that.have.all.keys(["collect", "directory", "first", "last"])
					expect(data.first).to.be.an("array")
					expect(data.first, "test_plugin was not found at " + test_path).to.have.length(1)
					expect(data.first[0]).to.include({name: "test_plugin"})
					done()

				}, function(error) { expect(true, error).to.be.false; done() })
			})
		})
	})
})

