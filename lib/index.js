/*
 * Copyright (c) 2018, Juan Cruz Viotti
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const hawthorn = require('hawthorn')

const isModuleEntryPoint = (modulePath, realpath) => {
  return modulePath === path.dirname(realpath) && [
    'index.js',
    'index.tsx',
    'index.ts'
  ].includes(path.basename(realpath))
}

const isInsideModule = (modulePath, realpath) => {
  return realpath.startsWith(modulePath)
}

const getModuleContainer = (modules, realpath) => {
  for (const modulePath of modules) {
    if (isInsideModule(modulePath, realpath)) {
      return modulePath
    }
  }

  return null
}

const lint = (files, modules) => {
  const errors = []
  Reflect.deleteProperty(files, 'package.json')

  for (const [ name, definition ] of Object.entries(files)) {
    for (const dependency of definition.dependencies) {
      if (dependency.realpath === 'package.json') {
        continue
      }

      const requirementModulePath =
        getModuleContainer(modules, dependency.realpath)
      const containerModulePath = getModuleContainer(modules, name)
      if (!containerModulePath) {
        errors.push(`${name} doesn't live inside any valid module`)
        continue
      }

      if (!requirementModulePath) {
        errors.push(
          `${name} requires a file outside the set of valid modules: ${dependency.realpath}`)
        continue
      }

      const containerDirname = path.dirname(name)
      const requirementDirname = path.dirname(dependency.realpath)

      if (containerModulePath === requirementModulePath &&
          path.relative(containerDirname, requirementDirname).startsWith('..')) {
        errors.push(
          `${name} violates encapsulation by requiring ${dependency.realpath}`)
      }

      if (containerModulePath !== requirementModulePath &&
          !isModuleEntryPoint(requirementModulePath, dependency.realpath)) {
        errors.push(
          `${name} requires a non-entry-point file of another module: ${dependency.realpath}`)
      }
    }
  }

  return errors
}

const DIRECTORY = process.cwd()
const packageJSON = JSON.parse(
  fs.readFileSync(path.join(DIRECTORY, 'package.json'), {
    encoding: 'utf8'
  }))

if (!packageJSON.deplint) {
  console.error('No deplint property in package.json')
  process.exit(1)
}

hawthorn(packageJSON.deplint.files, {
  directory: DIRECTORY,
  log: false,
  types: [ 'local' ]
}).then((output) => {
  return lint(output.files, packageJSON.deplint.modules)
}).then((result) => {
  if (result.length === 0) {
    console.log(chalk.green('\u2713'), 'Looking great!')
    process.exit(0)
  }

  console.error(`Found ${result.length} violations:`)

  for (const line of result) {
    console.error(chalk.red('\u2718'), line)
  }

  process.exit(1)
}).catch((error) => {
  if (error.name === 'ParseError') {
    console.error(`Could not parse ${error.file}: ${error.message}`)
  } else {
    console.error(error.message)
    console.error(error.stack)
  }

  process.exit(1)
})
