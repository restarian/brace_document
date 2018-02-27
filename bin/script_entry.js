// This file provides cross-platform access to the document.js CLI script which can be used by: the npm run commands, the unit tests, and by the end-user 
// at the command line. It also creates an additional parameter to enable private plugin usage.

var path = require("path")
var fs = require("fs")

var args = ["-i", "docs_raw", "-b", "docs", "-r", "--navlink", "--force-title", "--title", "\"Brace document pages\"", "--sort", "depth"]

var p_args = process.argv.slice(2).filter(value => {
	// The extra parameter allows for the use of non-public plugins to be used.
	if ( value === "--extra" ) 
		// Use modules which are no available publicly.
		return !(this.extra = true)
	return true
})
	
if ( this.extra ) {
	p_args.push("--specification")
	p_args.push("--specification-path")
	// The path join here is one of the reasons to have an entry script like this one.
	p_args.push(path.join("specification", "package_data_and_information.md"))
}

p_args.unshift("./bin/document.js")

var cmd = require("child_process").spawn("node", p_args.concat(args), {cwd: process.cwd()})

cmd.stdout.on("data", function(chunk) {
	console.log(chunk.toString())
})

cmd.stdout.on("error", function(error) {
	console.log(error)
})

cmd.on("exit", function(exit_code) {

	if ( exit_code == 7 ) 
		fs.unlink(path.join(__dirname, "..", "README.md"), function(error) {

			fs.link(path.join(__dirname, "..", "docs", "synopsis.md"), path.join(__dirname, "..", "README.md"), function(error) {
				if ( error ) {
					console.log(error)
					process.exit(-1)
				}
				else 
					process.exit(4)
			})
		})

})
