

---
### Document pages
* [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
* [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
* [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
* Specification
  * [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
  * **pending..**
* The plugin system
  * [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
  * [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
* Using brace document
  * [pending..](https://github.com/restarian/brace_document/blob/master/docs/)
  * [pending..](https://github.com/restarian/brace_document/blob/master/docs/)

---
###  A module and program which creates base data for plugin utilization regarding document generation.

**Version**: 0.6.0

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Technologies used in development**:
  * [VIM](https://vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [brace_document_navlink](https://npmjs.org/package/brace_document_navlink) [requirejs](https://npmjs.org/package/requirejs)

**Optional Dependencies**: [batten_document_specification](https://npmjs.org/package/batten_document_specification)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | mocha |
 | make_document | ./bin/document.js -i docs_raw -vre -b docs --sort depth --specification-path specification/package_data_and_information.md; rm README.md; ln docs/synopsis.md ./README.md |