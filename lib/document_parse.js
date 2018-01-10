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
		this.up_err = up.spawn({title: true, level: 1, title_stamp: false, log_title: up.log_title+" - ERROR:"})

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		// The option data to use (which is also supplied by the cli program).
		this.recursive = this.sort = this.force_title = false
		this.backup = ""
		this.title = "Document pages"

		// A sub-heading with the text Document pages will be found by this regex
		var header_regex_text = String.raw`([\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+[\ ,\t]*)([^\n,\r]+)[\n,\r]+`
		this.header_link_regex = RegExp(header_regex_text + String.raw`(\s*\*\s+.*[\n,\r]+)`)
		this.header_regex = RegExp(header_regex_text)

		this.title_regex = /[\n,\r,\s]*(\#\#+[\ ,\t]*)(.+)[\n,\r]/

	}
	
	def.prototype = { 
		
		create_structure: function(structure, location, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			// This makes an Object with information regarding the markdown files found in the directory.
			// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.

			// None of the directory structure creation is needed if a backup documentation directory is not supplied.
			if ( !this.backup ) 
				return cb()
			
			var directory = []
			
			var find_directory = function(structure, dir) { 
				// Recursively iterate the structure and assemble an array of all the directories which will need to be verified and/or created.

				structure.forEach(function(value, index, proto) { 

					if ( typeof value === "object" ) {
						var key = Object.keys(value).shift()
						var d = path.join(dir, "/", key)
						directory.push(d)
						find_directory(value[key], d)
					}
				})
			}

			find_directory(structure, "./")

			console.log(directory)
	
			// Make sure this is first so that is is created first if need be. All the others are created starting with the lowest level sense structure
			// is an accurate representation of the directory structure which was parsed.
			directory.unshift(this.backup)
			// Create the backup directory (which is the base directory for the documents), if it does not exist.

			directory.forEach((value) => {

				fs.stat(value, (error, stats) => {

					if ( error ) {
						// An error in fs.stat probably means that the directory does not exist so it is attempted to be made.
						this.up.log("Creating directory", value)
						/*
						fs.mkdir(value, (error) => {
							// An error here is not good as the directory of the backup specified can not be accessed.
							if ( error )
								return err(this.up_err.log(error).toString())
						})
						*/
					}
					else if ( !stats.isDirectory() )
						return this.up_err.log("Unable to use or create directory:", value).a(". It is already named as something else.")

				})

			})

		},
		create_document: function(structure, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			// This makes an Object with information regarding the markdown files found in the directory.
			// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.

			var data, up = this.up, cnt = 0

			Object.keys(page_data).forEach((location, index, proto) => {

				data = page_data[location]
				content = data.content
				
				var nav_list = this.create_navlink(structure, page_data, location)
				var nav_header = content.match(this.header_regex)
				var found_link = !!nav_header

				// If the nav_header is not found than the file sub-heading will be used to inject the navigation links. The links are put directly under 
				// the file sub-heading. The links are put under the navigation sub-header is that is found otherwise.
				if ( !found_link ) 
					// The navigation sub-heading is added to the page if the page sub-heading is needed to inject the links text. This will not happen
					// the next time this script is run unless the navigation data is removed somehow otherwise.
					content = content.replace(this.title_regex, nav_header.shift()+"\n\n----\n### " + this.title + "\n"+nav_list.join("\n")+"\n\n----\n")
				else
					while ( found_link ) {

						found_link = false
						// The loop is continued if another link is found under the navigation sub-heading. The loop will stop when all of the links that are
						// directly under the navigation sub-heading are removed from the contents string.
						content = content.replace(this.header_link_regex, function(all, navlink_header, navlink_title, navlink_page ) { 
							// Set the loop to go again and return the first match to be matched again. 
							return found_link = true && (navlink_header + navlink_title) 

						})
					}

				var nav_title = this.force_title && this.title || nav_header[2] 
				var nav_markup = nav_header[1]
					
				content = content.replace(this.header_regex, nav_markup + nav_title + "\n" + nav_list.join("\n") + "\n\n")

				var dir = path.dirname(location)
				var document = path.basename(location)

					if ( ++cnt === proto.length )
						cb(proto.length)
			/*	
				fs.writefile(path.join(dir, "/", document), content, (err) => { 

					if ( err ) {
						this.up_err.log(err) 
						return 
					}

					if ( ++cnt === proto.length )
						cb(proto.length)
				})
*/
				//	console.log(content)	
				// This overwrites the existing markdown file with data which has updated navigation links.

			})

		},
		create_navlink: function(structure, data, page, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			var parse_err = this.up_err.s()

			// This finds the pattern above and also finds a markdown style link immediately after it. The navigation links sub-heading title and the 
			// links are in separate regex matching groups.
			var navlist = [], level = ""

			var make_navlink = function(structure, level) {

				structure.forEach(function(value) {

					if ( Object.prototype.toString.call(value) === "[object Object]" ) {
						var dir_name = Object.keys(value).pop()
						navlist.push(level + "* " + dir_name)
						make_navlink(value[dir_name], level + "  ")
						return
					}

					if ( page === value )
						navlist.push(level+"* **"+data[value].title+"**") 
					else 
						// Create an array with all of the links to all of the other pages except for the current page (value), sense there is no need to have
						// a link to the current page in the navlink.
						navlist.push(level+"* ["+data[value].title+"]("+data[value].url+")")
					

				})
			}

			make_navlink(structure, level)

			cb(navlist)
			return navlist
		},
		aquire_structure: function(dir, structure, cb, err) {
		// This member is tasked with finding the various files in (and maybe below), the specified dir and forming a structure which contains only the files
		// which have a .md extension.

			if ( Object.prototype.toString.call(structure) !== "[object Array]" ) {
				err = cb
				cb = structure	
				structure = [] 
			}

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			var callback = (function(l) {  
				// The cb callback is wrapped so that the message can be logged before the original callback is called.

				if ( ! l || !l.length )
					this.up.log("No document pages were found within directory:", dir)
				else 
					this.up.log("Found", structure.length, "documents in:", dir)

				// Oddly enough, the original cb passed in is only called once even though this method is called many time below.
				cb.apply(cb.prototype, arguments)

			}).bind(this)

			// Read the directory which contains the markdown files and create an array which names only the files with a .md extension. Also, do not 
			// include hidden files (starts with a dot). 

			var cnt, dir_cnt = 0

			fs.readdir(dir, (error, data) => { 

				if ( error )
					return this.up_err.log_true(error) && err(error)

				cnt = data.length

				data.forEach(value => { 
				
					var full_path = path.join(dir, "/", value)

					fs.stat(full_path, (error, stat) => {

						if ( error )
							return err(this.up_err.log(error))

						if ( stat.isDirectory() ) { 

							if ( !this.recursive ) 
							   return cnt--	

							var a = {}
							a[value] = []
							structure.push(a)
							this.aquire_structure(full_path, a[value], function() {
								if ( !(cnt-++dir_cnt) ) 
									callback(structure)
								
							}, err)
						}

						// An Array with all the values(files), in the base directory is filtered to include all of the files included with the 
						// regex (non-hidden markdown files).
						else if ( stat.isFile() && /^[^\.].*\.md$/.test(value) ) {
							this.sort ? structure.unshift(full_path) : structure.push(full_path)

							if ( !((--cnt)-dir_cnt) ) 
								callback(structure)
						}

					})
				})
			})

		},
		aquire_data: function(structure, link_uri, cb, err) {
			// Create an object (and set it the instance), which contains all of the data necessary to locate and find the markdown pages. Each array
			// object has its correlating link to the github url and thusly the complete structure of document pages can only be assembled after all of 
			// the structure entries are gathered here.
		
			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			// This regex allocates the first markdown sub-heading in the file (the first element to have more than one #).
			var up = this.up, data = {}
			
			// The parse_err print instance will store any text added to it and then log that if it contains text after the looping is finished. This 
			// is accomplished by getting the space (s), command below.
			var parse_err = this.up_err.s()
			var cnt = structure.length

			var parse_file = (function(file_path) {

				file_path.forEach(value => {

					if ( typeof value === "object" ) {
						dir_name = Object.keys(value).pop()
						// Subtract one to account for the directory which is process here while added all of the directory structure entries to the total.
						cnt += value[dir_name].length - 1
						// TODO: a call stack is accrued here so directory size is limited to ~1000
						return parse_file(value[dir_name])
					}
					// Loop through all of the document pages which will have their contents mutated and create an array of data objects which contain
					// the parsed markdown data.
					fs.readFile(value, undefined, (error, content) => {

						// Turn the buffer into a string.
						content = content && content.toString() || ""
						var file_name = path.basename(value)
						var title = content.match(this.title_regex)
						var nav_header = content.match(this.header_regex_text)

						if ( error )
							parse_err.l(error)
						else if ( !title )
							parse_err.l("A sub-heading (##[#,..]), could not be found in document", "").t(value).a(". It will be skipped.")
						else
							// Store all of the data needed to mutate it in one object for all of the pages. The path.posix is used because the forward slash for 
							// directories is the same as uri separators.
							data[value] = { file_name: file_name, heading: title[0], title: title[2], dir: path.dirname(value), 
								url: link_uri+path.posix.join("/", file_name), content: content }

						// After all pages in the structure are collects the callback is called unless the error print instance contains text data.

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
			}).bind(this)

			parse_file(structure)
		}
	
	}

	return def
})


