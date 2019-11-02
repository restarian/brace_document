/*  Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com> -- MIT license

Brace Document resides under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  this file is a part of Brace document

  Brace Document is plugin platform which caters to automatic markdown generation.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "./document_parse"], function(print, document_parse) {

	return function(program, up, cb, err) {
	// The entry point for the document parser API which aligns all of the calls to form the result. The program argument is maditory and can be either
	// an object literal or a commander instance. The up argument (bracket print instance), is optional as one will be created if it is omitted.

		// The simplest way to determine if the argument is of the bracket_print type.
		if ( up && up.parent && (up instanceof up.parent) )
			this.up = up = up.spawn(up.log_title+" -> ")
		else {
			if ( typeof up === "function" ) {
				err = cb
				cb = up
			}
			this.up = up = print({level: 1, title: true, title_stamp: false})
		}

		up.log_title = up.log_title + "brace_document"
		this.up_err = up_err = up.spawn({level: 2, log_title: up.log_title+" - ERROR"})

		cb = typeof cb === "function" && cb || function(){}
		// Create the error callback which will transfer the logger from this method into the calling method error callback.
		var err_cb = function() {
			if ( typeof err === "function" )
				err.apply(err.prototype, arguments)
		}

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		program = program || {}

		var help, exit, option
		if ( typeof program.parse === "function" ) {
			// Temporally disable the process exit and commander outputHelp members so that the program args can be pre-processed without exiting early
			// from this script. This is used to get the verbose, quiet, pluginRegex and pluginPath options before the main program run through.

			exit = process.exit
			process.exit = function() {}

			help = program.outputHelp
			program.outputHelp = function() {}

			program._allowUnknownOption = true
			option = program.parse(process.argv)
			program._allowUnknownOption = false

			program.outputHelp = help.bind(program)
			process.exit = exit.bind(process)
		}
		else
			option = program

		option.quiet = option.quiet || false
		option.verbose = option.verbose || false
		option.color = option.color || false

		// The verbose option set from the command line will change the print prototype so that any print instances will be affected unless
		// it is explicitly re-set (which is not advisable with the log_level option).
		if ( option.quiet )
			// Do not even print the errors if the quiet flag is set.
			print.prototype.log_level = "0"
		else if ( option.verbose )
			// Empty is all values
			print.prototype.log_level = "0,1,2"
		else
			print.prototype.log_level = "0,2"

		print.prototype.style = option.color

		var parser = document_parse(up)

		if ( typeof program.parse === "function")
			parser.option = option
		else if ( typeof program === "object" )
			for ( var opt in program )
				parser.option[opt] = program[opt]

		parser.getPlugin((plugin_list) => {
			// appendCommander will do nothing and call the callback if program is not a instance of commander.
			parser.appendCommander(program, plugin_list, () => {

				// This needs to happen after the append so that plugin options can be used without warning that they do not exist.
				if ( typeof program.parse === "function" )
					parser.option = program.parse(process.argv)

				for ( var tense in plugin_list )
					parser.option.pluginEnable += plugin_list[tense].reduce((acc, val, ind) => {
						var camel_case = val.option_name.charAt(0).toLowerCase() +
							val.option_name.replace(/\-\S/g, function(match) { return match.charAt(1).toUpperCase() }).substr(1)

						if ( camel_case in parser.option )
							acc += ", "+val.name
						return acc

					}, "") + ","

				if ( parser.option.plugins ) {
					var output = up.spawn({level: 0, title: false, style: false}).l()
					for ( var tense in plugin_list )
						plugin_list[tense].forEach(val => {
							output.l(val.name).s(":", val.dir, val.package_info.version)
						})
					output.log()
					cb.call(this, 0)
					return
				}

				parser.setPath(() => {
					parser.findStructure((structure) => {
						parser.runPlugin(plugin_list.first, structure, {}, () => {

							parser.acquireData(structure, (data) => {
								parser.runPlugin(plugin_list.collect, structure, data, () => {

									parser.createStructure(structure, () => {
										parser.runPlugin(plugin_list.directory, structure, data, () => {

											parser.writeData(structure, data, () => {
												parser.runPlugin(plugin_list.last, structure, data, () => {

													up.spawn({title: false, level: 2}).log("FINISHED")
													cb.call(this, 0)
												}, err_cb)
											}, err_cb)
										}, err_cb)
									}, err_cb)
								}, err_cb)
							}, err_cb)
						}, err_cb)
					}, err_cb)
				}, err_cb)

			}, err_cb)
		}, err_cb)

	return this
	}

})
