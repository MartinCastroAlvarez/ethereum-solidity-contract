const Web3 = require('web3');
const contractFile = require('./compile');
const fs = require("fs");

// Create a web3 connection to a running geth node
// over JSON-RPC running at http://localhost:8545.
const web3 = new Web3('http://127.0.0.1:8545');
console.log("Web3:", web3);

// Reading the ABI from the .abi file.
const abi = contractFile.abi;
console.log("Contract ABI:", abi);

// Reading the bytecode from the .bin file.
const bin = contractFile.evm.bytecode.object;
console.log("Byte Code:", bin);

// Initializing a Contract object.
const contract = new web3.eth.Contract(abi)
console.log("Contract:", contract);

// Loading all the Accounts from the Geth node.
// Alternatively, the address can be hardcoded.
web3.eth.getAccounts()
	.then(accounts => {
		console.log("Accounts:", accounts)

		// Deploying the Contract.
		contract.deploy({
			data: "0x" + bin,
			arguments: {
			}
		})
		.send({
			from: accounts[0],
			gas: 42949295,
		})
		.then(receipt => {
			console.log("Deployment:", receipt);
			console.log("Contract Address:", receipt._address);
			fs.writeFile('token.txt', receipt._address, error => {
				console.error("Error:", error)
			});
		})
		.catch(error => {
			console.error("Error:", error)
		});

	})
	.catch(error => {
		console.error("Error:", error)
	})
