// This file provides cross-platform access to the document.js CLI script in order to create the documents for this program (ironically useing this program
// do do so). This script should be used by: the npm run commands, the unit tests, and by the end-user at the command line. It also creates an additional 
// parameter to enable private plugin usage.

var path = require("path")

var args = ["-i", "docs_raw", "-b", "docs", "-r", "--navlink", "--force-title", "--title", "Brace document pages", "--sort", "depth"]

var p_args = process.argv.slice(2).filter(value => {
	// The extra parameter allows for the use of non-public plugins to be used.
	if ( value === "--extra" ) 
		// Use modules which are no available publicly.
		return !(this.extra = true)
	return true
})
	
if ( this.extra ) {
	p_args.push("--mocha")
	p_args.push("--specification")
	p_args.push("--link")
	p_args.push("--link-dest")
	p_args.push("README.md")
	p_args.push("--link-path")
	p_args.push(path.join("docs", "synopsis.md"))
}

p_args.unshift(path.join("bin", "document.js"))

var cmd = require("child_process").spawn("node", p_args.concat(args), {cwd: process.cwd()})

cmd.stdout.on("data", function(chunk) {
	console.log(chunk.toString())
})

cmd.stdout.on("error", function(error) {
	console.log(error)
})

cmd.on("exit", function(exit_code) {
	process.exit(4)
})
