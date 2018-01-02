if (typeof define !== 'function') { var define = require('amdefine')(module) }

var fs = require("fs"),
	path = require("path")

define(["bracket_print"], function(print) {
	
	var def = function(up) {

		var call_instance
		if ( !(this instanceof (call_instance = def) ) )
			return new (Array.prototype.slice.call(arguments).reduce(function(accumulator, value) {
				return accumulator = accumulator.bind(accumulator.prototype, value)
			}, call_instance))()
	
		up = this.up = up instanceof print && up.spawn(up.log_title+" -> document_parse") || print({title_stamp: false}, "document parse")
		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, log_title: up.log_title+" - ERROR:"})

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		// The option data to use (which is also supplied by the cli program).
		this.backup = [] 
		this.recursive = [] 
		this.link_uri = ""

	}
	
	def.prototype = { 

		create_page: function(structure, data, page, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}
			var parse_err = this.up_err.s(), up = this.up

			var page = data[page]

			//if ( !title ) parse_err.l("A sub-heading (##[#,..]), could not be found in document", "").t(value).a(". It will be skipped.")
			var navlink = this.create_navlink.apply(this, arguments)
			up.log(navlink)

/*
			if ( 
				nav_header = data.contents.match(header_regex),
				found_link = !!nav_header

			if ( found_link ) {
				while ( found_link ) {

					found_link = false
					// The loop is continued if another link is found under the navigation sub-heading. The loop will stop when all of the links that are
					// directly under the navigation sub-heading are removed from the contents string.
					contents = contents.replace(header_link_regex, function(all, first, second) { 
						// Set the loop to go again and return the first match to be matched again. 
						return found_link = true && first 
					})
				}
				contents = contents.replace(header_regex, nav_header+nav_list.join("\n")+"\n\n")
			}
			else 
				// The navigation sub-heading is added to the page if the page sub-heading is needed to inject the links text. This will not happen
				// the next time this script is run unless the navigation data is removed somehow otherwise.
				contents = contents.replace(title_regex, nav_header+"\n\n----\n### Document pages\n"+nav_list.join("\n")+"\n\n----\n")

			// This overwrites the existing markdown file with data which has updated navigation links.
			fs.writeFileSync(value.path, contents)
		})
				*/
		},
		create_all: function(structure, data, cb, err) {

				
			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}
			
			var parse_err = this.up_err.s(), up = this.up


			///this.create_page.apply(this, arguments)
			this.create_page(structure, data, Object.keys(data).pop())
/*
					// This makes an Object with information regarding the markdown files found in the directory.
						// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.
			var nav_header = data.contents.match(header_regex),
				found_link = !!nav_header
			
			// This is an informative value used in with the command stdout.
			value.inject_point = found_link && "navigation heading" || "first sub-heading"
						// If the nav_header is not found than the file sub-heading will be used to inject the navigation links. The links are put directly under 
						// the file sub-heading. The links are put under the navigation sub-header is that is found otherwise.
						if ( found_link ) {
							while ( found_link ) {

								found_link = false
								// The loop is continued if another link is found under the navigation sub-heading. The loop will stop when all of the links that are
								// directly under the navigation sub-heading are removed from the contents string.
								contents = contents.replace(header_link_regex, function(all, first, second) { 
									// Set the loop to go again and return the first match to be matched again. 
									return found_link = true && first 
								})
							}
							contents = contents.replace(header_regex, nav_header+nav_list.join("\n")+"\n\n")
						}
						else 
							// The navigation sub-heading is added to the page if the page sub-heading is needed to inject the links text. This will not happen
							// the next time this script is run unless the navigation data is removed somehow otherwise.
							contents = contents.replace(title_regex, nav_header+"\n\n----\n### Document pages\n"+nav_list.join("\n")+"\n\n----\n")

						// This overwrites the existing markdown file with data which has updated navigation links.
						fs.writeFileSync(value.path, contents)
					})
*/
		},
		create_navlink: function(structure, data, page, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			data = data || []
			structure = structure || []
			var parse_err = this.up_err.s()

			// A sub-heading with the text Document pages will be found by this regex
			var header_regex_text = "[\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+[\ ,\t]*([^\n,\r]+)[\n,\r]+"

			// This finds the pattern above and also finds a markdown style link immediately after it. The navigation links sub-heading title and the 
			// links are in separate regex matching groups.
			var header_link_regex_text = "(" +header_regex_text + ")(\s*\*\s\[.*\]\(.*\)[\n,\r]+)"
			var navlist = [], level = ""

			var make_navlink = function(structure, level) {

				structure.forEach(function(value) {

					if ( Object.prototype.toString.call(value) === "[object Object]" ) {
						var dir_name = Object.keys(value).pop()
						navlist.push(level + "* " + dir_name)
						navlist.push(make_navlink(value[dir_name], level + "  "))
						return
					}

					if ( page === value )
						return

					// Create an array with all of the links to all of the other pages except for the current page (value), sense there is no need to have
					// a link to the current page in the navlink.
					navlist.push(level+"* ["+data[value].page_title+"]("+data[value].url+")")
					// This removes the empty value from the array so that a rouge new line wont be created when the join("\n") is used.
					

				})
			}
			make_navlink(structure, level)

			cb(navlist)
			return navlist
			
		},
		aquire_list: function(dir, list, cb, err) {
		// This member is tasked with finding the various files in (and maybe below), the specified dir and forming a list which contains only the files
		// which have a .md extension.


			if ( Object.prototype.toString.call(list) !== "[object Array]" ) {
				err = cb
				cb = list	
				list = [] 
			}

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			var parse_err = this.up_err.s()
			// Read the directory which contains the markdown files and create an array which names only the files with a .md extension. Also, do not include
			// hidden files (starts with a dot). 

			var cnt, dir_cnt = 0, aquire_list = this.aquire_list.bind(this)

			fs.readdir(dir, function(error, data) { 

				if ( error )
					return err(parse_err.log(error))

				cnt = data.length

				data.forEach(function(value) { 
				
					var full_path = path.join(dir, "/", value)

					fs.stat(full_path, function(error, stat) {

						if ( error )
							return err(parse_err.log(error))

						if ( stat.isDirectory() ) { 
							var a = {}
							a[value] = []
							list.push(a)
							aquire_list(full_path, a[value], function() {
								dir_cnt++
								if ( !(cnt-dir_cnt) )
									cb(list)
							}, err)
						}
						else if ( stat.isFile() && /^[^\.].*\.md$/.test(value) ) {
							list.push(full_path)
							if ( !((--cnt)-dir_cnt) )
								cb(list)
						}

					})
				})
					//.map(function(value) { return path.join(dir, "/", value) })
			})

		},
		aquire_data: function(list, cb, err) {
		// Create an object (and set it the instance), which contains all of the data necessary to locate and find the markdown pages. Each array object
		// has its correlating link to the github url and thusly the complete list of document pages can only be assembled after all of the list entries  
		// are gathered here.
		
			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			
			// The parse_err print instance will store any text added to it and then log that if it contains text after the looping is finished. This is 
			// accomplished by getting the space (s), command below.
			var parse_err = this.up_err.s(), up = this.up
			
			var data = {}, cnt = list.length, link_uri = this.link_uri

			var parse_file = function(file_path) {

				file_path.forEach(function(value) {

					if ( typeof value === "object" ) {
						dir_name = Object.keys(value).pop()
						// Subtract one to account for the directory which is process here while added all of the directory structure entries to the total.
						cnt += value[dir_name].length - 1
						// TODO: a call stack is accrued here so directory size is limited to ~1000
						return parse_file(value[dir_name])
					}
					// Loop through all of the document pages which will have their contents mutated and create an array of data objects which contain
					// the parsed markdown data.
					fs.readFile(value, undefined, function(error, content) { 

						// Turn the buffer into a string.
						content = content && content.toString() || ""
						var file_name = path.basename(value)

						// This regex allocates the first markdown sub-heading in the file (the first element to have more than one #).
						var title_regex = /[\n,\r,\s]*(\#+[\ ,\t]*)(.+)[\n,\r]/
						var page_title_regex = /[\n,\r,\s]*(\#\#+[\ ,\t]*)(.+)[\n,\r]/

						//var navlist_title_regex = /[\n,\r]{2,}\-\-[\-]+[\n,\r]+\#+[\ ,\t]*([^\n,\r]+)[\n,\r]+/

			var header_regex_text = "[\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+[\ ,\t]*([^\n,\r]+)[\n,\r]+"

			var header_link_regex_text = "(" +header_regex_text + ")(\s*\*\s\[.*\]\(.*\)[\n,\r]+)"

						var page_title = content.match(page_title_regex)
						var title = content.match(RegExp(title_regex))
						var navlist_title = content.match(RegExp(navlist_title_regex))

						if ( error )
							parse_err.l(error)
						else
							// Store all of the data needed to mutate it in one object for all of the pages. The path.posix is used because the forward slash for 
							// directories is the same as uri separators.
							data[value] = { file_name: file_name, dir: path.dirname(value), url: link_uri+path.posix.join("/", file_name), content: content }

						// After all pages in the list are collects the callback is called unless the error print instance contains text data.

						if ( !--cnt ) {
							// This will have zero length if no errors were encountered.
							if ( parse_err.toString().length )
								return err(parse_err.log())
							else
								return cb(data)
						}

						// The value needs to be bound so that the async readFile function call gets the correct argument.
					})
				})
			}

			parse_file(list)
		}
	
	}

	return def
})


