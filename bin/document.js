#!/usr/bin/env node
/*  Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com> -- MIT license

Brace Document resides under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  this file is a part of Brace Document

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

var info = require("../package.json"),
	program = require("commander"),
	print = require("bracket_print"),
	path = require("path"),
	up = print({level: 0, title_stamp: false, title: false})

program.version(info.name + " " + info.version)
.usage(`[options] 

-- Brace Document `+info.version+`  ----------------------------------------------------------------------------------------------------
  The input option will be used as the "docs directory" parameter. Otherwise, the current working directory of the shell is used if 
it is not suppied. The docs directory (or input), must be at or below a project location directory structure in order to use the associated 
information. The project location directory is automatically set as the directory which contains the first found .git repository from the 
current working directory of the process.
  The "backup" option can be used to specify a directory where copies of the "docs directory" files will be created. It
is acceptable to specify a "docs directory" which is outside (below), the project location only if the "backup" option is 
set to a directory which is inside the project location. At least one of the "docs directory" or the "backup" directories
must be inside the project location directory. 
  Plugins are found using the commonjs structure created by the npm package manager. The plugin module paths are relative
to the project location directory. Any plugins found will have its option data appended to this gateway menu and can be 
viewed with the -h flag.`)
.option("-v, --verbose", up.toStyleString("Print any and all superfluous information from the run-time."))
.option("-q, --quiet", up.toStyleString("No not output any log messages (including errors). This option supersedes the verbose flag."))
.option("-C, --no-color", up.toStyleString("Print everthing in black and white (is more efficient)."))
.option("-i, --input <path>", up.toStyleString("The location of the docs to parse. Note: these files will be overwritten if the --backup option is not set."), process.cwd())
.option("-r, --recursive", up.toStyleString("Descend into all sub-directories to find markdown files."))
.option("-d, --project-location <directory>", up.toStyleString("An absolute directory which is at or inside the repository to work with. If not supplied", 
	"this will be the current working directory of the shell process that started this program. Therefore, it is easiest to omit this parameter while",
	"running this command from within the project which is being operated on."), process.cwd())
.option("-p, --plugins", up.toStyleString("Print all of the available plugins to standard out and return without further action."))
.option("-P, --plugin-path <directory>", up.toStyleString("Add a path to the module lookups when searching for plugins. The directory should contain a",
	"node_modules sub-directory or be a node_modules directory."), "")
.option("-e, --enable-all", up.toStyleString("Use all of the plugins found by the program. Each plugin will only be called once."))
.option("--dry-run", up.toStyleString("Do not write any data out to the docs and/or backup directory and output log messages if the verbose option is",
	"used as well."))
.option("-x, --plugin-regex <regex>", up.toStyleString("This may be set to an ECMA complient regular expression which will be used to locate plugins",
	"by name. The entire name must be matched. This only applies to the directory which contains the plugin. E.g. /home/brand_plugin_tester would match",
	"to -x '^brand_plugin_.*'"), "^(brace|batten|bracket)[\_,\-]document[\_,\-]")
.option("-b, --backup <directory>", up.toStyleString("This will create separate files and directories for the mutations and keep the originals intact.",
	"The directory path must be contained within the project repository so that proper links can be created relative to it. It can be supplied as either",
	"absolute or relative to the project location."))
.option("-s, --sort <alphanumeric, depth, native>", up.toStyleString("alphanumeric: the documents and directory structure be arranged in alphanumeric order", 
	"according to the base name of the path (e.g. myfile.txt in /home/me/myfile.txt). depth: all of the sub-directories will be arranged at the top", 
	"of the directory list with the document pages below. Note: the structure will be pre-sorted in alphanumeric regardless of the reverse-sort flag", 
	"when the sort option is set to 'depth'. native: the structure is kept the same as the operating system outputs it (which is most efficient)."), "native")
.option("-R, --reverse-sort", up.toStyleString("Reverse the sorting operation specified via the -sort option."))

// The process exit code is maintained for unit testing via the cli.
require("../../brace_document")(program, print({level: 1, title_stamp: false, log_title: path.join("bin", "document")}), function(exit_code) { process.exit(exit_code||0) })
