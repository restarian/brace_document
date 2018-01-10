var info = require("../package.json"),
	program = require("commander"),
	print = require("bracket_print")

var dir = "", repo_url = ""
program.version(info.name + " " + info.version)
.usage(`[options] [directory]
----------------------------------------------------------------------------------------------------
The last parameter is the base directory where the markdown files are found. The directory where the 
script was started is used when not supplied. This directory must be at or below a project root directory
structure in order to use the associated information. The project root is the directory which contains
the .git repository. The backup directory can be an absolute path or a relative path and does not need
to be contained in a project. The project root directory will be used as the base directory (the same way
the last parameter is), if it is supplied as relative.

The first sub-heading of the markdown file found will be used for the link title which is the first ##[#,..]
found in the document. The page navagation list will be inserted (or replaced), at the first markdown 
underline ---[-,..] found followed by the heading: #[#,..] [specified navlink title]. If an existing 
navigation list is not found than it will be injected below the first sub-heading (any heading which hase 
more than one #), found in the file. E.g. The following navigation text is matched in the markdown file for 
navlink replacement:

  ----                         <-- this text is not replaced
  ### Document pages           <-- replaced with same title or with the value set to --title when the --force-title flag is set
  * [link](url)                <-- replaced with the configured url.
  * Some documuntation text    <-- this text is not replaced sense it is not a markdown link
  * [link](url)                <-- this and all subsequent text is not altered sense the above text was not a markdown link

In the example above, only the third line (the markdown link syntax), is altered in the document. If the 
file does not contain an underline and the #[#,..] [specified navlink title] string than one will be created
underneath the sub-heading found above using the default title (which can be set with --title), of "Document pages".
-------------------------------------------------------------------------------------------------------`)
.option("-u, --url <string>", "This is the url of the repository server. The default is to either use the git remote origin url of the current project.") 
.option("-t, --title <string>", "The title of the navlink heading to use when one is not found. This is also used when the force title flag is set. ") 
.option("-f, --force-title", "The title found in the current page markdown will be used if this is not set.") 
.option("-v, --verbose", "Print any superfluous information from the run-time.")
.option("-r, --recursive", "Descend into all sub-directories to find markdown files.")
.option("-b, --backup <directory>", "This will create separate files and directories for the mutations and keep the originals intact.")
.option("-s, --sort", "The program will arrange the navlinks list in alphanumeric order (which is how ls and dir show them), by default." +
"Sorting by depth (which will place all page links before sub-pages/directory page links), can be enabled with this flag.")
.parse(process.argv)

// The directory is optional and will be the last process argument if provided from the command line.
if ( process.argv.length <= 2 ) {
	program.outputHelp()
	process.exit(0)
}

require("../../brace_navlink")(program, print({title_stamp: false, log_title: "navlink bin"}), function(exit_code) { process.exit(exit_code) })
