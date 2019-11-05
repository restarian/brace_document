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
var it_will = global
global.module = module

describe("using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET
	
	describe("checking for dependencies..", function() { 

		it("r_js in the system as a program", function(done) {
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

	describe("using the blank testing example directory -> " + path.join("test", "example"), function() {

		var cwd = path.join(__dirname, "example"), requirejs
		beforeEach(function() {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
		})
		afterEach(cache.dump.bind(cache))

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

			it.skip("complains if the project root directory is not inside a git repository", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.input = "docs"

					parser.setPath(path.join("..", ".."), function() {
						expect(false, "The error callback should have been called instead of this").to.be.true
						done()

					}, function(error) {
					
						expect(error, error).to.include("Not a git repository")
						done()
					})
				})
			})
			it("finds the correct path data for the project", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.input = path.join("..", "example")

					parser.setPath(cwd, function() {

						// The current directory is resolved from the path set via the constructor.
						expect(parser.project_root).to.equal(cwd)
						expect(parser.docs_dir).to.equal(path.join(__dirname, "example"))
						expect(parser.backup_dir).to.equal(path.join(__dirname, "example"))
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
					parser.option.input = path.join("..", "example")
					parser.option.backup = path.join("..", "example", "backup_docs")

					parser.setPath(cwd, function() {

						expect(parser.project_root).to.equal(cwd)
						// Both of these paths should be resolved to the cwd and have the correct data.
						expect(parser.project_root).to.equal(cwd)
						expect(parser.backup_dir).to.equal(path.join(__dirname, "example", "backup_docs"))
						done()

					}, function(error) {
						expect(false, error).to.be.true
						done()
					})
				})
			})
			it("finds the correct path data for the project without a directory argument and no projectLocation option set", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()

					parser.setPath(function() {

						expect(parser.project_root).to.equal(path.join(__dirname, ".."))
						expect(parser.project_root).to.equal(parser.backup_dir)
						expect(parser.docs_dir).to.equal(parser.backup_dir)
						done()

					}, function(error) {
						expect(false, error).to.be.true
						done()
					})
				})
			})
			it("finds the correct path data for the project without a directory argument and the projectLocation option set", function(done) {
				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.projectLocation = cwd
					parser.setPath(function() {

						expect(parser.project_root).to.equal(cwd)
						expect(parser.project_root).to.equal(parser.backup_dir)
						expect(parser.docs_dir).to.equal(parser.backup_dir)
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
					parser.option.input = "docs"
					parser.option.backup = path.join("..", "..", "brace_document", "docs_temp")

					parser.setPath(cwd, function() {
						expect(false, "The error callback should have been called instead of this").to.be.true
						done()

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
					parser.option.input = path.join("..", "..")
					// This will pass sense the backup directory is inside the project root.
					parser.option.backup = "docs_temp"
					parser.setPath(cwd, function() {

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

