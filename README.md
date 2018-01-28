# Brace Navlink 
## Synopsis 

[![Build status](https://ci.appveyor.com/api/projects/status/pwl5j7ou42q8q9hb/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-navlink/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_navlink.svg?branch=master)](https://travis-ci.org/restarian/brace_navlink) [![Downloads](https://img.shields.io/npm/dm/brace_navlink.svg?svg=true)](https://npmjs.org/package/brace_navlink)

| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 

----
### Brace Navlink
* **Synopsis**
* [Command usage](https://github.com/restarian/brace_navlink/blob/master/docs/usage.md)
* Development
  * [The todo list](https://github.com/restarian/brace_navlink/blob/master/docs/development/todo.md)
* Specification
  * [License information](https://github.com/restarian/brace_navlink/blob/master/docs/specification/license.md)

----

**Author: Robert Steckroth, Bustout**

**License: MIT**

**Bonuses:**
* A beautiful showpiece of fully asynchronous non-blocking run-time program/script.
* Idempotent API design runs safely from anywhere on the system.
* Operates as a system program from the command line or an import library.
* Uses AMD (asynchronous module definition) syntax.
* Runs in Linux and/or Windows environments.
* Well commented, unit tested, professional code

**Caveat:**
* The entire parser API can not be set to operate synchronously or asynchronously with one option setting.

This module provides an idempotent script/shell command that injects navigation list syntax into markdown pages. The pages are collected from a directory in the git project and link urls are created which reference them.


The command below is used to create these very docs:
```bash 
node bin/navlink.js -vrf -t "Brace Navlink" -b docs docs_raw
```


