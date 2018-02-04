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

var it = maybe(global)	
stop = !!process.env.DRY_RUN  
quiet = !!process.env.QUIET

var remove_cache = utils.remove_cache.bind(null, "r.js", "document_parse.js")
module.paths.unshift(path.join(__dirname, "/..", "/../"))

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 


	describe("Checking for dependencies..", function() { 

		it.skip("r_js in the system as a program", function(done) {
			stop = true 
			expect(fs.existsSync(rjs_path = require.resolve("requirejs")), "could not find r.js dependency").to.be.true
			stop = false 
			done()
		})

		it("git is available in the system as a program", function(done) {
			stop = true 
			utils.Spawner("git", [], function() {
				expect(true).to.be.true
				stop = false 
				done()
			}, function() {
				expect(false, "git is not available as a system program").to.be.true
				done()
			})
		})
	

	})

	describe("Checking parser.aquire_document in asynchronous mode to", function() {

		var requirejs, example_dir = path.join(__dirname, "/example")
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "/../lib"), nodeRequire: require})

		})

		describe("Using the testing example directory -> example/no_direcories", function() {

			it("was able to create a temporary git repository", function(done) {

				utils.Spawn("git", ["init"], function(code, stdout, stderr) {
			
					expect(stderr, stderr).to.be.empty	
						
					var stat
					try {
						stat = fs.statSync(".git")
						expect(stat.isDirectory(), "temp git repository was created successfully").to.be.true
						done()
					} catch(error) {
						expect(false, error).to.be.true
						done()
					}
				})
			})

			describe("aquires the base project data from the git repository", function() {

				describe("with no flags set", function(done) {

					it("finds the git repository root directory", function(done) {

						requirejs(["document_parse"], function(document_parse) { 

							var parser = document_parse()

							parser.relative_docs_dir = "../brace_document/docs"
							parser.find_git_root(process.cwd(), function(root) {
								expect(root).to.equal(process.cwd())
								expect(parser.project_root).to.equal(root)
								expect(parser.project_root).to.equal(process.cwd())

								expect(parser.relative_docs_dir).to.equal("../brace_document/docs")
								expect(parser.relative_backup_dir).to.be.empty

								done()
							}, function(error) {
								expect(false, error).to.be.true
								done()
							})
						})
					})

					it("finds the relative data with repository", function(done) {

						requirejs(["document_parse"], function(document_parse) { 

							var parser = document_parse()

							parser.relative_docs_dir = "../brace_document/docs"
							parser.find_git_root(process.cwd(), function(root) {
								parser.find_relative_data(root, function() {
									
									expect(parser.relative_docs_dir).to.equal("docs")
									expect(parser.relative_backup_dir).to.equal("docs")
									expect(parser._origin_url).to.have.keys(Object.keys(require("url").parse("")))
									expect(parser.origin_url).to.include(`https://`)
									expect(parser.origin_url).to.include(parser.relative_backup_dir)
									var branch = parser.branch
									utils.Spawn("git", ["branch"], function(code, stdout) {
										expect(stdout).to.include("* "+branch)
										done()
									})
								}, function(error) {
									expect(false, error).to.be.true
									done()
								})
							}, function(error) {
								expect(false, error).to.be.true
								done()
							})
						})
					})
				})

				describe("with the backup directory option used and verbose flag set", function(done) {

					it("finds the git repository root directory", function(done) {

						requirejs(["document_parse"], function(document_parse) { 

							var parser = document_parse()

							parser.relative_docs_dir = "../brace_document/docs"
							parser.backup = "../brace_document/docs_temp"
							parser.find_git_root(process.cwd(), function(root) {
								expect(root).to.equal(process.cwd())
								expect(parser.project_root).to.equal(root)
								expect(parser.project_root).to.equal(process.cwd())

								expect(parser.relative_docs_dir).to.equal("../brace_document/docs")
								expect(parser.relative_backup_dir).to.be.empty

								done()
							}, function(error) {
								expect(false, error).to.be.true
								done()
							})
						})
					})

					it("finds the relative data with repository", function(done) {

						requirejs(["document_parse"], function(document_parse) { 

							var parser = document_parse()

							parser.relative_docs_dir = "../brace_document/docs"
							parser.backup = "../brace_document/docs_temp"
							parser.find_git_root(process.cwd(), function(root) {
								parser.find_relative_data(root, function() {
									
									expect(parser.relative_docs_dir).to.equal("docs")
									expect(parser.relative_backup_dir).to.equal("docs_temp")
									expect(parser._origin_url).to.have.keys(Object.keys(require("url").parse("")))
									expect(parser.origin_url).to.include(`https://`)
									expect(parser.origin_url).to.include(parser.relative_backup_dir)
									var branch = parser.branch
									utils.Spawn("git", ["branch"], function(code, stdout) {
										expect(stdout).to.include("* "+branch)
										done()
									})
								}, function(error) {
									expect(false, error).to.be.true
									done()
								})
							}, function(error) {
								expect(false, error).to.be.true
								done()
							})
						})
					})
				})

				it("complains if the backup directory is outside the repository", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()

						parser.relative_docs_dir = "docs"
						parser.backup = "../../brace_document/docs_temp"
						parser.find_git_root(process.cwd(), function(root) {
							parser.find_relative_data(root, function() {
								
								expect(false).to.be.true
							}, function(error) {
								expect(true, error).to.be.true
								done()
							})
						}, function(error) {
							expect(false, error).to.be.true
							done()
						})
					})
				})

				it("does not complain if the docs directory is outside the repository but a backup directory is inside the project root", function(done) {

					requirejs(["document_parse"], function(document_parse) { 

						var parser = document_parse()

						parser.relative_docs_dir = "../../docs"
						// This will pass sense the backup_dir is inside the project root.
						parser.backup = "docs_temp"
						parser.find_git_root(process.cwd(), function(root) {
							parser.find_relative_data(root, function() {
								
								expect(true).to.be.true
								done()
							}, function(error) {
								expect(false, error).to.be.true
								done()
							})
						}, function(error) {
							expect(false, error).to.be.true
							done()
						})
					})
				})
						/*
						parser.url = option.url
						parser.sort = option.sort
						parser.verbose = option.verbose
						parser.quiet = option.quiet
						parser.reverse_sort = !!option.reverseSort
						// All off the file system calls will be appended with "Sync" so that the calls are synchronous.
						//	parser.synchronous = !!option.synchronous
						parser.backup = option.backup && String(option.backup) || ""
*/


			})
		})
	})
})

