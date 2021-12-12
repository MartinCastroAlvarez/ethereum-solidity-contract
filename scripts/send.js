const Web3 = require('web3');
const Web3Quorum = require("web3js-quorum");

// Create a web3 connection to a running geth node
// over JSON-RPC running at http://localhost:8545.
const web3 = new Web3Quorum(new Web3('http://127.0.0.1:8545'));
console.log("Web3:", web3);

// Loading all the Accounts from the Geth node.
// Alternatively, the address can be hardcoded.
web3.eth.getAccounts()
	.then(accounts => {
		console.log("Accounts:", accounts)

		// Defining the sender of the transaction.
		const sender = accounts[0];
		console.log('Sender:', sender)

		// Defining the received of the transaction.
		const receiver = accounts[1];
		console.log('Receiver:', receiver)

		// Transfering funds.
		web3.eth.sendTransaction({
			to: receiver,
			from: sender,
			value: 1000000,
		})
		.then(result => {
			console.log('Transfer:', result);
		})
		.catch(error => {
			console.error('Error:', error);
		})

	})
	.catch(error => {
		console.error("Error:", error)
	})
