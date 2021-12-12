const Web3 = require('web3');
const Web3Quorum = require("web3js-quorum");
const contractFile = require('./compile');
const fs = require("fs");

// Create a web3 connection to a running geth node
// over JSON-RPC running at http://localhost:8545.
const web3 = new Web3Quorum(new Web3('http://127.0.0.1:8545'));
console.log("Web3:", web3);

// The address of the contract.
const contractAddress = fs.readFileSync('token.txt', 'utf8')
console.log("Contract Address:", contractAddress);

// Reading the ABI from the .abi file.
const abi = contractFile.abi;
console.log("Contract ABI:", abi);

// Initializing a Contract object.
const contract = new web3.eth.Contract(abi, contractAddress)
console.log("Contract:", contract);
console.log("Methods:", contract.methods);

const run = async () => {
	// Loading all the Accounts from the Geth node.
	// Alternatively, the address can be hardcoded.
	const accounts = await web3.eth.getAccounts()
	console.log("Accounts:", accounts)

	// Fetching the gas price:
	const price = await web3.eth.getGasPrice()
	console.log('Gas Price:', price);

	// Estimating the market gas price.
	const gas = await contract.methods.getKiller().estimateGas({
		from: accounts[0],
		gasPrice: web3.utils.numberToHex(price),
		value: 0,
	})
	console.log('Estimated Gas:', gas);

	// Getting the current killer.
	const killer = await contract.methods.getKiller()
		.call({
			from: accounts[0],
			gasPrice: price,
			gas: gas,
		})
	console.log("Current Killer:", killer)

	// Fetching the account balance.
	const accountBalance = await web3.eth.getBalance(contractAddress)
	console.log("Contract Balance:", accountBalance)

	// Fetching the account balance.
	accounts.map(async (account, index) => {

		// Getting the current killer.
		const kills = await contract.methods.getKills(account)
			.call({
				from: accounts[0],
				gasPrice: '1000',
				gas: 2310334,
			})

		// Getting account balance.
		const accountBalance = await web3.eth.getBalance(account)
		console.log("Balance:", index, account, "Kills:", kills, "Balance:", accountBalance)

	})
}

run()
