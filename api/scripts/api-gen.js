#!/usr/bin/env node

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.help('h')
	.options({
		specPath: {
			alias: 's',
			decription: 'Path to the spec file',
			demandOption: true,
			type: 'string'
		},
		outFile: {
			alias: 'o',
			decription: 'File where generated models are put',
			demandOption: true,
			type: 'string'
		}
	})
	.argv;

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');

const spec = yaml.safeLoad(fs.readFileSync(argv.specPath))

const outStream = fs.createWriteStream(argv.outFile, {
	flags: 'w+'
})
const out = (...strings) => {
	_.each(strings, (s) => outStream.write(s))
}

const indent = '    ';
const newline = '\n';

let previousEnums = [];

function mapSwaggerType(t) {
	return {
		integer: 'number'
	}[t] || t;
}

out('// WARNING, THIS IS GENERATED FILE, DO NOT CHANGE')
out(newline, newline)

_.each(spec.definitions, (def, defName) => {
	def.name = defName;

	if (def.type === 'object') {
		writeObjectDef(def)
	} else if (def.enum && def['x-ts-enum']) {
		writeEnum(def)
	} else {
		writeTypeDef(def)
	}
})

function writeTypeDef(def, name, type) {
	out(`export type ${def.name} = ${generatePropertyType(def)};`)
	out(newline, newline)
}

function writeObjectDef(def) {
	let toWrite = '';
	toWrite += `export interface ${def.name} {` + newline;
	_.each(def.properties, (prop, propName) => {
		const requiredChar = _.includes(def.required, propName) ? '' : '?';
		toWrite += indent + `${propName}${requiredChar}: ${generatePropertyType(prop)};` + newline
	})
	toWrite += '}' + newline + newline
	out(toWrite)
}

function generatePropertyType(propDef) {
	const refRegExp = /^#\/definitions\/(\w*)$/;

	if (propDef['x-ts-type']) {
		return propDef['x-ts-type'];
	} else if (propDef['x-ts-enum']) {
		writeEnum(propDef)
		return propDef['x-ts-enum'];
	} else if (propDef.type === 'array') {
		writeEnum(propDef.items)
		return generatePropertyType(propDef.items) + '[]'
	} else if (propDef.type) {
		return mapSwaggerType(propDef.type);
	} else if (propDef.$ref) {
		return propDef.$ref.match(refRegExp)[1];
	} else {
		throw new Error(`Failed to generate property type def ${JSON.stringify(propDef)}`);
	}
}

function writeEnum(prop) {
	const e = {
		name: prop['x-ts-enum'],
		values: prop.enum
	}

	if (!e.name || !e.values) {
		return;
	}

	const prevEnum = _.find(previousEnums, (pe) => pe.name === e.name)
	if (prevEnum) {
		if (_.isEqual(e.values, prevEnum.values)) {
			console.log(`Skipping previously defined enum with same values ${e.name}`)
			return;
		} else {
			throw new Error(`Encountered enum with same name: ${e.name}, but different values
			old values: ${JSON.stringify(prevEnum.values)}
			new values: ${JSON.stringify(e.values)}`)
		}
		
	}

	out(`export enum ${e.name} {`, newline);
	const valueLines = _.map(e.values, (v) => indent + `${v} = <any>'${v}'`);
	out(valueLines.join(',' + newline))
	out(newline + '}' + newline + newline)
	previousEnums.push(e)
}