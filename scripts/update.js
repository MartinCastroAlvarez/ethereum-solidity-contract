const Web3 = require('web3');
const Web3Quorum = require("web3js-quorum");
const contractFile = require('./compile');
const fs = require("fs");

// Create a web3 connection to a running geth node
// over JSON-RPC running at http://localhost:8545.
const web3 = new Web3Quorum(new Web3('http://127.0.0.1:8545'));
console.log("Web3:", web3);

// Reading the ABI from the .abi file.
const abi = contractFile.abi;
console.log("Contract ABI:", abi);

// The address of the contract.
const contractAddress = fs.readFileSync('token.txt', 'utf8')
console.log("Contract Address:", contractAddress);

// Loading the Contract.
const contract = new web3.eth.Contract(abi, contractAddress);
console.log("Contract:", contract);
console.log("Methods:", contract.methods);

const run = async () => {
	// Loading all the Accounts from the Geth node.
	// Alternatively, the address can be hardcoded.
	const accounts = await web3.eth.getAccounts()
	console.log("Accounts:", accounts)

	// Fetching the gas price:
	const killerPrice = await web3.eth.getGasPrice()
	console.log('Gas Price:', killerPrice);

	// Estimating the market gas price.
	const killerGas = await contract.methods.getKiller().estimateGas({
		from: accounts[0],
		gasPrice: web3.utils.numberToHex(killerPrice),
		value: 0,
	})
	console.log('Estimated Gas:', killerGas);

	// Getting the current killer.
	const sender = await contract.methods.getKiller()
		.call({
			from: accounts[0],
			gasPrice: killerPrice,
			gas: killerGas,
		})
	console.log("Current Killer:", sender)

	// Defining the new killer.
	const killer = accounts[Math.floor(Math.random() * 2)];
	console.log('New Killer:', killer)

	// Defining the Ether transferred.
	const ether = 1000;
	console.log('Ether:', ether)

	// Fetching the gas price:
	const paymentPrice = await web3.eth.getGasPrice()
	console.log('Gas Price:', paymentPrice);

	// Estimating the market gas price.
	const paymentGas = await contract.methods.payKiller(ether).estimateGas({
		from: sender,
		gasPrice: web3.utils.numberToHex(paymentPrice),
		value: ether,
	})
	console.log('Estimated Gas:', paymentGas);

	// Submitting transaction.
	const payment = await contract.methods.payKiller(ether).send({
		from: sender,
		gasPrice: web3.utils.toHex(paymentPrice),
		gas: web3.utils.toHex(paymentGas),
		value: web3.utils.toHex(ether),
	})
	console.log('Payment:', paymentGas);

	// Fetching the gas price:
	const setterPrice = await web3.eth.getGasPrice()
	console.log('Gas Price:', setterPrice);

	// Updating the state of the function.
	const setterGas = await contract.methods.setKiller(killer).estimateGas({
		from: sender,
		gasPrice: web3.utils.numberToHex(setterPrice),
	})
	console.log('Estimated Gas:', setterGas);

	// Submitting transaction.
	const setter = await contract.methods.setKiller(killer).send({
		from: sender,
		gasPrice: web3.utils.toHex(setterPrice),
		gas: web3.utils.toHex(setterGas),
	})
	console.log('Setter:', setter);
}

run()
