var info = require("../package.json"),
	program = require("commander"),
	print = require("bracket_print")

var dir = "", repo_url = ""
program.version(info.name + " " + info.version)
.usage(`[options] [directory]
----------------------------------------------------------------------------------------------------
The directory is the base path where the markdown files to mutate are
 found. The default directory is the directory where the script was started.
Important: the directory must be relative to the project root dir. The project root is the
 directory which contains.git repository. This is done so that the links will work when click
 within a http platform.
Note: all of the markdown files need to be at the same level in the directory (recursive
 processing is not yet implemented). The first sub-heading of the markdown file found will be
 used for the link title which is the first ##[#,..] found in the file. The page navagation
 list will be inserted (or replaced), at the first markdown underline ---[-,..] found followed
 by the heading: #[#,..] [specified navlink title]. If an existing navigation list is not found
 than it will be injecte below the first sub-heading (has more than one #), found in the file.

The following is matched in the markdown file for navlink replacement:

  ----                         <-- this text is not replaced
  ### Document pages           <-- replaced with same title or with the value set to --title when the --force-title flag is set
  * [link](url)                <-- replaced with the configured url.
  * Some documuntation text    <-- this text is not replaced sense it is not a markdown link
  * [link](url)                <-- this and all subsequent text is not altered sense the above text was not a markdown link

 In the example above, only the third line (the markdown link is replaced in the file. All
 subsequent links will be removed and replaced until another markdown underline or non-link
 syntax is found. If the file does not contain an underline and the #[#,..] [specified navlink title]
 string than one will be ceeated underneath the sub-heading found above.
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
