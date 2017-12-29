/*
MIT License
Copyright (c) 2017 Robert Edward Steckroth

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

  Brace UMD is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace UMD

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com>
*/

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	test_help = require("test_help"),
	maybe = require("brace_maybe")

var Spinner = test_help.Spinner,
	remove_cache = test_help.remove_cache.bind(null, "brace_umd.js", "package.json")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = true 
Spinner.prototype.log_stderr = true 
Spinner.prototype.log_err = true 

module.paths.unshift(path.join(__dirname, "/..", "/../"))

var build_path = path.join(__dirname, "/..", "/bin", "/build_umd.js"),
	config_dir = path.join(__dirname, "/config")
//	rjs_path

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	this.stop = false
	var it_might = maybe(this)	

	describe("Checking for dependencies..", function() { 
/*
		it_might("r_js in the system as a program", function(done) {
			this.stop = true 
			expect(fs.existsSync(rjs_path = require.resolve("requirejs")), "could not find r.js dependency").to.be.true
			this.stop = false 
			done()
		})
*/
		it_might("the build_umd program is available and at the right location", function(done) {
			this.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			expect(build_path, "the expected path of the build_umd program is not the one located by the unit test")
						.to.equal(require("brace_umd").build_program_path)
			this.stop = false 
			done()
		})
	})

	describe("Brace UMD module export data", function() {

		// An array with the values of the test directory is filtered to include all of the files included with the regex.
		var config_file = fs.readdirSync(config_dir).filter(function(value) { return /^build_config_.*\.json/.test(value) })
		config_file.forEach(function(value) {

			value = path.join(__dirname, "/config/", value)

			it_might("built using config file "+ value, function(done) {

				// A new umd.js source build is created with the various config files in the test directory.
				new Spinner("", [build_path, "--config-file", value], undefined, function(exit_code) {
					expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
					done()
				}, function(err) { 
					expect(false).to.equal(true)
					done()
				})

			})

			it_might("the export member wrap_end_option returns the correct string with the option data added to it", function(done) {

				var data = require("../")
				expect(data.wrap_end_option()).to.equal(data.wrap_end)
				expect(data.wrap_end_option({})).to.equal(data.wrap_end)
				expect(data.wrap_end_option({cool: "joes"})).to.be.not.equal(data.wrap_end)
				expect(data.wrap_end_option({cool: "joes"})).to.include('{"cool":"joes"}')
				expect(data.wrap_end_option({abool: true})).to.include('{"abool":true}')
				expect(data.wrap_end_option({abool: false})).to.include('{"abool":false}')
				expect(data.wrap_end_option({cool: "joes", num: 0,num:44})).to.include('{"cool":"joes","num":44}')
				remove_cache()
				done()
			})

			it_might("the export member version is the same as the current one", function(done) {

				var data = require("../")
				var info = require("../package.json")
				expect(data.build_information).to.be.an("object")
				expect(data.build_information.version).to.equal(info.version)
				remove_cache()
				done()
			})
		})
	})

})

