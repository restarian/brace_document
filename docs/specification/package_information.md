###  A module and program which creates base data for plugin utilization regarding document generation.

**Version**: 0.7.3

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [brace_document_navlink](https://npmjs.org/package/brace_document_navlink) [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [requirejs](https://npmjs.org/package/requirejs)

**Optional Dependencies**: [batten_document_specification](https://npmjs.org/package/batten_document_specification) [brace_document_link](https://npmjs.org/package/brace_document_link)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | mocha |
 | brace_document | node ./bin/document.js |
 | make_docs | npm run brace_document -- -i docs_raw -b docs --link-dest README.md --link-path docs/synopsis.md --force-title --title 'Brace document pages' --sort depth |
 | make_docs_extra | npm run make_docs -- --specification --mocha |

**Keywords**: *brace*, *markdown*, *documentation*, *generation*

**Technologies used in development**:
  * [VIM](https://vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering