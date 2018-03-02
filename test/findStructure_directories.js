/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

	Brace document resides under the MIT licensed.

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

  Brace document is module to automatically add markdown page navigation links.

  this file is a part of Brace document 

 Author: Robert Steckroth, BustOut, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var cache = utils.cacheManager(require)
var it_will = global
global.module = module
// A simple addition to the expect module which tries to find a module.
expect.a_module = function(n, str) { }

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		it("r_js in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e; }})()).to.be.true 
			it_will.stop = false 
			done()
		})

		it("git is available in the system as a program", function(done) {
			it_will.stop = true 
			utils.Spawn("git", [], function() {
				expect(true).to.be.true
				it_will.stop = false 
				done()
			}, function() {
				expect(false, "git is not available as a system program").to.be.true
				done()
			})
		})
	})

	describe("using the testing example directory -> " + path.join("test", "example"), function() {

		describe("creates the proper document structure using the directory: "+ path.join("example", "directories"), function() {

			var cwd = path.join(__dirname, "example"), requirejs
			beforeEach(function() {
				cache.start()
				requirejs = require("requirejs")
				requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
			})
			afterEach(cache.dump.bind(cache))

			it("with the sort flag set to alphanumeric", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.an("array")
							expect(structure.length).to.equal(2)
							expect(structure).to.deep.equal([ 
								path.join(__dirname, "example", "directories", "framers.md"),
								path.join(__dirname, "example", "directories", "theCompany.md"),
							])
							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("with the sort flag set to alphanumeric and the reverse-sort flag set", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.reverseSort = true 
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.an("array")
							expect(structure.length).to.equal(2)
							expect(structure).to.deep.equal([ 
								path.join(__dirname, "example", "directories", "theCompany.md"),
								path.join(__dirname, "example", "directories", "framers.md"),
							])
							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("with the recursive flag set and the sort flag set to alphanumeric", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.recursive = true
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							expect(structure[0]).to.be.an("string")
							expect(structure[1]).to.be.an("object")
							// These should be in alphanumerical order.
							expect(structure).to.deep.equal(
							[
								path.join(__dirname, "example", "directories", "framers.md"), 
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories", "logistics", "wages.md"),
									] 
								}, 
								{ 
									"resorces": [
										path.join(__dirname, "example", "directories", "resorces", "0wood.md"),
										path.join(__dirname, "example", "directories", "resorces", "tools.md"),
									] 
								}, 
								path.join(__dirname, "example", "directories", "theCompany.md"), 
							])
							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("with the recursive flag set and the sort flag set to alphanumeric and the reverse-sort flag set", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.recursive = true
					parser.option.reverseSort = true
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							// These should be in alphanumerical order.
							expect(structure).to.deep.equal(
							[
								path.join(__dirname, "example", "directories", "theCompany.md"), 
								{ 
									"resorces": [
										path.join(__dirname, "example", "directories", "resorces", "tools.md"),
										path.join(__dirname, "example", "directories", "resorces", "0wood.md"),
									] 
								}, 
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories", "logistics", "wages.md"),
									] 
								}, 
								path.join(__dirname, "example", "directories", "framers.md"), 
							])
							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("with the recursive flag set, the sort flag set to depth", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth"
					parser.option.recursive = true
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							// These should be sorted by directory depth now.
							expect(structure).to.deep.equal(
							[
								path.join(__dirname, "example", "directories", "framers.md"), 
								path.join(__dirname, "example", "directories", "theCompany.md"), 
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories", "logistics", "wages.md"),
									] 
								}, 
								{ 
									"resorces": [
										path.join(__dirname, "example", "directories", "resorces", "0wood.md"),
										path.join(__dirname, "example", "directories", "resorces", "tools.md"),
									] 
								}, 
							])
							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("with the recursive flag set, the sort flag set to depth and the reverse-sort flag set", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth"
					parser.option.reverseSort = true
					parser.option.recursive = true
					parser.option.input = path.join(__dirname, "example", "directories")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							// These should be sorted by directory depth in reverse order now.
							expect(structure).to.deep.equal(
							[
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories", "logistics", "wages.md"),
									] 
								}, 
								{ 
									"resorces": [
										path.join(__dirname, "example", "directories", "resorces", "0wood.md"),
										path.join(__dirname, "example", "directories", "resorces", "tools.md"),
									] 
								}, 
								path.join(__dirname, "example", "directories", "framers.md"), 
								path.join(__dirname, "example", "directories", "theCompany.md"), 
							])

							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("using the nested directory with the recursive flag set, the sort flag set to alphanumeric and the reverse-sort flag set", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "alphanumeric"
					parser.option.reverseSort = true
					parser.option.recursive = true
					parser.option.input = path.join(__dirname, "example", "directories_nested")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							// These should be sorted by directory depth in reverse order now.
							expect(structure).to.deep.equal(
							[
								path.join(__dirname, "example", "directories_nested", "theCompany.md"), 
								{ 
									"resorces": [
										path.join(__dirname, "example", "directories_nested", "resorces", "tools.md"),
										{ 
											"nails": [
											] 
										}, 
										path.join(__dirname, "example", "directories_nested", "resorces", "0wood.md"),
									] 
								}, 
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories_nested", "logistics", "wages.md"),
									] 
								}, 
								path.join(__dirname, "example", "directories_nested", "framers.md"), 
							])

							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})

			it("using the nested directory with the recursive flag set, the sort flag set to depth and the reverse-sort flag set", function(done) {

				requirejs(["document_parse"], function(document_parse) { 

					var parser = document_parse()
					parser.option.sort = "depth"
					parser.option.reverseSort = true
					parser.option.recursive = true
					parser.option.input = path.join(__dirname, "example", "directories_nested")

					parser.findPath(cwd, function() {
						parser.findStructure(function(structure) {

							expect(structure).to.be.a("array")
							expect(structure.length).to.equal(4)
							// These should be sorted by directory depth in reverse order now.
							expect(structure).to.deep.equal(
							[
								{ 
									"logistics": [
										path.join(__dirname, "example", "directories_nested", "logistics", "wages.md"),
									] 
								}, 
								{ 
									"resorces": [
										{ 
											"nails": [
											] 
										}, 
										path.join(__dirname, "example", "directories_nested", "resorces", "0wood.md"),
										path.join(__dirname, "example", "directories_nested", "resorces", "tools.md"),
									] 
								}, 
								path.join(__dirname, "example", "directories_nested", "framers.md"), 
								path.join(__dirname, "example", "directories_nested", "theCompany.md"), 
							])

							done()

						}, function(error) { expect(true, error).to.be.false; done() })
					}, function(error) { expect(true, error).to.be.false; done() })
				})
			})
		})

	})

})

