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

var path = require("path"),
	fs = require("fs")

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "./document_parse"], function(print, document_parse, utils) {

	return function(program, up, cb, err) {

		if ( up instanceof print ) 
			this.up = up = up.spawn(up.log_title+" -> ") 
		else {
			if ( typeof up === "function" )
				cb = up
			this.up = up = print({title: true, title_stamp: false})
		}

		up.log_title = up.log_title + "brace_document"

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}


		this.up_err = up.spawn({level: 2, log_title: up.log_title+" - ERROR"})	

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var parser = document_parse(this.up)
	
		//parser.get_plugins(__dirname, function(plugin) { })
		var option = program.parse(process.argv)

		if ( Object.prototype.toString.call(option.args) !== "[object Array]" )
			option.args = []

		if ( option.quiet )
			print.prototype.log_level = "0"
		else if ( option.verbose )
			up.log_level = ""
		else 
			up.log_level = "0,2"
		//get_plugins(path.join

		// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
		// where any additional option misconfiguration checking logic should be added.
k
		// The docs directory is optional and will be the last process argument if provided from the command line. process.cwd will be the pwd of the shell
		// when invoking of the script.
		parser.relative_docs_dir = option.args.pop() || process.cwd()
		parser.url = option.url
		parser.sort = option.sort
		parser.verbose = option.verbose
		parser.quiet = option.quiet
		parser.reverse_sort = !!option.reverseSort
		// All off the file system calls will be appended with "Sync" so that the calls are synchronous.
		//	parser.synchronous = !!option.synchronous
		parser.backup = option.backup && String(option.backup) || ""

		parser.find_git_root(process.cwd(), function(root) {

			parser.find_relative_data(root, function(root) {
			// This is the entire asynchronous parser functionality. It is separated so that the base directory of the document pages and the link url
			// can be inputted (so bitbucket can be used).
			parser.aquire_structure(path.join(parser.project_root, "/", parser.relative_docs_dir), (structure) => {
				parser.aquire_document(structure, function(page_data) {
					// Copy the directory structure to the new location or do nothing if parser.backup is falsey.
					/*
					parser.create_structure(structure, backup_dir, function() {
						parser.create_document(structure, page_data, document_url, backup_dir, function(num_pages) {
							cb(up.log("Injected navigation links into", num_pages, "pages."))
						}, err)

					}, err)
					*/
					}, err)
				}, err)
			}, err)

		}, this.up_err.log)

	}
})


