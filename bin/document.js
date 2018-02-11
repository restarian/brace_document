#!/usr/bin/env node
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

var info = require("../package.json"),
	program = require("commander"),
	print = require("bracket_print")

var dir = "", repo_url = ""
program.version(info.name + " " + info.version)
.usage(`[options] [docs directory]

-- Brace Document  ----------------------------------------------------------------------------------------------------
[docs directory] - The base directory where the markdown files are found. 
  The last parameter passed into the command will be used as the "docs directory" parameter. Otherwise, the current 
working directory of the shell is used if it is not suppied. The docs directory must be at or below a project root 
directory structure in order to use the associated information. The project root directory is automatically set as the 
directory which contains the first found .git repository from the current working directory of the process.
  The "backup" option can be used to specify a directory where copies of the "docs directory" files will be created. It
is acceptable to specify a "docs directory" which is outside (below), the project root only if the "backup" option is 
set to a directory which is inside the project root. At least one of the "docs directory" or the "backup" directories
must be inside the project root directory. 
  Plugins are found using the commonjs structure created by the npm package manager. The plugin module paths are relative
to the project root directory. Any plugins found will have its option data appended to this gateway menu and can be 
viewed with the -h flag.`)
.option("-v, --verbose", "Print any superfluous information from the run-time.")
.option("-q, --quiet", "No not output any log messages (including errors). This option supersedes the verbose flag.")
.option("-r, --recursive", "Descend into all sub-directories to find markdown files.")
.option("-p, --plugins", "Print all of the available plugins.")
.option("-e, --enable-all", "Use all of the plugins available.")
//.option("-d, --dry-run", "Do not write any data out including the docs and/or backup directory.")
.option("-x, --plugin-regex <string>", "This may be set to an ECMA complient regular expression which will be used to locate plugins by name. The entire" +
" name must be matched. This only applies to the directory which contains the plugin. E.g. /home/brand_plugin_tester would match to -x 'brand_plugin_.*') 
.option("-b, --backup <directory>", "This will create separate files and directories for the mutations and keep the originals intact. The directory path" +
" must be contained within the project repository so that proper links can be created relative to it. It can be supplied as either absolute or relative" +
" to the project root.")
.option("-s, --sort <alphanumeric, depth>", "alphanumeric: The documents and directory structure be arranged in alphanumeric order. depth: All"+
	" of the sub-directories will be arranged at the top of the directory list with the document pages below. Note: the structure will be presorted in" +
	" alphanumeric regardless of the reverse-sort flag when the sort option is set to *depth*.")
.option("-R, --reverse-sort", "Reverse the sorting operation specified via the --sort option.")

// The process exit code is maintained for unit testing via the cli.
require("../../brace_document")(program, print({level: 1, title_stamp: false, log_title: "bin/document"}), function(exit_code) { process.exit(exit_code) })
