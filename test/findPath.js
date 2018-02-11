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

 Author: Robert Edward Steckroth, BustOut, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var remove_cache = utils.remove_cache.bind(null, "r.js", "document_parse.js")
var it_will = global

describe("using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET
	
	describe("checking for dependencies..", function() { 

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

	describe("using the blank testing example directory -> " + path.join("test", "example"), function() {

		var cwd = path.join(__dirname, "example"), requirejs
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})

		})

		it("is able to create a git repository in the example directory if there is not one already", function(done) {

			utils.Spawn("git", ["init"], {cwd: cwd}, (code, stdout, stderr) => {
				expect(true, stdout+"  "+stderr).to.be.true	
				done()
			}, function(error) {
				expect(false, error).to.be.true	
				done()
			})
		})

		describe("with no flags set to the document_parser", function(done) {

			it("finds the correct path data for the project", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.relative_docs_dir = path.join("..", "example")

					parser.findPath(cwd, function() {

						expect(parser.project_root).to.equal(cwd)
						expect(parser.docs_dir).to.equal(path.join(__dirname, "example"))
						expect(parser.backup_dir).to.equal(path.join(__dirname, "example"))
						// The current directory is resolved from the path set via the constructor.
						expect(parser.relative_docs_dir).to.equal("."+path.sep)
						// Should be the same as the relative_docs_dir if it is not provided.
						expect(parser.relative_backup_dir).to.equal(parser.relative_docs_dir)
						done()

					}, function(error) {
						expect(false, error).to.be.true
						done()
					})
				})
			})

		})

		describe("with the backup directory option used and verbose flag set", function(done) {

			it("finds the correct path data for the project", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.relative_docs_dir = path.join("..", "example")
					parser.backup = path.join("..", "example", "backup_docs")

					parser.findPath(cwd, function() {

						expect(parser.project_root).to.equal(cwd)
						// Both of these paths should be resolved to the cwd and have the correct data.
						expect(parser.relative_docs_dir).to.equal("."+path.sep)
						expect(parser.project_root).to.equal(cwd)
						expect(parser.backup_dir).to.equal(path.join(__dirname, "example", "backup_docs"))
						expect(parser.relative_backup_dir).to.equal("backup_docs")
						done()

					}, function(error) {
						expect(false, error).to.be.true
						done()
					})
				})
			})

			it("complains if the backup directory is outside the repository", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.relative_docs_dir = "docs"
					parser.backup = path.join("..", "..", "brace_document", "docs_temp")

					parser.findPath(cwd, function() {
					expect(false, "The error callback should have been called instead of this").to.be.true

					}, function(error) {
						expect(error.toString()).to.include("The directory to use for the documents:")
						expect(error.toString()).to.include("resides outside the repository root directory of: "+cwd)
						done()
					})
				})
			})

			it("does not complain if the initial document directory is outside the repository but a backup directory is" +
				" inside the project root", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.verbose = true
					parser.relative_docs_dir = path.join("..", "..")
					// This will pass sense the backup directory is inside the project root.
					parser.backup = "docs_temp"
					parser.findPath(cwd, function() {

						// Not going to test for normal logging output so this means everything worked correctly.
						expect(true).to.be.true
						done()

					}, function(error) {
						expect(false, error).to.be.true
						done()
					})
				})
			})

		})
	})


})

