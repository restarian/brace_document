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
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

module.paths.unshift(path.join(__dirname, "..", ".."))
var remove_cache = utils.remove_cache.bind(null, "r.js", "document_parse.js")
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		/*
		it("r_js in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e;}})(), "could not find r.js dependency").to.be.true
			it_will.stop = false 
			done()
		})
		*/

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

	describe("the CLI returns the proper codes and string output when using", function() {

		var captured_text, cwd = path.join(__dirname, "..", "bin")
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
		})

		it("the help option", function(done) {
			utils.Spawn("node", ["document.js", "-h"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
				// commander exits 0 on help exit
				expect(exit_code).to.equal(0)
				expect(stdout).to.include("-- Brace Document "+ require("brace_document/package.json").version + "  --------------")
				done()
			}, function(error) { expect(false, error).to.be.true; done() })

		})

		it("the plugins option", function(done) {
			utils.Spawn("node", ["document.js", "--plugins"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
				expect(exit_code).to.equal(2)
				expect(stdout).to.include("Available plugins:\nbrace_document_navlink ->")
				done()
			}, function(error) { expect(false, error).to.be.true; done() })

		})

		it("only the dryRun option", function(done) {
			utils.Spawn("node", ["document.js", "-v", "--dry-run", "--no-color"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
				expect(exit_code).to.equal(7)
				expect(stdout).to.include("Using git repository at "+ path.join(__dirname, ".."))
				done()
			}, function(error) { expect(false, error).to.be.true; done() })

		})

		it("a non-available option set", function(done) {
			utils.Spawn("node", ["document.js", "-v", "--dry-run", "--bad-option"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
				expect(exit_code).to.equal(1)
				done()
			}, function(error) { expect(false, error).to.be.true; done() })

		})
	})

})

