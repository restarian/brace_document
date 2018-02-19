/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

	Brace Document resides under the MIT licensed.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  Brace Document is module to automatically add markdown page navigation links.

  this file is a part of Brace Document 

 Author: Robert Edward Steckroth II, BustOut, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var remove_cache = utils.remove_cache.bind(null, "r.js", "document_parse.js")
var it_will = global
global.module = module

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		it("r_js in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e;}})(), "could not find r.js dependency").to.be.true
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

	describe("using the testing example directory -> " + path.join("test", "example"), function() {

		var cwd = path.join(__dirname, "example"), requirejs
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})

		})

		it("is able to create a git repository in the example directory if their is not one already", function(done) {

			utils.Spawn("git", ["init"], {cwd: cwd}, (code, stdout, stderr) => {
				expect(true, stdout+"  "+stderr).to.be.true	
				done()
			}, function(error) {
				expect(false, error).to.be.true	
				done()
			})
		})

		var test_path = path.join(__dirname, "example", "directories")

		describe("creates the proper document data object using the directory: "+ test_path, function() {

			it("with directories contained in the structrure", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.recursive = true
					parser.relative_docs_dir = test_path

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {
							parser.acquireData(structure, function(data) {

								expect(data).to.be.a("object")
								// Note: it is not possible to asynchronously test the structure output without the sort flag set to something sense it can end 
								// up in any order. This is because the callback to any one particular fs command is based on many external factors (like drive IO).
								expect(Object.keys(data).length).to.equal(5)
								expect(data[path.join(test_path, "framers.md")]).to.be.a("object").that.includes({
									file_name: "framers.md",
									secondary_heading: "##### Carpentry is for people \n\n",
									primary_heading: "# Directories Example Page \n",
								})

								var all = Object.keys(data), key
								expect(data[key = all.pop()].content).to.include(data[key].primary_heading).that.include(data[key].secondary_heading)
								expect(data[key = all.pop()].content).to.include(data[key].primary_heading).that.include(data[key].secondary_heading)
								expect(data[key = all.pop()].content).to.include(data[key].primary_heading).that.include(data[key].secondary_heading)
								expect(data[key = all.pop()].content).to.include(data[key].primary_heading).that.include(data[key].secondary_heading)
								expect(data[key = all.pop()].content).to.include(data[key].primary_heading).that.include(data[key].secondary_heading)
								done()

							}, function(error) { expect(true, error).to.be.false; done() })
						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})
		})
	})
})

