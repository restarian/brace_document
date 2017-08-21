
/*
Copyright (c) 2017 Robert Steckroth <RobertSteckroth@gmail.com>

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

  Markdown mutate is module to automatically add markdown page navigation links.

  this file is a part of Markdown mutate 

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com>
*/

var path = require("path"),
	fs = require("fs"),
	info = require("./package.json"),
	program = require("commander"),
	url = require("url"),
	Spinner = require("process-wrap").Spinner

var dir = "", repo_url = ""
program.version(info.name + " " + info.version)
.usage("[options] [directory] -- This directory is the base path where the markdown files to mutate are found. The default directory is the directory"+
" where the script was started."+
"\n Important: The directory must be relative to the project root dir. The project root is the directory whixh contains.git repository."+
" This is done so that the links will work when click within a http platform."+
"\n Note: all of the markdown files need to be at the same level in the directory (recursive processing is not yet implemented)."+
"\nThe first sub-heading of the markdown file found will be used for the link title which is the first ##[#,..] found in the file."+ 
"\nThe page navagation list will be inserted (or replaced), at the first markdown underline ---[-,..] found followed by the heading: #[#,..]"+
" Document pages."+
"\nIf an exsiting navigation list is not found than it will be injecte below the first sub-heading found in the file."+
"\n E.g. The following is matched in the markdown file for replacement:"+
"\n\n----                          <-- this text is not replaced."+
"\n ### Document pages           <-- this text is not replaced."+
"\n * [link](url)                <-- replaced"+
"\n * Some documuntation text    <-- this text is not replaced."+
"\n * [link](url)                <-- this text is not replaced"+
"\n\nIn the example above, only the third line (the markdown link is replaced in the file."+
"All susequent links will be removed and replaced until another markdown underline or non-link syntax is found. If the file"+
" does not contain an underline and the #[#,..] Document pages string than one will be created underneath the sub-heading found above.")
// Todo: add recursive processing.
//.option("-r, --recursive", "This will descend into all sub-directories to find markdown files")
// Todo: add the option to create copies of the document pages instead of overwriting them.
//.option("-b, --backup", "This will use separate files for the mutations and keep the originals intact.")
.option("-u, --url [string]", "This is the url of the repository server. The default is to either use the git remote origin url of the current project.") 
.option("-v, --verbose", "Print any superfluous information from the run-time.")
.option("-p, --print-meta", "Print the meta data assembled from parsing the mardown files (in ecma sytax).")
.parse(process.argv)

repo_url = program.url || ""
// The directory is optional and will be the last process argument if provided from the command line.
dir = (program.args.pop() || process.cwd()).replace(/\/*$/, "")

// This git command will output the project root directory so that this module can export a bin shell program which can run from within any project.
// It is also needed so that the url will work with http links when using github or another repository server.
// This is the root url of the nearest git repository.
new Spinner("git", ["rev-parse", "--show-toplevel"], undefined, function() {

	var base_dir = this.stdout.replace(/[\n,\t,\r]*/g, "")
	// The remote origin url is used for the http reference links.
	new Spinner("git", ["config", "--get", "remote.origin.url"], undefined, function() {

		var origin_url = url.parse(this.stdout)
		// The current branch is used so that the other branches commit separate docs.
		new Spinner("git", ["branch", "-q"], undefined, function() {

			var branch = this.stdout.replace(/\s*\*\s*/, "").replace(/[\n\r]*/g, "")
			var meta = {}
			dir = path.relative(base_dir, dir)

			if ( program.verbose ) 
				console.log("Using git repository with root directory:", base_dir, "\nUsing markdown files in directory:", path.join(base_dir, "/", dir))

			if ( !repo_url ) 
				repo_url = origin_url.protocol + "//"+ origin_url.hostname + 
						path.posix.join(origin_url.path.replace(/\.git$/, ""), "/blob", "/"+branch, "/"+dir)
			// An Array with all the values(files), in the base directory is filtered to include all of the files included with the regex (non-hidden 
			// markdown files).
			var found = fs.readdirSync(path.join(base_dir, "/", dir)).filter(function(value) { return RegExp(/^[^\.].*\.md$/).test(value) })
			// This regex allocates the first markdown sub-heading in the file (the first element to have more than one #).
			var title_regex = /[\n,\r]\s*(\#\#+\s*)(.+)[\n,\r]/
			// A sub-heading with the text Document pages will be found by this regex
			var header_regex = /[\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+\s*Document pages[\n,\r]+/
			// This finds the pattern above and also finds a markdown style link immediately after it. The navigation links sub-heading title and the 
			// links are in separate regex matching groups.
			var header_link_regex = /([\n,\r]{2,}\-\-[\-]+[\n,\r]+[\#]+\s*Document pages[\n,\r]+)(\s*\*\s\[.*\]\(.*\)[\n,\r]+)/

			var meta = found.map(function(val) {
				var file = path.join(base_dir, "/", dir, "/", val)
				var contents = fs.readFileSync(file).toString()
				var title = contents.match(title_regex)
				if ( !title )
					return console.log("A sub-heading (##[#,..]), could not be found in file", file, "It will be skiped.")
				return { file_name: val, heading: title[0], title: title[2], path: file, url: repo_url+path.join("/", val)}
			})

			// This makes an Object with information regarding the markdown files found in the directory.
			meta.forEach(function(value) {
				
				var nav_list = meta.map(function(val) {
					return value.file_name !== val.file_name && ("* ["+val.title+"]("+val.url+")") || ""
				// This removes the empty value from the array so that a rouge new line wont be created when the join("\n") is used.
				}).filter(function(val) { return !!val })
				
				// Read the markdown file into a string. The synchronous version is used so it will be closed before it is re-opened and over-written to.
				var contents = fs.readFileSync(value.path).toString(), 
					nav_header = contents.match(header_regex),
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
		
			if ( program.verbose )
				console.log("Injected", Object.keys(meta).length-1, "navigation links into", Object.keys(meta).length, "files")
			if ( program.printMeta )
				console.log("\n\n", meta)
		// Log and end if the git commands failed.
		}, console.log.bind(console))
	}, console.log.bind(console))
}, console.log.bind(console))




