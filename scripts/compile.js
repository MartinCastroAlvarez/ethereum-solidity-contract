const solc = require('solc');
const fs = require("fs");

// Loading the source code from the `.sol` file.
const sourceCode = fs.readFileSync('../contracts/nisman.sol', 'utf-8');
console.log("Source Code:", sourceCode);

// Compiling the contract.
const input = {
	language: 'Solidity',
	sources: {
		'Nisman.sol': {
			content: sourceCode,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
if (tempFile.errors) {
	throw Error(JSON.stringify(tempFile.errors));
}
const contractFile = tempFile.contracts['Nisman.sol']['Nisman'];
console.log('Contract File:', contractFile)

// Reading the ABI from the .abi file.
const abi = contractFile.abi;
console.log("Contract ABI:", abi);

module.exports = contractFile;
