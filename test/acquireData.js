/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

	Brace document resides under the MIT licensed.

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

  Brace document is platform which hosts document management and generation plugins.

  this file is a part of Brace document */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var it_will = global
global.module = module
var cache = utils.cacheManager(require)

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

	describe("using the testing example directory -> " + path.join("test", "example"), function() {

		var cwd = path.join(__dirname, "example"), requirejs
		beforeEach(function() {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
		})

		afterEach(cache.dump.bind(cache))

		var test_path = path.join(__dirname, "example", "directories")

		describe("creates the proper document data object using the directory: "+ test_path, function() {

			it("with directories contained in the structrure", function(done) {
				requirejs(["./document_parse"], function(document_parse) { 

					document_parse(function() {
						this.option.recursive = true
						this.option.input = test_path

						this.findPath(cwd, () => {
							this.findStructure((structure) => {
								this.acquireData(structure, (data) => {

									expect(data).to.be.a("object")
									// Note: it is not possible to asynchronously test the structure output without the sort flag set to something sense it can end 
									// up in any order. This is because the callback to any one particular fs command is based on many external factors (like drive IO).
									expect(Object.keys(data).length).to.equal(5)
									expect(data[path.join(test_path, "framers.md")]).to.be.a("object")
									var all = Object.keys(data), key
									expect(data[key = all.pop()].content).to.be.a("string")
									expect(data[key = all.pop()].content).to.be.a("string")
									expect(data[key = all.pop()].content).to.be.a("string")
									expect(data[key = all.pop()].content).to.be.a("string")
									expect(data[key = all.pop()].content).to.be.a("string")
									done()

								}, function(error) { expect(true, error).to.be.false; done() })
							}, function(error) { expect(true, error).to.be.false; done() })
						}, function(error) { expect(true, error).to.be.false; done() })

					})
				})
			})
		})
	})
})

