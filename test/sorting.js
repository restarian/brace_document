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

  Brace document is module to automatically add markdown page navigation links.

  this file is a part of Brace document 

 Author: Robert Steckroth, BustOut, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var cache = utils.cacheManager(require)
var it_will = global

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

		/*
		it("git is available in the system as a program", function(done) {
			it_will.stop = true 
			utils.Spawn("git", [], function() {
				expect(true).to.be.true
				it_will.stop = false 
				done()
			}, function() {
				expect(false, "git is not available as a system program").to.be.true
				done()
			})
		})
		*/

	})

	describe("sorting is handled appropriately", function() {

		afterEach(cache.dump.bind(cache))
		var structure
		beforeEach(function() {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})

			structure = [
				"/home/my/module/joes.md",
				{ 
					"there": [
						{ 
							"more": [ 
								"/aaaa/my/module/bbbb.md",
								"/home/my/module/aaaa.md"
							],
						},
						"/home/my/module/joes.md",
					],
				},
				"/home/my/module/cool.md",
			]
		})

		describe("using the sortList API member the", function() {

			it("sort alphanumeric option", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )
					parser.sortList(structure)
					expect(structure).to.deep.equal([ "/home/my/module/cool.md", "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, ] )

					done()
				})
			})

			it("sort alphanumeric option with reverseSort", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.reverseSort = true 
					parser.sortList(structure)
					expect(structure).to.deep.equal([{ "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/joes.md",  "/home/my/module/cool.md", ] )

					done()
				})
			})

			it("sort depth option with reverseSort", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth" 
					parser.option.reverseSort = false
					parser.sortList(structure, () => {
						expect(structure).to.deep.equal([ "/home/my/module/cool.md", "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, ] )
					done()
					})
				})
			})
					
			it("sort depth option", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth" 
					parser.option.reverseSort = true
					parser.sortList(structure)
					expect(structure).to.deep.equal([{ "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", "/home/my/module/joes.md",  ] )
				
					done()
				})
			})

		})

		describe("using the sortStructure API member the", function() {

			it("sort alphanumeric option", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.reverseSort = false
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

					done()
				})
			})

			it("sort alphanumeric option with reverseSort", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.reverseSort = true
					parser.sortStructure(structure)
					expect(structure).to.deep.equal([ { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", ], }, "/home/my/module/joes.md", ], }, "/home/my/module/joes.md", "/home/my/module/cool.md", ] )

					done()
				})
			})

			it("sort depth option", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth" 
					parser.option.reverseSort = false 
					parser.sortStructure(structure, () => {
						expect(structure).to.deep.equal([ "/home/my/module/cool.md", "/home/my/module/joes.md", { "there": [ "/home/my/module/joes.md", { "more": [ "/home/my/module/aaaa.md", "/aaaa/my/module/bbbb.md", ], }, ], }, ] )
					done()
					})
				})
			})
				
			it("sort depth option with reverseSort", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth" 
					parser.option.reverseSort = true 
					parser.sortStructure(structure)
					expect(structure).to.deep.equal([{ "there": [ { "more": [ "/home/my/module/aaaa.md", "/aaaa/my/module/bbbb.md", ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", "/home/my/module/joes.md",  ] )

					done()
				})
			})

		})

	})
})

