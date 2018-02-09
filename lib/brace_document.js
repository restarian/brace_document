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
			if ( typeof up === "function" ) {
				err = cb 
				cb = up
			}
			this.up = up = print({level: 1, title: true, title_stamp: false})
		}

		up.log_title = up.log_title + "brace_document"
		this.up_err = up.spawn({level: 2, log_title: up.log_title+" - ERROR"})	

		cb = typeof cb === "function" && cb || function(){}
		// Create the error callback which will transfer the logger from this method into the calling method error callback.
		var err_cb = function() {
			if ( typeof err === "function" )
				err.apply(err.prototype, arguments)
		}

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var parser = document_parse(this.up)

		this.runThrough = (plugin_list) => {

			// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
			// where any additional option misconfiguration checking logic should be added.

			// The docs directory is optional and will be the last process argument if provided from the command line. process.cwd will be the pwd of the shell
			// when invoking of the script.
			parser.findPath(process.cwd(), function() {
				parser.findStructure(structure => {
					parser.acquireData(structure, data => {

						var mod, run_plugin = () => {
							if ( mod = plugin_list.pop() ) {
								up.log("Calling plugin", mod.name)
								// Call all of the plugins asynchronously with a callback.
								mod.plugin(option).runThrough(structure, data, run_plugin, err_cb)
							}
							else
								// After all of the plugins are called. 7 is the success return code for the command line invoking callback.
								cb(7)
						}
						run_plugin()
					}, err_cb)
				}, err_cb)
			}, err_cb)
		}

		parser.getPlugin(path.join(__dirname, ".."), (plugin_list, name) => { 

			parser.appendCommander(program, plugin_list, () => {

				// The plugins are sorted in alphanumerical. TODO: a plugin calling order mechanism can go here.
				plugin_list = plugin_list.sort()

				// This needs to happen after the append so that plugin options can be used without warning that they do not exist.
				option = program.parse(process.argv)

				parser.relative_docs_dir = option.args.pop() || process.cwd()
				parser.sort = option.sort
				parser.verbose = !!option.verbose
				parser.quiet = !!option.quiet
				parser.reverse_sort = !!option.reverseSort
				parser.backup = option.backup

				if ( Object.prototype.toString.call(option.args) !== "[object Array]" )
					option.args = []

				// The verbose option set from the command line will change the print prototype so that any print instances will be affected unless
				// it is explicitly re-set (which is not advisable with the log_level option).
				if ( option.quiet )
					// Do not even print the errors if the quiet flag is set.
					print.prototype.log_level = "0"
				else if ( option.verbose )
					// Empty is all values
					print.prototype.log_level = ""
				else 
					print.prototype.log_level = "0,2"

				if ( option.plugins ) {
					var output = up.spawn({level: 0, title: false}).s()
					plugin_list.forEach(val => {
						output.l(val.name).s("->", val.dir)
					})
					output.log()
				}

				if ( process.argv.length <= 2 ) 
					process.exit(0)
				else
					this.runThrough(plugin_list)	
			})
		})

	return this
	}

})


