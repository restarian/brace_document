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

	return function(option, up, cb, err) {
	
		Spinner = Spinner.Spinner
		up = this.up = up instanceof print && up.spawn(up.log_title+" -> brace navlink") || print({title_stamp: false}, "brace navlink")

		//up.level = 2	

		if ( option.verbose )
			up.log_level = ""
		else 
			up.log_level = "1"

		this.up_err = up.spawn({title: true, level: 1, title_stamp: false, title: up.log_title+" - ERROR:"})

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var parser = document_parse(up)

		// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
		// where any additional option mis-configuration checking logic should be added.
		parser.title = option.title
		parser.force_title = !!option.forceTitle
		parser.backup = !!option.backup
		parser.recursive = !!option.recursive
		parser.sort = !!option.sort
	
		if ( option.backup ) {
			parser.backup = String(option.backup)
		}
		
		var run_parser = function(working_dir, backup_dir, link_uri, cb, err) {

			// This is the entire asynchronous parser functionality. It is separated so that the base directory of the document pages and the link uri
			// can be inputted (so bitbucket can be used).
			parser.aquire_structure(working_dir, function(structure) {
				parser.aquire_data(structure, link_uri, function(page_data) {
					parser.create_structure(structure, backup_dir, function() {
					})
	//				parser.create_document(structure, page_data, function(num_pages) {
				//		up.log("Injected navigation links into", num_pages, "pages.")
						//cb()
					//}, err)
				})
			})
		}

		// This git command will output the project root directory so that this module can export a bin shell option which can run from within any project.
		// It is also needed so that the url will work with http links when using github or another repository server.
		// This is the root url of the nearest git repository.
		new Spinner("git", ["rev-parse", "--show-toplevel"], undefined, function() {

			// The directory is optional and will be the last process argument if provided from the command line. process.cwd will be the pwd of the shell
			// when invoking of the script.
			var dir = (option.args.pop() || process.cwd()), base_dir = this.stdout.replace(/[\n,\t,\r]*/g, "")

			// Remove any trailing slashes so that the link uri does not contain doubles when one is added later. This is done because it is never known
			// whether the uri has a trailing slash.
			dir = dir.replace(RegExp("\\"+path.sep+"$"), "")

			// The remote origin url is used for the http reference links. As of know only 
			new Spinner("git", ["config", "--get", "remote.origin.url"], undefined, function() { 
				
				var origin_url = url.parse(this.stdout)

				// The current branch is used so that the other branches commit separate docs.
				new Spinner("git", ["branch", "-q"], undefined, function() {

					var branch = this.stdout.replace(/\s*\*\s*/, "").replace(/[\n\r]*/g, "")
					var relative_dir = path.relative(base_dir, dir)
					var working_dir = path.join(base_dir, "/", relative_dir)
					var backup_dir = parser.backup 

					if ( !path.parse(parser.backup).root ) {
						// Turn the backup directory into a relative path to the repository base directory if it is passed in as a relative path (no
						// separator will be set as root of path.parse). 
						var relative_backup_dir = path.relative(base_dir, parser.backup)
						backup_dir = path.join(base_dir, "/", relative_backup_dir)
					}

					// The uri is constructed using the git repository information in the directory found above.
					var link_uri = option.url || (origin_url.protocol + "//"+ origin_url.hostname + 
							path.posix.join(origin_url.path.replace(/\.git$/, ""), "/blob", "/", branch, "/", dir) )

					if ( option.verbose ) 
						up.s("Using git repository at:").l("").t(base_dir)
							.l("and document files in:").s(path.sep+relative_dir).log()

					run_parser(working_dir, backup_dir, link_uri, cb, err)

				}, up.log)
			}, up.log)
		}, up.log)

	}

})


