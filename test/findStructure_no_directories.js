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

module.paths.unshift(path.join(__dirname, "..", ".."))
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 
		it("r_js in the system as a program", function(done) {
			it_will.stop = true 
			expect(fs.existsSync(rjs_path = require.resolve("requirejs")), "could not find r.js dependency").to.be.true
			it_will.stop = false 
			done()
		})

		it("git is available in the system as a program", function(done) {
			stop = true 
			utils.Spawner("git", [], function() {
				expect(true).to.be.true
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

		describe("with no flags set to the document_parser", function(done) {

			describe("creates the proper document structure using the directory: "+ path.join("example", "no_directories"), function() {

				it("with no flags set", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()
						parser.relative_docs_dir = path.join(__dirname, "example", "no_directories")

						parser.findPath(cwd, function() {

							parser.findStructure(function(structure) {

								expect(structure).to.be.a("array")
								// Note: it is not possible to asynchronously test the structure output without the sort flag set to something sense it can end 
								// up in any order. This is because the callback to any one particular fs command is based on many external factors (like drive IO).
								expect(structure.length).to.equal(4)
								expect(structure[0]).to.include(path.join(__dirname, "example", "no_directories"))
								expect(structure[1]).to.include(path.join(__dirname, "example", "no_directories"))
								expect(structure[2]).to.include(path.join(__dirname, "example", "no_directories"))
								expect(structure[3]).to.include(path.join(__dirname, "example", "no_directories"))
								done()

							}, function(error) {
								expect(true, error).to.be.false
								done()
							})
						}, function(error) {
							expect(true, error).to.be.false
							done()
						})
					})
				})

				it("with the sort flag set to alphanumeric", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()
						parser.sort = "alphanumeric"
						parser.relative_docs_dir = path.join(__dirname, "example", "no_directories")

						parser.findPath(cwd, function() {
							parser.findStructure(function(structure) {

								expect(structure).to.be.a("array")
								// these should be in alphanumerical order.
								expect(structure).to.deep.equal([
									path.join(__dirname, "example", "no_directories", "0wood.md"),
									path.join(__dirname, "example", "no_directories", "framers.md"), 
									path.join(__dirname, "example", "no_directories", "tools.md"),
									path.join(__dirname, "example", "no_directories", "wages.md")
								])
								done()

							}, function(error) {
								expect(true, error).to.be.false
								done()
							})
						}, function(error) {
							expect(true, error).to.be.false
							done()
						})
					})
				})

				it("with the reverse flag set and the sort flag set to alphanumeric", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()
						parser.sort = "alphanumeric"
						parser.reverse_sort = true
						parser.relative_docs_dir = path.join(__dirname, "example", "no_directories")

						parser.findPath(cwd, function() {
							parser.findStructure(function(structure) {

								expect(structure).to.be.a("array")
								// these should be in alphanumerical order.
								expect(structure).to.deep.equal([
									path.join(__dirname, "example", "no_directories", "wages.md"),
									path.join(__dirname, "example", "no_directories", "tools.md"),
									path.join(__dirname, "example", "no_directories", "framers.md"), 
									path.join(__dirname, "example", "no_directories", "0wood.md")
								])
								done()

							}, function(error) {
								expect(true, error).to.be.false
								done()
							})
						}, function(error) {
							expect(true, error).to.be.false
							done()
						})
					})
				})

			})
		})

	})

})

