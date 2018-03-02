if (typeof define !== 'function') { var define = require('amdefine')(module) }

var fs = require("fs"),
	path = require("path"),
	os = require("os")

// This is done manually because the os.EOL property was not added until version 8 of nodejs.
var EOL = os.platform() === "win32" && "\r\n" || "\n"

define(["bracket_print", "bracket_utils", "./sort"], function(print, utils, sort) {
	
	var def = function(up, cb, err) {
	// The up argument (bracket print instance), is optional as one will be created if it is omitted.

		// This iterator returns an instanced link of the module regardless if the new keyword is used.
		var call_instance
		if ( !(this instanceof (call_instance = def) ) )
			return new (Array.prototype.slice.call(arguments).reduce(function(accumulator, value) {
				return accumulator = accumulator.bind(accumulator.prototype, value)
			}, call_instance))()

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

		up.log_title = up.log_title + "document_parse"
		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, title: up.log_title+" - ERROR:"})	

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}

		// The option data to use (which is also supplied by the cli program).
		this.option = {
			sort: "native", 
			projectLocation: process.cwd(),
			input: "",
			reverseSort: false,
			recursive: false, 
			enableAll: false,
			backup: "",
			pluginPath: "",
			pluginEnable: "",
			pluginRegex: "^(brace|batten|bracket)[\_,\-]document[\_,\-]"
		}

		this.project_root = ""
		this.docs_dir = ""
		this.backup_dir = ""

		cb.call(this)
	}
	
	def.prototype = { 

		appendCommander: function(program, plugin_list, cb, err) {
		// Iterate though the plugin list and append all of the option data stored in the options.js file into the provided commander instance.
		// The updated commander object is returned.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - appendCommander()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // ----------------------------------------------------------------------------------------------------

			if ( typeof program.parse !== "function") 
				return cb(program)

			plugin_list.forEach(value => {
				// remove the "brace_document_" from the plugin name
				// Add the option text to enable or disable the plugin.
				program.option("--"+value.option_name, "Enable the " + value.name + " plugin.")
				value.option.forEach(opt => {

					var title_name 
					if ( "usage" in opt ) {
						title_name = this.titleize(value.option_name)
						program.usage(program._usage + EOL + EOL + "-- " + title_name + " " + value.package_info.version + "  " + Array(115-title_name.length).join("-") + EOL + opt.usage)
					}
					else {
						var args = [opt.flag, "[" + value.option_name + "] " + opt.help]
						if ( "setter" in opt ) 
							args.push(opt.setter)
						if ( "default" in opt )	
							args.push(opt.default)

						program.option.apply(program, args)
					}
				})
			})

			cb(program)

		},
		findPath: function(dir, cb, err) {
		// Tasked with setting the proper paths which the other API members might use. All of the inputted option path data is transformed to the 
		// proper fully qualified paths or resolved relative paths.

			if ( typeof dir !== "string" ) {
				err = cb
				cb = dir
				dir = this.option.projectLocation
			}

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - findPath()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // ----------------------------------------------------------------------------------------------------

			// Make the url absolute if it is passed in a relative.
			dir = path.join(this.option.projectLocation, path.relative(this.option.projectLocation, dir))

			// This git command will output the project root directory so that this module can export a bin shell option which can run from within any project.
			// It is also needed so that the url will work with http links when using github or another repository server.
			// This is the root url of the nearest git repository.
			utils.Spawn("git", ["rev-parse", "--show-toplevel"], {cwd: dir}, (code, stdout, stderr) => {

				if ( stderr ) 
					return err_cb(up_err.log(stderr, "->", dir)) 
				// Remove any trailing slashes so that the link uri does not contain doubles when one is added later. This is done because it is never known
				// whether the url has a trailing slash.

				this.project_root = stdout.replace(/\r\n|[\n,\t]/g, "").replace(/\/$/, "").replace(/\//g, path.sep)

				var save_cwd = process.cwd.bind(process)
				process.cwd = (function(cd) { return cd }).bind(process, this.project_root)

				// Make sure that the working directory of the program is included in the commonjs module lookups.
				if ( ! module.paths.every(val => { return !(val === this.project_root) }) )
					module.paths.unshift(this.project_root)

				// Make sure that the inputted paths are as full as they can be relative to the project root.
				this.docs_dir = this.backup_dir = path.resolve(this.option.input)
				var relative_docs_dir = relative_backup_dir = path.relative(this.project_root, this.docs_dir)
				// path.join is always used so that this program will work in windows and *nix environments.
				relative_docs_dir = relative_docs_dir || ("."+path.sep)

				if ( this.option.backup ) {
					this.backup_dir = path.resolve(this.option.backup)
					relative_backup_dir = path.relative(this.project_root, this.backup_dir)
				}

				relative_backup_dir = relative_backup_dir || ("."+path.sep)
			
				// The directories specified to the constructor as options must have at least one path inside the project root. This is done
				// so that any file url can be relative to the project base url and thusly be navigated to in the documents via a link.
				if ( this.project_root !== this.backup_dir.substr(0, this.project_root.length) )
					return err_cb(up_err.s("The directory to use for the documents:", relative_backup_dir).l("which resolves to:")
							.s(path.resolve(relative_backup_dir)).l("resides outside the repository root directory of:")
							.s(this.project_root).log())

				process.cwd = save_cwd
				var out = up.s("Using git repository at", this.project_root).l("with document files in").s(this.option.input)
				if ( this.backup )
					out.l("Creating backups at").s(relative_backup_dir)

				out.log()
				cb()

			}, function(error) { err_cb(up_err.s("Unable to set project root with", dir).l(error).log()) })
	
		},
		sortStructure: function(structure, cb, err) {
			
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - sortStructure()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

				var sort_list = (list) => {

					list = this.sortList(list)

					list.forEach((value) => {
						if ( typeof value === "object" )
							sort_list(value[Object.keys(value)[0]])
					})
				}
				sort_list(structure)

			cb(structure)
			return structure
		},
		sortList: function(list, cb, err) {
		// Sort an array with the specified sorting function found in the sort.js script.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - sortList()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			if ( this.option.sort === "native" ) {
				cb(list)
				return list
			}

			var qualifier = (this.option.reverseSort&&"reverse_"||"")+this.option.sort
			if ( typeof sort[qualifier] !== "function" )
				up_err.log("Sorting type", qualifier, "is not available in the sort module.")
			else {
				if ( this.option.sort === "depth" ) {
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

			cb(list)
			return list

		},
		findStructure: function(dir, structure, cb, err) {
		// This member is tasked with finding the various files in (and below), the specified directory and forming an object array structure 
		// which contains only the files which have a .md extension (also excluding files which start with a dot). It is also used internally
		// to do asynchronous iterations of any arrays which are created from the directories it finds. The dir and structure arguments are 
		// both optional. The dir argument will otherwise be set to the docs directory set internally. The structure argument is used internally.

			if ( typeof dir === "function" ) { 
				err = structure 
				cb = dir
				structure = [] 
				dir = this.option.input
			} 
			else if ( typeof dir === "string" && typeof structure === "function" ) { 
				err = cb 
				cb = structure 
				structure = [] 
			}

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - findStructure()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
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
					up.log("No document pages were found within directory", dir)
				else {
					up.log("Found", structure.length, "documents in", dir)
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

			dir = path.normalize(dir)

			var save_cwd = process.cwd.bind(process)
			process.cwd = (function(cd) { return cd }).bind(process, this.project_root)
			dir = path.relative(this.project_root, dir)
			process.cwd = save_cwd

			fs.readdir(path.join(this.project_root, dir), (error, data) => { 

				if ( error )
					return err_cb(up_err.log(error))

				var cnt = data.length

				// This happens when the directory is empty. 
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
						if ( this.option.recursive && stat.isDirectory() && /^[^\.]/.test(value) ) {

							var a = {}
							a[value] = []

							structure.push(a)
							this.findStructure(sub_path, a[value], function() {
								if ( !(cnt-(++dir_cnt)) ) 
									callback(structure)
							}, err_cb)

						} 
						else { 
							// An Array with all the values (files), in the base directory is filtered to include all of the files included with the 
							// regex (non-hidden markdown files).
							if ( stat.isFile() && /^[^\.].*\.md$/.test(value) ) 
								structure.push(full_path)

							if ( !((--cnt)-dir_cnt) ) 
								callback(structure)
						}
					})
				})
			})

		},
		titleize: function(str, cb) {
		// Turn a string into a title by converting the non-letter characters into spaces and capitalizing the first letter in the words.
			
			cb = typeof cb === "function" && cb || function(){}
			if ( typeof str !== "string" )
				return ""
			// Convert camel case into spaces
			str = str.replace(/([a-z]+)([A-Z])/g, "$1 $2")
			// Turn everything which is not a letter into a space (including underscore which is matched by \w).
			.replace(/\W+/g, " ").replace(/\_+/g, " ")
			// All of the words should have the first letter capitalized.
			.replace(/\w+/g, function(mat) { return mat.charAt(0).toUpperCase() + mat.substr(1) })

			cb(str)
			return str

		},
		addStructureDirectory: function(structure, directory, cb, err) {
		// Add a directory to a structure object. The directory must be relative (no root identifiers at the beginning), and can be in in posix or
		// win32 format. The returned value is the array which lists the directory files. Note: this member is synchronous and returns a value.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - addStructure()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------
			// The relative identifier is removed 
			directory = directory.replace(/\.+[\\,\/]*/, "")

			if ( !directory ) {
				cb(structure)
				return structure 
			}

			var r = path.posix.parse(directory).root || path.win32.parse(directory).root
			if ( r )
				return err_cb(up_err.log("The directory parameter", directory, "must be relative (not contain a root). Found", r, "as the root."))

			var location = directory.replace(/^[\/,\\]+|[\/,\\]+$/g, "").split(/[\/,\\]/)
			var list = structure, add = {}

			location.forEach(subdir => {

				var has_dir = !list.every(value => {
					if ( typeof value === "object" && (subdir in value) ) {
						// returning false is the same as break when using every.
						add = value
						return false
					}
					// continue once more
					return true
				})

				if ( !has_dir ) {
					// Add the directory to the structure.
					add = {}
					add[subdir] = []
					list.push(add)
				}

				list = add[subdir]

			})
			
			cb(list)
			return list 
		},
		addData: function(data, full_path, content, cb, err) {
		// Add the data item to the data object. This member is synchronous.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - addData()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			// Store all of the data needed to mutate it in one object for all of the pages. The path.posix is used because the forward 
			// slash for directories is the same as uri separators.
			data[full_path] = { 
				content: content 
			}

			cb(data)
			return data
		},
		acquireData: function(structure, cb, err) {
		// Create an object which contains all of the data necessary to locate and find the markdown pages. Each array object has its correlating 
		// link to the github url and thusly the complete structure of document pages can only be assembled after all of the structure entries are 
		// gathered here.
		
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - acquireData()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------
				
			var data = {}, cnt = 0

			if ( !structure.length )
				return cb(data)

			var parse_file = (list) => {

				cnt += list.length
				
				list.forEach(value => {

					if ( typeof value === "object" ) {
						cnt--
						return parse_file(value[Object.keys(value)[0]])
					}

					fs.readFile(value, undefined, (error, content) => {

						cnt--
						if ( error ) 
							err(up_err.log(error))
						else
							this.addData(data, value, content.toString()||"")

						if ( !cnt )
							cb(data)

					})
				})
			}

			parse_file(structure)

		},
		createStructure: function(structure, backup_dir, cb, err) {
		// This member creates all of the directories in the original document location to the backup directory. The Object keys which denote directories 
		// are the only significant data which the structure. It is only necessary to use this member when a backup directory is requested. Otherwise, 
		// the originally parsed files will be overwritten with the new content. 

			if ( typeof backup_dir === "function" ) {
				err = cb
				cb = backup_dir
				backup_dir = this.backup_dir
			}

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - createStructure()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the arguments from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			// None of the directory structure creation is needed if a backup documentation directory is not supplied.
			if ( !backup_dir ) 
				return cb()
		
			var msg = up.s("Creating backup directory structure at", backup_dir)	
			if ( this.option.dryRun )
				msg.s("(not actually doing this because the dryRun option data is set).")

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

			find_directory(structure, "."+path.sep)

			// Make sure this is first so that is is created first if need be. All the others are created starting with the lowest level sense structure
			// is an accurate representation of the directory structure which was parsed.
			// Create the backup directory (which is the base directory for the documents), if it does not exist.

			var tld = path.parse(backup_dir).root.replace(/\\/g, "\\\\")

			directory = backup_dir
					// Removes the root identifier from the directory. E.g. C:\ or /
					.replace(RegExp("^"+tld), "")
					// Split the path based on the separator used within the current operating system (path.sep does this automatically).
					.split(path.sep)
					// This removes any empty array values created by the split.
					.filter(function(value) { return !!value })
					.map(function(value) {
						return this.dir = path.join(this.dir, value)
						// The object parameter is necessary to gain a local prototype in the function.
						}, {dir: tld})
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
						var msg = up.s("Creating directory", dir)
						if ( this.option.dryRun ) {
							msg.s("(not actually do this because the dryRun option is set).").log()
							make_directory(p)
						}
						else {
							msg.log()
							fs.mkdir(dir, (error) => {
								// An error here is not good as the directory of the backup specified can not be accessed.
								if ( error )
									return err_cb(up_err.log(error))
								make_directory(p)
							})
						}
					}
					else {
						if ( !stats.isDirectory() )
							up_err.s("Unable to use or create directory", dir).a(". It is already named as something else.").log()
						else
							up.log("Verified that", dir, "exists.")
						make_directory(p)
					}

				})
			}
			make_directory(directory.shift())

		},
		runPlugin: function(plugin_list, structure, data, cb, err) {
		// Call all of the plugins within the list generated by the getPlugin member. Only the plugins which were specified to be used 
		// via the options data will be called. The plugin_enable option is matched using a comma separated list of modules names. All plugins
		// listed there will be ran buy this member if it is also contained in the plugin list passed in. The plugin list is not mutated.

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - runPlugin()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the arguments from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			var mod, timeout, run_plugin = () => {

				// The last plugin to be ran has the error warning message and continuation call to run_plugin removed if it was called.
				clearTimeout(timeout)

				if ( mod = plugin_list.pop() ) {

					if ( this.option.enableAll || this.option.pluginEnable.match(RegExp("\,[\\ ,\\t]*"+ mod.name +"[\\ ,\\t]*,")) ) {
						var plugin_instance 
						try {
							plugin_instance = mod.plugin(this, up) 
						} catch(error) {
							up_err.log("Plugin", mod.name, "does not have a callable constructor.", error)
							return run_plugin()
						}
						if ( !("runThrough" in plugin_instance) ) {
							up_err.log("Plugin", mod.name, "does not have a runThrough member returne from calling its constructor.")
							run_plugin()
						}
						else {
							up.log("Calling plugin", mod.name)
							// Call all of the plugins asynchronously with a callback.
							timeout = setTimeout(() => {
								up_err.log("The plugin", mod.name, "did not call the callback passed into its runThrough member and timed out after eight seconds.")
								run_plugin()
							}, 8000)
							plugin_instance.runThrough(structure, data, run_plugin, err_cb)
						}
					}
					else
						run_plugin()
				}
				else 
					// After all of the plugins are called. 7 is the success return code for the command line invoking callback.
					cb(7)
				
			}

			run_plugin()
		
		},
		getPlugin: function(directory, cb, err) {
		// This member acquires all of the installed commonjs modules which have "brace_document_" prepended its name (e.g. brace_document_navlink). 
		// If the plugin regex option data is set than only the module(s) directory names which match with the passed in regular expression will be
		// gathered. E.g. setting plugin_regex to "^mycompany.*" would match the modules mycompany_library and mycompany-scipt.

			if ( typeof directory === "function" ) {
				err = cb
				cb = directory
				directory = undefined 
			}
			
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - getPlugin()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the arguments from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------
			// Get all of the available commonjs modules relative to the passed in directory and any other module paths entries.
			if ( this.option.pluginPath ) 
				module.paths.unshift(this.option.pluginPath)

			if ( directory ) {
				if ( typeof directory === "string" )
					module.paths.unshift(directory)
				else if ( directory instanceof Array )
					module.paths = directory.concat(module.paths)
			}

			module.paths = module.paths.map(value => {
				if ( path.basename(value) !== "node_modules" )
					return path.join(value, "node_modules")
				else
					return value
			})

			var data = [], found = {}, mod_path = module.paths.slice()
			var get_plugin = (dir) => {

				// The global path is located if the dir parameter is falsey.
				fs.readdir(dir, (error, out) => {

					if ( error )
						out = []

					out.forEach(value => {

						var plugin = path.parse(path.join(dir, value)), mod, option
						var regex_match = plugin.name.match(RegExp(this.option.pluginRegex)) 

						if ( !found[plugin.name] && regex_match ) {
							try {
								var mod = module.require(plugin.name)
								var package_info = module.require(path.join(plugin.name, "package.json"))
								// The plugins are loaded from the closest directory and not replaced if found again up the chain.
								up.log("Found plugin", plugin.name, "at", plugin.dir)
								found[plugin.name] = true
							} catch(error) {
								return err_cb(up_err.l("Unable to load plugin", path.join(plugin.dir, plugin.name), error).log())
							}
							try {
								var option = module.require(path.join(plugin.name, "option"))
							} catch(error) {
								up_err.l("Unable to load plugin option.js data from plugin", path.join(plugin.dir, plugin.name), error).log()
							}
							// Remove the brace_document_ string from the plugin name if it has one.
							var short_name = plugin.name.replace(/^brace_document_/, "")
							// This is the plugin object created from a module which gets added to the list and passed into the callback.
							data.push({name: plugin.name, option_name: short_name.replace(/\_/g, "-"), 
											dir: plugin.dir, plugin: mod, option: option, package_info: package_info})
						}
					})

					// Making sure to get the path from the beginning of the path which is how it is done within the module object.
					var next_path = mod_path.shift()
					if ( !next_path ) {
						// Sort in alphanumerical order first.
						data = data.sort()
						// The plugins are sorted in by the priority integer set in the package.json file. 
						data = data.sort(function(a,b) {
							var a1 = parseInt(a.package_info.priority) || Infinity
							var b1 = parseInt(b.package_info.priority) || Infinity
							if (  a1 > b1 )
								return -1
							else if ( a1 < b1 )
								return 1
							else
								return 0
						})

						up.log("Found", data.length, "plugins")
						cb(data)
					}
					else
						get_plugin(next_path)

				})
			}

			get_plugin(mod_path.slice().shift()||("."+path.sep))
		},
		writeData: function(backup_dir, structure, data, cb, err) {
		// Creates all of the document pages which are denoted by the structure argument with the document content in the corresponding data 
		// object. The backup_dir argument is optional as it will otherwise be set to the instance property value. It is included to create the
		// most robust API as passable.

			if ( typeof data === "function" ) {
				err = cb
				cb = data 
				data = structure
				structure = backup_dir
				backup_dir = this.backup_dir
			}
				
			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - writeData()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			} // --------------------------------------------------------------------------------------------------

			if ( !structure.length )
				return cb()

			var cnt = 0
			var write_list = (list, relative_dir) => {

				cnt += list.length

				list.forEach(value => {

					if ( typeof value === "object" ) {
						cnt--
						return write_list(value[Object.keys(value)[0]], path.join(relative_dir, Object.keys(value)[0]))
					}
					
					page = data[value]
					var file_path = path.join(backup_dir, relative_dir, path.basename(value))
					var msg = up.s("Writing out document", file_path)
					if ( this.option.dryRun ) {
						msg.s("(not actually doing this because the dryRun option is set).").log()
						if ( !(--cnt) )
							cb()
						return
					}
					msg.log()
					// The files can be created in any order sense there is no reason why any particular write would fail.
					fs.writeFile(file_path, page.content, (error) => { 
						// This overwrites any existing markdown file with data which has updated navigation links.

						if ( error ) 
							err_cb(up_err.log(error))

						if ( !(--cnt) )
							cb()
					})
				})
			}

			write_list(structure, "")
		},
	
	}

	return def
})


