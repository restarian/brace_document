if (typeof define !== 'function') { var define = require('amdefine')(module) }

var fs = require("fs"),
	path = require("path"),
	EOL = require("os").EOL

define(["bracket_print", "bracket_utils", "./sort"], function(print, utils, sort) {
	
	var def = function(up, cb, err) {

		// This iterator returns an instanced link of the module regardless if the new keyword is used.
		var call_instance
		if ( !(this instanceof (call_instance = def) ) )
			return new (Array.prototype.slice.call(arguments).reduce(function(accumulator, value) {
				return accumulator = accumulator.bind(accumulator.prototype, value)
			}, call_instance))()

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}
	
		if ( up instanceof print ) 
			this.up = up = up.spawn(up.log_title+" -> ") 
		else {
			if ( typeof up === "function" )
				cb = up
			this.up = up = print({level: 1, title: true, title_stamp: false})
		}

		up.log_title = up.log_title + "document_parse"
		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, title: up.log_title+" - ERROR:"})	

		// The option data to use (which is also supplied by the cli program).
		this.reverse_sort = this.recursive = false
		this.sort = this.relative_backup_dir = this.relative_docs_dir = this.project_root = this.docs_dir = this.backup_dir = ""

		// Get the primary heading of the document page. This is the first heading found at value found at two or below.
		this.heading_regex = /^\s*(\#+[\ ,\t]*)(.+)[\n,\r]/

	}
	
	def.prototype = { 

		appendCommander: function(program, plugin_list, cb, err) {
			// Iterate though the plugin list and append all of the option data stored in the options.js file into the provided commander instance.
			// The updated commander object is returned.
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - appendCommander()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // ----------------------------------------------------------------------------------------------------

			plugin_list.forEach((value) => {
				var short_name = value.name.split("_").slice(2)
				// Add the option text to enable or disable the plugin.
				program.option("--"+short_name, "Enable the " + value.name + " plugin.")
				value.option.forEach((opt) => {

					if ( "usage" in opt ) {
						var module_title = short_name.map((val)=>{ 
							// Make the plugin name pretty with titleize
							return this.titleize(val)
						}).join(" ")
						program.usage(program._usage + EOL + EOL + "-- " + module_title + "  " + [ ...Array(115-module_title.length)].join("-") +
						EOL + opt.usage)
					}
					else
						program.option(opt.flag, " <- "+short_name.join(" ") + ": "+opt.help)
				})
			})

			cb(program)

		},
		findPath: function(dir, cb, err) {

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - findPath()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // ----------------------------------------------------------------------------------------------------

			// This git command will output the project root directory so that this module can export a bin shell option which can run from within any project.
			// It is also needed so that the url will work with http links when using github or another repository server.
			// This is the root url of the nearest git repository.
			utils.Spawn("git", ["rev-parse", "--show-toplevel"], {cwd: dir}, (code, stdout, stderr) => {

				if ( stderr ) 
					return err_cb(up_err.log(stderr, "->", dir)) 
				// Remove any trailing slashes so that the link uri does not contain doubles when one is added later. This is done because it is never known
				// whether the url has a trailing slash.

				this.project_root = stdout.replace(/[\n,\t,\r]*/g, "").replace(/\/$/, "").replace(/\//g, path.sep)

				// Make sure that the inputted paths are as full as they can be relative to the project root.
				this.docs_dir = this.backup_dir = path.resolve(this.project_root, this.relative_docs_dir)
				this.relative_docs_dir = this.relative_backup_dir = path.relative(this.project_root, this.docs_dir)
				// path.join is always used so that this program will work in windows and *nix environments.
				this.relative_docs_dir = this.relative_docs_dir || ("."+path.sep)

				if ( this.backup ) {
					this.backup_dir = path.resolve(this.project_root, this.backup)
					this.relative_backup_dir = path.relative(this.project_root, this.backup_dir)
				}

				this.relative_backup_dir = this.relative_backup_dir || ("."+path.sep)

				// The directories specified to the constructor as options must have at least one path inside the project root. This is done
				// so that any file url can be relative to the project base url and thusly be navigated to in the documents via a link.
				if ( this.project_root !== this.backup_dir.substr(0, this.project_root.length) )
					return err_cb(up_err.s("The directory to use for the documents:", this.relative_backup_dir).l("which resolves to:")
							.s(path.join(this.project_root, this.relative_backup_dir)).l("resides outside the repository root directory of:")
							.s(this.project_root).log())


				var out = up.s("Using git repository at:", this.project_root).l("with document files in:").s(this.relative_docs_dir)
				if ( this.backup )
					out.l("Creating backups at:").s(this.relative_backup_dir)
				out.log()
				
				cb()

			}, err_cb)
	
		},
		sortList: function(list, cb, err) {
			// Sort an array with the specified sorting function found in the sort.js script.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - sortList()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------


			var qualifier = (this.reverse_sort&&"reverse_"||"")+this.sort
			if ( typeof sort[qualifier] !== "function" )
				up_err.log("Sorting type", qualifier, "is not available in the sort module.")
			else {
				if ( this.sort === "depth" ) {
					try {
						list = list.sort(sort["alphanumeric"])
						list = list.sort(sort[qualifier])
					} catch(error) { return err_cb(up_err.log(error)) }
				}
				else
					try {
						list = list.sort(sort[qualifier])
					} catch(error) { return err_cb(up_err.log(error)) }
			}

			cb()

		},
		findStructure: function(dir, structure, cb, err) {
			// This member is tasked with finding the various files in (and below), the specified directory and forming an object array structure 
			// which contains only the files which have a .md extension (also excluding files which start with a dot).

			if ( typeof dir !== "string" ) {
				cb = dir 
				err = structure 
				structure = []
				dir = this.relative_docs_dir 
			}

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - findStructure()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			var callback = (function(list) {  
				// The cb callback is wrapped so that the message can be logged before the original callback is called and to run the sorter function
				// on all of the sub-directory arrays. This function only calls the callback passed in when the base directory is finished processing. 

				if ( !list || !list.length )
					up.log("No document pages were found within directory:", dir)
				else {
					up.log("Found", structure.length, "documents in:", dir)
					if ( this.sort ) 
						this.sortList(list)
				}

				// Oddly enough, the original cb passed in is only called once even though this method is called many times. This is because the calls
				// which are made internally use a separate cb function.
				cb.apply(cb.prototype, arguments)
		
			// It is necessary to use a bind here sense the ES6 descoped function syntax stores the instance data and also any variables which
			// were declared when the function was declared which results in incorrect values for the cb and structure data. This callback needs 
			// to have the current argument values and not the original ones.
			}).bind(this)

			var dir_cnt = 0

			fs.readdir(path.join(this.project_root, dir), (error, data) => { 

				if ( error )
					return err_cb(up_err.log(error))

				var cnt = data.length

				if ( !cnt )
					callback(structure)

				data.forEach(value => { 
				
					var sub_path = path.join(dir, value)
					var full_path = path.join(this.project_root, sub_path)

					fs.stat(full_path, (error, stat) => {

						if ( error ) {
							cnt--
							return err_cb(up_err.log(error))
						}

						// The recursive flag simply toggles directory processing. If set, the hidden directories are not processed.
						if ( this.recursive && stat.isDirectory() && /^[^\.]/.test(value) ) {

							var a = {}
							a[value] = []

							structure.push(a)
							this.findStructure(sub_path, a[value], function() {
								if ( !(cnt-++dir_cnt) ) 
									callback(structure)
							}, err_cb)

						}
						// An Array with all the values (files), in the base directory is filtered to include all of the files included with the 
						// regex (non-hidden markdown files).
						else if ( stat.isFile() && /^[^\.].*\.md$/.test(value) ) {

							structure.push(full_path)
							if ( !((--cnt)-dir_cnt) ) 
								callback(structure)
						}
						else 
							cnt--

					})
				})
			})

		},
		titleize: function(str, cb) {
			// Turn a string into a title by converting the non-letter characters into spaces and capitalizing the first letter in the words.
			
			cb = typeof cb === "function" && cb || function(){}

			// Convert camel case into spaces
			str = str.replace(/([a-z]+)([A-Z])/g, "$1 $2")
			// Turn everything which is not a letter into a space (including underscore which is matched by \w).
			.replace(/\W+/g, " ").replace(/\_+/g, " ")
			// All of the words should have the first letter capitalized.
			.replace(/\w+/g, function(mat) { return mat.charAt(0).toUpperCase() + mat.substr(1) })

			cb(str)
			return str

		},
		acquireData: function(structure, cb, err) {
			// Create an object (and set it the instance), which contains all of the data necessary to locate and find the markdown pages. Each array
			// object has its correlating link to the github url and thusly the complete structure of document pages can only be assembled after all of 
			// the structure entries are gathered here.
		
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - acquireData()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			// This regex allocates the first markdown sub-heading in the file (the first element to have more than one #).
			var data = {}, cnt = structure.length

			var parse_file = (file_path, base_dir) => {

				file_path.forEach(value => {

					if ( typeof value === "object" ) {
						dir_name = Object.keys(value).pop()
						// Subtract one to account for the directory which is process here while added all of the directory structure entries to the total.
						cnt += value[dir_name].length - 1
						// TODO: a call stack is accrued here so the directory depth is limited to ~1500
						return parse_file(value[dir_name], path.join(base_dir, dir_name))
					}
					// Loop through all of the document pages which will have their contents mutated and create an array of data objects which contain
					// the parsed markdown data.
					fs.readFile(value, undefined, (error, content) => {

						if ( error ) 
							err(this.up_err.log(error))

						// Turn the buffer into a string.
						content = content && content.toString() || ""
						var doc = path.parse(value)
						
						var primary_heading = content.match(this.heading_regex)
						if ( ! primary_heading ) {
							up.s("A primary heading ( #+.* ), could not be found within the document", value).log()
							//.a(". The commonjs name entry will be used") .s("for the project title instead.").log()
							primary_heading = [""]
						}

						var secondary_heading = content.replace(primary_heading[0], "").match(this.heading_regex)
						if ( ! secondary_heading ) {
							up.s("A secondary heading ( #+.*\n#+.* ), could not be found within the document", value).a(". The document filename will be")
							.s("used for the document title instead.").log()
							secondary_heading = [this.titleize(doc.name)]
						}

						// Store all of the data needed to mutate it in one object for all of the pages. The path.posix is used because the forward 
						// slash for directories is the same as uri separators.
						data[value] = { 
							file_name: doc.base, 
							relative_dir: base_dir, // remove beginning separator as well 
							document_dir: doc.dir, 
							base_dir: doc.dir.replace(RegExp(base_dir+"$"), ""),
							primary_heading: primary_heading[0], 
							secondary_heading: secondary_heading[0],
							content: content 
						}

						// After all pages in the structure are collects the callback is called unless the error print instance contains text data.
						if ( !--cnt ) 
							cb(data)

						// The value needs to be bound so that the async readFile function call gets the correct argument.
					})
				})
			}

			parse_file(structure, "")

		},
		createStructure: function(structure, backup_dir, cb, err) {
			// This member creates all of the directories in the original document location to the backup directory. It is only necessary when a backup
			// directory is requested. Otherwise, the originally parsed files will be overwritten with the new content. 

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - createStructure()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the arguments from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			// None of the directory structure creation is needed if a backup documentation directory is not supplied.
			if ( !backup_dir ) 
				return cb()
		
			up.log("Creating backup directory structure at:", backup_dir)	
			var directory = []
			
			var find_directory = function(structure, dir) { 
				// Recursively iterate the structure and assemble an array of all the directories which will need to be verified and/or created.

				structure.forEach(function(value, index, proto) { 

					if ( typeof value === "object" ) {
						var key = Object.keys(value).shift()
						var d = path.join(dir, key)
						directory.push(path.join(backup_dir, d))
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
						return this.dir = path.join(this.dir, value)
						// The object parameter is necessary to gain a local prototype in the function.
						}, {dir: "./"})
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
						up.log("Creating directory", dir)
							fs.mkdir(dir, (error) => {
								// An error here is not good as the directory of the backup specified can not be accessed.
								if ( error )
									return err_cb(up_err.log(error))
								make_directory(p)
							})
					}
					else {
						if ( !stats.isDirectory() )
							up_err.s("Unable to use or create directory:", dir).a(". It is already named as something else.").log()
						else
							up.log("Directory", dir, "exists.")
						make_directory(p)
					}

				})
			}
			make_directory(directory.shift())

		},
		getPlugin: function(dir, cb, err) {
		// This member acquires all of the installed commonjs modules which have "brace_document_" prepended its name (e.g. brace_document_navlink).

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - getPlugin()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the arguments from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------
	
			// Make sure that the working directory of the program is included in the commonjs module lookups.
			module.paths.unshift(dir)

			// Get all of the available commonjs modules relative to the passed in directory and any other module paths entries.
			utils.Exec("npm", ["ls", "--parseable", "--silent"], {cwd: dir}, (code, stdout, stderr) => {

				var data = []
				// The level should be 0 if it is to always be printed (which is a personal preference and not a bracket print attribute).

				stdout.replace(/(.*)[\n,\r]+/g, function(all, first) {
					var plugin = path.parse(first)
					if ( plugin.name.match(/brace_document_.*/) ) {
						try {
							var mod = module.require(plugin.name)
							var option = module.require(plugin.name+"/option")
						} catch(error) {
							err_cb(up_err.log(error))
						}
						data.push({name: plugin.name, dir: plugin.dir, plugin: mod, option: option})
					}
				})
				cb(data)
			}, err)

		},
		writeData: function(structure, page_data, backup_dir, cb, err) {
			// This makes an Object with information regarding the markdown files found in the directory.
			// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up_err = this.up_err.s(), up = this.up.s()
			up.log_title = up.log_title + " - writeData()"
			up_err.log_title = up.log_title + " - ERROR"
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			var data, cnt = 0

			Object.keys(page_data).forEach(function(location, index, proto) {

				data = page_data[location]
				content = data.content
				
				var dest = path.join(backup_dir, data.relative_dir, data.file_name)

				// The files can be created in any order sense there is no reason why any particular write would fail.
				fs.writeFile(dest, content, (error) => { 
					// This overwrites any existing markdown file with data which has updated navigation links.

					if ( error ) 
						err_cb(up_err.log(error))

					if ( ++cnt === proto.length )
						cb(proto.length)
				})

			})

		},
	
	}

	return def
})


