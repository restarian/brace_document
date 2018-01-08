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


var path = require("path"),
	fs = require("fs"),
	url = require("url")

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "./document_parse", "../test/node_modules/test_help"], function(print, document_parse, Spinner) {

	return function(program, up, cb, err) {
	
		Spinner = Spinner.Spinner
		up = this.up = up instanceof print && up.spawn(up.log_title+" -> brace navlink") || print({title_stamp: false}, "brace navlink")

		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, title: up.log_title+" - ERROR:"})

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		var parser = document_parse(up)

		// This git command will output the project root directory so that this module can export a bin shell program which can run from within any project.
		// It is also needed so that the url will work with http links when using github or another repository server.
		// This is the root url of the nearest git repository.
		new Spinner("git", ["rev-parse", "--show-toplevel"], undefined, function() {

			// The directory is optional and will be the last process argument if provided from the command line. process.cwd will be where to first shell
			// of the script was started (which is the bin directory when call from the command line).
			var dir = (program.rawArgs.pop() || process.cwd()), base_dir = this.stdout.replace(/[\n,\t,\r]*/g, "")

			// Remove any trailing slashes do that the link uri does not contain doubles.
			dir = dir.replace(RegExp("\\"+path.sep+"$"), "")

			// The remote origin url is used for the http reference links.
			new Spinner("git", ["config", "--get", "remote.origin.url"], undefined, function() { 
				
				var origin_url = url.parse(this.stdout)
				// The current branch is used so that the other branches commit separate docs.
				new Spinner("git", ["branch", "-q"], undefined, function() {

					var branch = this.stdout.replace(/\s*\*\s*/, "").replace(/[\n\r]*/g, "")

					var meta = {}
					var relative_dir = path.relative(base_dir, dir)

					if ( program.verbose ) 
						up.s("Using git repository at:").l("").t(base_dir)
							.l("and document files in:").s(path.sep+relative_dir).log()

					var link_uri = program.url || (origin_url.protocol + "//"+ origin_url.hostname + 
							path.posix.join(origin_url.path.replace(/\.git$/, ""), "/blob", "/", branch, "/", dir) )

					// An Array with all the values(files), in the base directory is filtered to include all of the files included with the regex (non-hidden 
					// markdown files).

					parser.backup = !!program.backup
					parser.recursive = !!program.recursive

					parser.aquire_list(path.join(base_dir, "/", relative_dir), function(structure) {

						parser.aquire_data(structure, link_uri, function(page_data) {
						
							var nav_list = parser.create_navlink(structure, page_data, "Dd")
							parser.create_all(page_data, nav_list, function(meta) {

								if ( program.verbose )
										up.log("Injected", meta.num_links, "navigation links into", meta.num_pages, "pages.")
								if ( program.printMeta )
									up.l("", "", meta)
								
							}, err)

						})
					})

				// Log and end if the git commands failed.
				}, up.log)
			}, up.log)
		}, up.log)

	}


})


