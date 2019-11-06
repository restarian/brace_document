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
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

module.paths.unshift(path.join(__dirname, "..", ".."))
var cache = utils.cacheManager(require)
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

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
	})

	var err_cb = function(error) { 
		expect(false, error).to.be.true
		done() 
	}

	describe("the CLI returns the proper codes and string output when using", function() {

		var cwd = path.join(__dirname, "..", "bin")
		beforeEach(function() {
			cache.start()
		})
		afterEach(cache.dump.bind(cache))

		it("the help option", function(done) {
			utils.Exec("node", ["document.js", "-h"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
				// commander exits 0 on help exit
				//expect(exit_code).to.equal(0)
				
				expect(stdout).to.include("-- Brace Document " + require(path.join(__dirname, "..", "package.json")).version + "  --------------")
				done()
			}, err_cb)

		})
		it("the plugins option", function(done) {
			utils.Exec("node", ["document.js", "--plugins"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
//				expect(exit_code).to.equal(9)
				expect(stdout).to.include("brace_document_navlink :")
				done()
			}, err_cb)

		})
		it("only the dryRun option", function(done) {
			utils.Exec("node", ["document.js", "-v", "--dry-run", "--no-color"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
//				expect(exit_code).to.equal(2)
				expect(stdout).to.include("Using git repository at "+ path.join(__dirname, ".."))
				done()
			}, err_cb)

		})
		it("a non-available option set", function(done) {
			utils.Exec("node", ["document.js", "-v", "--dry-run", "--bad-option"], {cwd: cwd}, function(exit_code, stdout, stderr) { 
				
//				expect(exit_code).to.equal(1)
				done()
			}, err_cb)
		})
		it("the npm run make_docs command", function(done) {
			utils.Exec("npm", ["run", "make_docs", "--", "--dry-run"], {cwd: path.join(__dirname, "..")}, function(exit_code, stdout, stderr) { 
				
				done()
			}, err_cb)
		})
		it("the npm run make_docs command", function(done) {
			utils.Exec("npm", ["run", "make_docs", "--", "-v", "--no-color", "--dry-run"], {cwd: path.join(__dirname, "..")}, function(exit_code, stdout, stderr) { 
				expect(stdout).to.include("FINISHED")
				expect(stdout).to.include("Using git repository at "+ path.join(__dirname, ".."))
				done()
			}, err_cb)
		})
		it("the npm run make_docs command", function(done) {
			utils.Exec("npm", ["run", "make_docs", "--", "-v", "--no-color", "--plugins", "--dry-run"], {cwd: path.join(__dirname, "..")}, function(exit_code, stdout, stderr) { 
				expect(stdout).to.include("brace_document_navlink :")
				done()
			}, err_cb)
		})
	})

})

