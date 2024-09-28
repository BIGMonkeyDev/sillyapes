var currentAddr = null;
var web3;
var spend;
var usrBal;
var priceInUSD;

var lastUpdate = new Date().getTime()
var contractBalance;
var tokenContract;
var stableContract;
var contract;
var started = true;

const presaleAddress = '0x1F31C89254bb9760c7c6DD2cF1e860bF4242E988'; //mainnet contract 

const tokenAddress = '0xe6Bb1c8dE0539e95B8a725Ed3D10Ec90BC377EBF';

const stableAddress = '0xd6E6d49D07A07c8fb25F4D6C320c525A23D711BD';

const tokenAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCirculatingSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]

const presaleAbi = [ { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "buyTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" } ], "name": "recoverAbandonedTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "claimer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountClaimed", "type": "uint256" } ], "name": "TokensClaimed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountSpent", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensToReceive", "type": "uint256" } ], "name": "TokensPurchased", "type": "event" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "contributions", "outputs": [ { "internalType": "uint256", "name": "amountSpent", "type": "uint256" }, { "internalType": "uint256", "name": "tokensToReceive", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRemainingTokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTokensSold", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalRaised", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" } ], "name": "getUserContributions", "outputs": [ { "internalType": "uint256", "name": "amountSpent", "type": "uint256" }, { "internalType": "uint256", "name": "tokensToReceive", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "newToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "presaleDuration", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "presaleEndTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "presaleStartTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "stable", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "stablecoin", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "timeLeft", "outputs": [ { "internalType": "uint256", "name": "daysLeft", "type": "uint256" }, { "internalType": "uint256", "name": "hoursLeft", "type": "uint256" }, { "internalType": "uint256", "name": "minutesLeft", "type": "uint256" }, { "internalType": "uint256", "name": "secondsLeft", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokensForSale", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRaised", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]

// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(presaleAbi, presaleAddress);
	tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    stableContract = new web3.eth.Contract(tokenAbi, stableAddress);
    
    console.log('Done loading contracts.')
}




async function myConnect() {
    var element = document.getElementById("dotting");
    element.classList.toggle("dot");
}

async function connect() {
    console.log('Connecting to wallet...')
    try {
        
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect')
        } else if (accounts[0] !== currentAddr) {
            loginActions(accounts);
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
        $('#enableMetamask').attr('disabled', false)
    }
}

function loginActions(accounts) {
    currentAddr = accounts[0];
    if (currentAddr !== null) {
        
        console.log('Wallet connected = ' + currentAddr);

        loadContracts();
        refreshData();
        updatePresaleTimeLeft()



        let shortenedAccount = currentAddr.replace(currentAddr.substring(3, 39), "***");
        $('#enableMetamask').html(shortenedAccount);
    }
    $('#enableMetamask').attr('disabled', true);
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        $('#enableMetamask').attr('disabled', false)
        if (window.ethereum.selectedAddress !== null) {
            await connect();
                setTimeout(function () {
                controlLoop()
                controlLoopFaster()
            }, 1000)
        }
    } else {
        $('#enableMetamask').attr('disabled', true)
    }
}

window.addEventListener('load', function () {
    setStartTimer();
    loadWeb3()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    
    setTimeout(controlLoop, 25000)
    
}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0};
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    console.log('Refreshing data...')
    if(!contract || !contract.methods){
        console.log('contract is not yet loaded')
        loadContracts()
		
        
        // return;
    }
    

    

	contract.methods.tokenPrice().call()
    .then(ticketPrice => {
        // Convert ticketPrice from wei to readable format with 2 decimal places
        var formattedPrice = readableBUSD(ticketPrice, 0);
        // Update the HTML content of the ticketPrice element
        $("#ticketPrice").html(`${formattedPrice} USDT`);
    })
    .catch(error => {
        console.error('Error fetching ticket price:', error);
    });


	

  


  

  

    

    if (started) {
        
		contract.methods.getRemainingTokens().call()
    .then(remainingTokens => {
        // Convert the amount to a readable format if necessary
        const formattedAmount = web3.utils.fromWei(remainingTokens, 'ether'); // Assuming 18 decimals

        // Update the UI with the number of remaining tokens
        document.getElementById('remainingTokens').innerText = `${formattedAmount} Tokens`;
    })
    .catch(error => {
        console.error("Error fetching remaining tokens:", error);
    });

    contract.methods.getTotalRaised().call()
    .then(totalRaised => {
        // Convert the amount to a readable format if necessary (e.g., divide by 1e18 if using 18 decimals)
        const formattedAmount = web3.utils.fromWei(totalRaised, 'ether'); // Assuming USDT uses 18 decimals

        

        // Update the UI with the total raised amount
        document.getElementById('totalFundsRaised').innerText = `${formattedAmount} USDT`;
    })
    .catch(error => {
        console.error("Error fetching total raised:", error);
    });




    contract.methods.getTokensSold().call()
    .then(tokensSold => {
        // Convert the amount to a readable format if necessary
        const formattedAmount = web3.utils.fromWei(tokensSold, 'ether'); // Assuming 18 decimals

        // Update the UI with the number of tokens sold
        document.getElementById('tokensSold').innerText = `${formattedAmount} Tokens`;
    })
    .catch(error => {
        console.error("Error fetching tokens sold:", error);
    });

    



		

	  

    }

	
    if(!currentAddr) {
        console.log('check if user is logged in');
        web3.eth.getAccounts(function(err, accounts){
            if (err != null) {
                console.error("An error occurred: "+err);
        }
            else if (accounts.length == 0) {
                console.log("User is not logged in to MetaMask");
            }
            else {console.log("User is logged in to MetaMask");
            loginActions(accounts);}
        });
        return;
    } else {
        stableContract.methods.balanceOf(currentAddr).call().then(userBalance => {
			let amt = web3.utils.fromWei(userBalance);
			usrBal = userBalance;
			let formattedAmount = roundNum(amt) + " USDT"; // Append " USDT" to the formatted number
			$('#userBalance').html(formattedAmount);
			// calcNumTokens(roundNum(amt)).then(usdValue => {
			//     $('#user-balance-usd').html(roundNum(usdValue));
			// });
		}).catch((err) => {
			console.log('balanceOf', err);
		});
		

		stableContract.methods.allowance(currentAddr, presaleAddress).call().then(result => {
			let spend = web3.utils.fromWei(result);
			if (spend > 0 && started) {
				// Append " USDT" to the formatted number
				let formattedSpend = roundNum(spend) + " USDT";
				$('#approved').html(formattedSpend);
				// Uncomment below to calculate and display the USD value if needed
				// calcNumTokens(spend).then(usdValue => {
				//     $('#user-approved-spend-usd').html(usdValue);
				// });
				$("#buy-eggs-btn").attr('disabled', false);
				$("#busd-spend").attr('hidden', false);
				$("#busd-spend").attr('value', "100");
			}
		}).catch((err) => {
			console.log('allowance', err);
		});
		

		contract.methods.getUserContributions(currentAddr).call()
    .then(result => {
        // Convert amounts to readable formats
        const amountSpentFormatted = web3.utils.fromWei(result.amountSpent, 'ether'); // Assuming 18 decimals for USDT
        const tokensToReceiveFormatted = web3.utils.fromWei(result.tokensToReceive, 'ether'); // Assuming 18 decimals for the token

        // Update the UI with formatted values
        document.getElementById('userTokensToReceive').innerText = `${tokensToReceiveFormatted} Tokens`;
        document.getElementById('userAmountSpent').innerText = `${amountSpentFormatted} USDT`; // Assuming USDT
        document.getElementById('tokensToClaim').innerText = `${tokensToReceiveFormatted} Tokens`;
    })
    .catch(error => {
        console.error("Error fetching user contributions:", error);
    });


    



        
      
    

    }
    
    console.log('Done refreshing data...')
}












var startTimeInterval;
function setStartTimer() {
    var endDate = new Date().getTime();

    clearInterval(startTimeInterval)
    startTimeInterval = setInterval(function() {
        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	if (days < 10) { days = '0' + days; }
        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#start-timer").html(`${days}d:${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(startTimeInterval);
            $("#start-container").remove();
            
            started = true;
            refreshData()
        }
    }, 1000, 1);
}


// Utility function to convert amount from wei to a readable format
function readableBUSD(amount, decimals = 18) {
    return (amount / 1e18).toFixed(decimals);
}


async function approveToken() {
    const spendDoc = document.getElementById("approve-spend");
    const amount = spendDoc.value;

    if (!amount || isNaN(amount)) {
        console.error("Invalid amount input");
        return;
    }

    const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');

    try {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        await stableContract.methods.approve(presaleAddress, amountToApprove).send({ from: userAddress });
         
        
        console.log("Approval successful");
		refreshData()
    } catch (error) {
        console.error("Approval failed:", error);
    }
}

async function buyToken() {
    try {
        const amountInput = document.getElementById('approve-spend');
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid token amount');
        }
        
        
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        const allowance = await stableContract.methods.allowance(currentAddr, presaleAddress);

        if (parseFloat(allowance) < amount) {
            throw new Error('Insufficient allowance');
        }

        await contract.methods.buyTokens(amountInWei).send({ from: currentAddr });
        alert("Tokens purchased successfully!");
        console.log('Tokens purchased successfully');
        refreshData()
    } catch (error) {
        console.error('Error buying tokens:', error.message);
    }
}






async function claimTokens() {
    try {
        // Get the current user's address
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Call the claimTokens function from the smart contract
        await contract.methods.claimTokens().send({ from: userAddress });

        // Optionally, update the UI after claiming tokens
        alert("Tokens claimed successfully!");

        refreshData() 

    } catch (error) {
        console.error("Error claiming tokens:", error);
        alert("You had to participate in the presale to get tokens !");
    }
}

async function updatePresaleTimeLeft() {
    try {
        // Fetch the initial time left
        const timeResult = await contract.methods.timeLeft().call();
        let daysLeft, hoursLeft, minutesLeft, secondsLeft;

        if (Array.isArray(timeResult) && timeResult.length === 4) {
            [daysLeft, hoursLeft, minutesLeft, secondsLeft] = timeResult;
        } else if (timeResult.daysLeft !== undefined && timeResult.hoursLeft !== undefined && timeResult.minutesLeft !== undefined && timeResult.secondsLeft !== undefined) {
            daysLeft = timeResult.daysLeft;
            hoursLeft = timeResult.hoursLeft;
            minutesLeft = timeResult.minutesLeft;
            secondsLeft = timeResult.secondsLeft;
        } else {
            console.error('Unexpected time left format:', timeResult);
            document.getElementById('timeLeft').textContent = 'Error fetching time left';
            return;
        }

        // Update the time left UI every second
        const intervalId = setInterval(() => {
            if (secondsLeft > 0) {
                secondsLeft--;
            } else if (minutesLeft > 0) {
                secondsLeft = 59;
                minutesLeft--;
            } else if (hoursLeft > 0) {
                secondsLeft = 59;
                minutesLeft = 59;
                hoursLeft--;
            } else if (daysLeft > 0) {
                secondsLeft = 59;
                minutesLeft = 59;
                hoursLeft = 23;
                daysLeft--;
            } else {
                clearInterval(intervalId); // Stop when the countdown reaches 0
                document.getElementById('timeLeft').textContent = 'Claim Your Tokens !';

                // Automatically handle what happens when presale ends
                return;
            }

            // Format the time as a string
            const timeString = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

            // Update the HTML element with the formatted time
            document.getElementById('timeLeft').textContent = timeString;
        }, 1000); // Update every second

    } catch (err) {
        console.error('Error updating time left:', err);
        document.getElementById('timeLeft').textContent = 'Error fetching time left';
    }

    
}








  
  
  
  
