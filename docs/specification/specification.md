#  Brace Document
## Project Specification Data


---
### Brace document
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/README.md)
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/code_of_conduct.md)
* [Making a difference with brace document ](https://github.com/restarian/brace_document/blob/master/docs/contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license.md)
  * **Project specification data**
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins.md)
  * [Creating plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_plugins.md)
* Using brace document
  * [Using the program script](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/module_import_usage.md)

---
###  A module and program which creates base data for plugin utilization regarding document generation.

**Version**: 0.5.3

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Technologies used in development**:
  * [VIM](https://vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering

**License**: MIT

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [requirejs](https://npmjs.org/package/requirejs)

**Optional Dependencies**: [brace_document_navlink](https://npmjs.org/package/brace_document_navlink) [batten_document_specification](https://npmjs.org/package/batten_document_specification)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | mocha |
 | make_document | node ./bin/document.js -vre -s 'depth' -t 'Brace document' -b docs docs_raw; rm README.md; ln docs/README.md . |