/* Copyright (c) 2018 Robert Steckroth [<RobertSteckroth@gmail.com>](mailto:RobertSteckroth@gmail.com)

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
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var cache = utils.cacheManager(require)
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	this.timeout(9000)

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

	describe("addStructureEntry is working appropriately", function() {

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

		it("with an empty subdirectory parameter", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				var list = parser.addStructureEntry(structure, "./")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )
				expect(list).to.deep.equal(structure)	

				list = parser.addStructureEntry(structure, ".")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )
				expect(list).to.deep.equal(structure)	

				parser.addStructureEntry(structure, "", function(list) {
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )
					expect(list).to.deep.equal(structure)	
					done()
				}, function(error) { expect(false, "Should not have errored").to.be.true; done() })
			})
		})

		it("with an existing single directory and filename", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				var list = parser.addStructureEntry(structure, "there/cooljoes.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", path.join("there", "cooljoes.md") ], }, "/home/my/module/cool.md", ] )
				expect(list).to.deep.equal(structure)
				
				done()
			})
		})

		it("with an existing single directory using a relative path identifier", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				list = parser.addStructureEntry(structure, "./there/cooljoes.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", path.join("there", "cooljoes.md") ], }, "/home/my/module/cool.md", ] )
				done()
			})
		})
		it("with an existing single directory using a relative path identifier in win32 format", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				list = parser.addStructureEntry(structure, ".\\there\\cooljoes.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", path.join("there", "cooljoes.md") ], }, "/home/my/module/cool.md", ] )
				done()
			})
		})
		it("with an existing double directory", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "there/more/cooljoes.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", path.join("there", "more", "cooljoes.md")  ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				done()
			})
		})
		it("with an existing double directory in win32 format", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "there\\more\\cooljoes.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", path.join("there", "more", "cooljoes.md")  ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				done()
			})
		})

		it("with a non-existant double subdirectory", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "cool/Joes/good.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", {"cool": [ {"Joes": [ path.join("cool", "Joes", "good.md") ]}]} ] )

				done()
			})
		})

		it("with a non-existant double subdirectory in win32 format", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "cool\\Joes\\good.md")
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", {"cool": [ {"Joes": [ path.join("cool", "Joes", "good.md") ]}]} ] )

				done()
			})
		})

		it("with a non-existant double subdirectory inside a existing directory in win32 format", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "there\\more\\cool\\joes\\good.md", function(structure) {
					
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", {"cool": [ {"joes": [ path.join("there", "more", "cool", "joes", "good.md") ]}]} ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md",  ] )
					done()
				})
			})
		})

		it("with a duplicate entry inside an existing subdirectory", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "there/more/cool/joes/good.md", function(structure) {
					
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", {"cool": [ {"joes": [ path.join("there", "more", "cool", "joes", "good.md") ]}]} ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md",  ] )

					parser.addStructureEntry(structure, "there/more/cool/joes/good.md", function(structure) {
						expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", {"cool": [ {"joes": [ path.join("there", "more", "cool", "joes", "good.md") ]}]} ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md",  ] )

						done()
					})
				})
			})
		})
		it("with a duplicate entry inside an existing subdirectory in win32 format", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				parser.addStructureEntry(structure, "there\\more\\cool\\joes\\good.md", function(structure) {
					
					expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", {"cool": [ {"joes": [ path.join("there", "more", "cool", "joes", "good.md") ]}]} ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md",  ] )

					parser.addStructureEntry(structure, "there\\more\\cool\\joes\\good.md", function(structure) {
						expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md", {"cool": [ {"joes": [ path.join("there", "more", "cool", "joes", "good.md") ]}]} ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md",  ] )

						done()
					})
				})
			})
		})
		it("with a directory which is absolute", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				var param = "/there/more/cool/joes"
				parser.addStructureEntry(structure, param, function() {
					expect(false, "The absolute directory should have errored instead.").to.be.true
					done()
				}, function(error) {

					expect(error.toString()).to.include("The directory parameter " + param + " must be relative (not contain a root). Found / as the root.")
					done()
				})
			})
		})
		
		it("with a directory which is absolute for win32", function(done) {
			requirejs(["./document_parse"], function(document_parse) { 

				var parser = document_parse()
				expect(structure).to.deep.equal([ "/home/my/module/joes.md", { "there": [ { "more": [ "/aaaa/my/module/bbbb.md", "/home/my/module/aaaa.md" ], }, "/home/my/module/joes.md", ], }, "/home/my/module/cool.md", ] )

				var param = "C:\\there\\more\\cool\\joes"
				parser.addStructureEntry(structure, param, function() {
					expect(false, "The absolute directory should have errored instead.").to.be.true
				}, function(error) {
					expect(error.toString()).to.include("The directory parameter " + param + " must be relative (not contain a root). Found C:\\ as the root.")

					param = "\\there\\more\\cool\\joes"
					parser.addStructureEntry(structure, param, function() {
						expect(false, "The absolute directory should have errored instead.").to.be.true
						done()
					}, function(error) {
						expect(error.toString()).to.include("The directory parameter " + param + " must be relative (not contain a root). Found \\ as the root.")
						done()
					})

				})
			})
		})
	})
})

