if (typeof define !== 'function') { var define = require('amdefine')(module) }

var fs = require("fs"),
	path = require("path")

define(["bracket_print"], function(print) {
	
	var def = function(up) {

		// This iterator returns an instanced link of the module regardless if the new keyword is used.
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
		this.title = "Document pages"

		// A sub-heading with the text Document pages will be found by this regex. The template literal is used so that the backslashes do not need to be
		// double escaped.
		var header_regex_text = String.raw`([\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+[\ ,\t]*)([^\n,\r]+)[\n,\r]+`
		this.header_link_regex = RegExp(header_regex_text + String.raw`(\s*\*\s+.*[\n,\r]+)`)
		this.header_regex = RegExp(header_regex_text)

		this.title_regex = /[\n,\r,\s]*(\#\#+[\ ,\t]*)(.+)[\n,\r]/

	}
	
	def.prototype = { 
		
		create_structure: function(structure, backup_dir, cb, err) {
			// This member creates all of the directories in the original document location to the backup directory. It is only necessary when a backup
			// directory is requested. Otherwise, the originally parsed files will be overwritten with the new content. 

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			// None of the directory structure creation is needed if a backup documentation directory is not supplied.
			if ( !backup_dir ) 
				return cb()
		
			this.up.log("Creating backup directory structure at:", backup_dir)	
			var directory = []
			
			var find_directory = function(structure, dir) { 
				// Recursively iterate the structure and assemble an array of all the directories which will need to be verified and/or created.

				structure.forEach(function(value, index, proto) { 

					if ( typeof value === "object" ) {
						var key = Object.keys(value).shift()
						var d = path.join(dir, "/", key)
						directory.push(path.join(backup_dir, "/", d))
						find_directory(value[key], d)
					}
				})
			}

			find_directory(structure, "./")

			// Make sure this is first so that is is created first if need be. All the others are created starting with the lowest level sense structure
			// is an accurate representation of the directory structure which was parsed.
			// Create the backup directory (which is the base directory for the documents), if it does not exist.

			directory = backup_dir
					// Removes the root identifier from the directory. E.g. C:\ or /
					.replace(RegExp(path.parse(backup_dir).root), "")
					// Split the path based on the separator used within the current operating system (path.sep does this automatically).
					.split(path.sep)
					// This removes any empty array values created by the split.
					.filter(function(value) { return !!value })
					.map(function(value) {
						return this.dir = path.join(this.dir, "/", value)
						// The object parameter is necessary to gain a local prototype in the function.
						}, {dir: ""})
					// These directories need to be created before the directory list so it is created first with mkdir so directory is concatenated to it.
					.concat(directory)

			// All of the directories will be created in sequential asynchronous order so that the lowest level directories are created first.
			var make_directory = (dir) => {
				// This is an example of a sequential asynchronous callback iteration.

				if ( !dir )
					return cb()

				fs.stat(dir, (error, stats) => {

					var p = directory.shift()

					if ( error ) {
						// An error in fs.stat probably means that the directory does not exist so it is attempted to be made.
						this.up.log("Creating directory", dir)
							fs.mkdir(dir, (error) => {
								// An error here is not good as the directory of the backup specified can not be accessed.
								if ( error )
									return err(this.up_err.log(error))
								make_directory(p)
							})
					}
					else {
						if ( !stats.isDirectory() )
							this.up_err.log("Unable to use or create directory:", dir).a(". It is already named as something else.")
						else
							this.up.log("Directory", dir, "exists.")
						make_directory(p)
					}

				})
			}
			make_directory(directory.shift())

		},
		create_document: function(structure, page_data, navlink_url, backup_dir, cb, err) {
			// This makes an Object with information regarding the markdown files found in the directory.
			// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			var data, cnt = 0, working_dir


			var find_working_dir = (struct, sub) => {

				struct.every(function(value) {

					if ( typeof value == "string" ) 
						working_dir = path.dirname(value.replace(RegExp(sub), ""))
					else {
						var key = Object.keys(value)[0]
						find_working_dir(value[key], path.join(sub, "/", key))
					}

					return !working_dir
				})
			}

			find_working_dir(structure, "")

			// This happens when the structure contains only directories and not document pages.
			if ( !working_dir )
				return cb()

			Object.keys(page_data).forEach((location, index, proto) => {

				data = page_data[location]
				content = data.content
				
				var url = navlink_url + path.posix.join("/", data.file_name)

				// create_navlink is always synchronous.
				var nav_list = this.create_navlink(structure, page_data, url, location, null, err)
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

				
				var dest = path.join(backup_dir, path.relative(working_dir, data.dir), "/", data.file_name)

				// The files can be created in any order sense there is no reason why any particular write would fail.
				fs.writeFile(dest, content, (error) => { 
					// This overwrites any existing markdown file with data which has updated navigation links.

					if ( error ) 
						err(this.up_err.log(error))

					if ( ++cnt === proto.length )
						cb(proto.length)
				})

			})
		},
		create_navlink: function(structure, page_data, location, url, cb, err) {

			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

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

					if ( location === value )
						navlist.push(level+"* **"+page_data[value].title+"**") 
					else 
						// Create an array with all of the links to all of the other pages except for the current page (value), sense there is no need to have
						// a link to the current page being viewed in the navlink.
						navlist.push(level+"* ["+page_data[value].title+"]("+url+")")
					
				})
			}

			make_navlink(structure, level)

			cb(navlist)
			return navlist
		},
		aquire_structure: function(dir, structure, cb, err) {
			// This member is tasked with finding the various files in (and maybe below), the specified dir and forming a structure which contains 
			// only the files which have a .md extension (excluding files which start with a dot).

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

				// Oddly enough, the original cb passed in is only called once even though this method is called many times. This is because the calls
				// which are made internally use separate cb and err parameters.
				cb.apply(cb.prototype, arguments)
		
			// It is necessary to use a bind here sense the ES6 descoped function syntax stores the instance data and also any variables which
			// were declared when the function was declared which results in incorrect values for the cb and structure data. This callback needs 
			// to have the current argument values and not the original ones.
			}).bind(this)

			var cnt, dir_cnt = 0

			fs.readdir(dir, (error, data) => { 

				if ( error )
					return err(this.up_err.log(error))

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
		aquire_document: function(structure, cb, err) {
			// Create an object (and set it the instance), which contains all of the data necessary to locate and find the markdown pages. Each array
			// object has its correlating link to the github url and thusly the complete structure of document pages can only be assembled after all of 
			// the structure entries are gathered here.
		
			cb = typeof cb === "function" && cb || function(){}
			err = typeof err === "function" && err || function(){}

			// This regex allocates the first markdown sub-heading in the file (the first element to have more than one #).
			var data = {}, cnt = structure.length

			var parse_file = (file_path) => {

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
							err(this.up_err.log(error))
						else if ( !title )
							err(this.up_err.l("A sub-heading (##[#,..]), could not be found in document", value).s("- It will be skipped.").log())
						else 

							// Store all of the data needed to mutate it in one object for all of the pages. The path.posix is used because the forward 
							// slash for directories is the same as uri separators.
							data[value] = { 
								file_name: file_name, 
								heading: title[0], 
								title: title[2], 
								dir: path.dirname(value), 
								content: content 
							}

						// After all pages in the structure are collects the callback is called unless the error print instance contains text data.
						if ( !--cnt ) 
							cb(data)

						// The value needs to be bound so that the async readFile function call gets the correct argument.
					})
				})
			}

			parse_file(structure)
		}
	
	}

	return def
})


