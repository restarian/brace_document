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
module.paths.unshift(path.join(__dirname, "/..", "/../"))
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
	})

	describe("Checking parser.aquire_data in asynchronous mode to", function() {

		var requirejs, example_dir = path.join(__dirname, "/example")
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "/../lib"), nodeRequire: require})

		})

		describe("Using the testing example directory -> example/direcories", function() {

			describe("Creates the proper document object from a structure", function() {

				// Note: it is not possible to asynchronously test the structure output without the sort flag set to something sense it can end 
				// up in any order. This is because the callback to any one particular fs command is based on many external factors (like drive IO).
				it("with no flags set", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()

						parser.aquire_structure(path.join(example_dir, "/", "directories"), function(structure) {

							expect(structure).to.be.a("array")
							// This can still be checked in asynchronous mode sense there should only be one entry in the structure here.
							expect(structure).to.deep.equal([
								path.join(example_dir, "/", "directories", "/", "framers.md"), 
							])

							parser.aquire_document(structure, function(document_data) {
								expect(Object.keys(document_data).length).to.equal(1)
								Object.keys(document_data).forEach(function(value, index, proto) {

									var doc = this[value]
									// These are the same sense no_directories does not contain any sub-directories.
									expect(doc.dir).to.equal(doc.working_dir)
									expect(doc.relative_dir).to.be.empty
									expect(doc.file_name).to.equal(path.basename(value))

									// End the test at the end of the iteration.
									if ( index === proto.length-1 )
										done()
										
								}, document_data)

							})

						}, function(error) {
							expect(true, error).to.be.false
							done()
						})
					})
				})

				it("with the sort option set to alphanumeric and the recursive flag set", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()
						parser.recursive = true
						parser.sort = "alphanumeric" 

						parser.aquire_structure(path.join(example_dir, "/", "directories"), function(structure) {

							expect(structure).to.be.a("array")
							expect(structure).to.deep.equal([
								path.join(example_dir, "/", "directories", "/framers.md"),
								{ 
									"logistics": [ path.join(example_dir, "/", "directories", "/logistics", "/wages.md") ]
								},
								{ 
									"resorces": [
										 path.join(example_dir, "/", "directories", "/resorces", "/0wood.md"), 
										 path.join(example_dir, "/", "directories", "/resorces", "/tools.md"),
									]
								},
							])

							parser.aquire_document(structure, function(document_data) {
								expect(Object.keys(document_data).length).to.equal(4)
								Object.keys(document_data).forEach(function(value, index, proto) {

									var doc = this[value]
									// These are the same sense no_directories does not contain any sub-directories.
									if ( typeof doc !== "object" ) {
										expect(doc.dir).to.equal(doc.working_dir)
										expect(doc.relative_dir).to.be.empty
										expect(doc.file_name).to.equal(path.basename(value))
									}
									else {

										//expect(path.parse(doc.relative_dir).base).to.equal(value)

									}
									// End the test at the end of the iteration.
									if ( index === proto.length-1 )
										done()
										
								}, document_data)

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

