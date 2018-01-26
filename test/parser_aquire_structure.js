/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

	Brace Navlink resides under the MIT licensed.

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

  Brace Navlink is module to automatically add markdown page navigation links.

  this file is a part of Brace Navlink 

 Author: Robert Edward Steckroth II, BustOut, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	test_help = require("test_help"),
	maybe = require("brace_maybe")

var remove_cache = test_help.remove_cache.bind(null, "r.js", "document_parse.js")

module.paths.unshift(path.join(__dirname, "/..", "/../"))

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	this.stop = false
	var it_might = maybe(this)	

	describe("Checking for dependencies..", function() { 

		it_might("r_js in the system as a program", function(done) {
			this.stop = true 
			expect(fs.existsSync(rjs_path = require.resolve("requirejs")), "could not find r.js dependency").to.be.true
			this.stop = false 
			done()
		})
	})

	describe("Checking parser.aquire_data in asynchronous mode to", function() {

		var requirejs, example_dir = path.join(__dirname, "/../example")
		beforeEach(function() {
			remove_cache()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "/../lib"), nodeRequire: require})

		})

		it_might("Create the proper structure from example/no_direcories", function(done) {

			requirejs(["require", "document_parse"], function(req, document_parse) { 

				var parser = document_parse()

				// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
				// where any additional option mis-configuration checking logic should be added.
				/*
				parser.title = option.title
				parser.force_title = !!option.forceTitle
				parser.recursive = !!option.recursive
				// All off the file system calls will be appended with "Sync" so that the calls are synchronous.
				parser.synchronous = !!option.synchronous

				//option.backup = String(option.backup)
*/				
				parser.aquire_structure(path.join(example_dir, "/", "no_directories"), function(structure) {

					expect(structure).to.be.a("array")
					// These should be in alphanumerical order.
					expect(structure).to.deep.equal([
						path.join(example_dir, "/", "no_directories", "/", "0wood.md"), 
						path.join(example_dir, "/", "no_directories", "/", "framers.md"), 
						path.join(example_dir, "/", "no_directories", "/", "tools.md"),
						path.join(example_dir, "/", "no_directories", "/", "wages.md") 
					])
					done()

				}, function(error) {
					expect(true, error).to.be.false
					done()
				})
			})
		})

	})

})

