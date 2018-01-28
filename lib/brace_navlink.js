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

		if ( up instanceof print ) 
			this.up = up = up.spawn(up.log_title+" -> navlink") 
		else {
			if ( typeof up === "function" )
				cb = up
			this.up = up = print({title_stamp: false}, "navlink")
		}

		if ( option.verbose )
			up.log_level = ""
		else 
			up.log_level = "2"

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, title: up.log_title+" - ERROR:"})	

		Spinner = Spinner.Spinner
		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var parser = document_parse(this.up)

		// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
		// where any additional option mis-configuration checking logic should be added.
		parser.title = option.title
		parser.force_title = !!option.forceTitle
		parser.recursive = !!option.recursive
		parser.sort = option.sort || ""
		parser.reverse_sort = !!option.reverseSort
		// All off the file system calls will be appended with "Sync" so that the calls are synchronous.
		//	parser.synchronous = !!option.synchronous
	
		if ( option.backup ) 
			option.backup = String(option.backup)
		
		var run_parser = function(working_dir, navlink_url, backup_dir, cb, err) {

			// This is the entire asynchronous parser functionality. It is separated so that the base directory of the document pages and the link url
			// can be inputted (so bitbucket can be used).
			parser.aquire_structure(working_dir, function(structure) {
				parser.aquire_document(structure, function(page_data) {
					// Copy the directory structure to the new location or do nothing if parser.backup is falsey.
					parser.create_structure(structure, backup_dir, function() {
						parser.create_document(structure, page_data, navlink_url, backup_dir, function(num_pages) {
							cb(up.log("Injected navigation links into", num_pages, "pages."))
						}, err)

					}, err)
				}, err)
			}, err)
		}

		// This git command will output the project root directory so that this module can export a bin shell option which can run from within any project.
		// It is also needed so that the url will work with http links when using github or another repository server.
		// This is the root url of the nearest git repository.
		new Spinner("git", ["rev-parse", "--show-toplevel"], undefined, function() {

			// The directory is optional and will be the last process argument if provided from the command line. process.cwd will be the pwd of the shell
			// when invoking of the script.
			var dir = (option.args.pop() || process.cwd()), base_dir = this.stdout.replace(/[\n,\t,\r]*/g, "")

			// Remove any trailing slashes so that the link uri does not contain doubles when one is added later. This is done because it is never known
			// whether the url has a trailing slash.
			dir = dir.replace(RegExp("\\"+path.sep+"$"), "")

			// The remote origin url is used for the http reference links. As of know only 
			new Spinner("git", ["config", "--get", "remote.origin.url"], undefined, function() { 
				
				var origin_url = url.parse(this.stdout)

				// The current branch is used so that the other branches commit separate docs.
				new Spinner("git", ["branch", "-q"], undefined, function() {

					var branch = this.stdout.replace(/\s*\*\s*/, "").replace(/[\n\r]*/g, "")
					var relative_working_dir = relative_backup_dir = path.relative(base_dir, dir)

					if ( option.backup ) {
						// The path needs to be relative to the working directory if it is provided as a non-absolute path.
						if ( path.parse(option.backup).root )
							return up_err.log("Absolute paths for a backup directory is not supported ->", option.backup)
						relative_backup_dir = path.relative(base_dir, option.backup)
						if ( path.parse(relative_backup_dir).dir.substr(0,2) == ".." )
							return up_err.s("The specified backup directory:", option.backup).l("which resolves to:")
									.s(path.join(base_dir, "/", relative_backup_dir)).l("resides outside the repository directory of:").s(base_dir).log()
					} 

					// The url is constructed using the git repository information in the directory found above.
					var link_url = option.url || (origin_url.protocol + "//"+ origin_url.hostname + 
							path.posix.join(origin_url.path.replace(/\.git$/, ""), "/blob", "/", branch, "/", relative_backup_dir) )

					if ( option.verbose ) 
						up.s("Using git repository at:", base_dir)
							.l("with document files in:").s(path.sep+relative_working_dir).log()

					run_parser(path.join(base_dir, "/", relative_working_dir), link_url, relative_backup_dir, cb, err)

				}, up.log)
			}, up.log)
		}, up.log)

	}
})


