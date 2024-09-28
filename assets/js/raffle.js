var currentAddr = null;
var web3;
var spend;
var usrBal;
var priceInUSD;

var lastUpdate = new Date().getTime()
var contractBalance;
var tokenContract;
var contract;
var started = true;

const lottoAddress = ''; //mainnet contract 

const tokenAddress = '0x55d398326f99059fF775485246999027B3197955';

const tokenAbi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCirculatingSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]

const lottoAbi = [ { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "drawWinner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "lotteryId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "winner", "type": "address" } ], "name": "LotteryClosed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "lotteryId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "NewLottery", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "numberOfTickets", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "cost", "type": "uint256" } ], "name": "PurchaseLog", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" } ], "name": "purchaseTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" } ], "name": "recoverAbandonedTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newExclusionPeriod", "type": "uint256" } ], "name": "setExclusionPeriod", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newDuration", "type": "uint256" } ], "name": "setLotteryDuration", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_growth", "type": "address" }, { "internalType": "address", "name": "_marketing", "type": "address" } ], "name": "setReceivers", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startNewLottery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "systemRecovery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "winTX", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "marketTX", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "growthTX", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "rollTX", "type": "uint256" } ], "name": "TaxesUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "TicketPurchased", "type": "event" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_winTX", "type": "uint256" }, { "internalType": "uint256", "name": "_marketTX", "type": "uint256" }, { "internalType": "uint256", "name": "_growthTX", "type": "uint256" }, { "internalType": "uint256", "name": "_rollTX", "type": "uint256" } ], "name": "updateTaxes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [], "name": "calculateRolloverPot", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "deadline", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "exclusionPeriod", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLotteryStatus", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMostRecentWinner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfParticipants", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getParticipants", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPrizePool", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "participant", "type": "address" } ], "name": "getTickets", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalTicketsSold", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "userAddress", "type": "address" } ], "name": "getUserData", "outputs": [ { "internalType": "uint256", "name": "ticketCount", "type": "uint256" }, { "internalType": "uint256", "name": "exclusionPeriodEnd", "type": "uint256" }, { "internalType": "uint256", "name": "lastParticipation", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ], "name": "getUserTickets", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getWinners", "outputs": [ { "components": [ { "internalType": "address", "name": "winnerAddress", "type": "address" }, { "internalType": "uint256", "name": "lotteryId", "type": "uint256" } ], "internalType": "struct Lottery.Winner[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "growth", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "growthTX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastWonLottery", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOTTERY_DURATION", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lotteryClosed", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lotteryId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "marketing", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "marketTX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "participants", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "prizePot", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rolloverPot", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rollTX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ticketPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "tickets", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "timeLeft", "outputs": [ { "internalType": "uint256", "name": "daysLeft", "type": "uint256" }, { "internalType": "uint256", "name": "hoursLeft", "type": "uint256" }, { "internalType": "uint256", "name": "minutesLeft", "type": "uint256" }, { "internalType": "uint256", "name": "secondsLeft", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "users", "outputs": [ { "internalType": "uint256", "name": "ticketCount", "type": "uint256" }, { "internalType": "uint256", "name": "exclusionPeriodEnd", "type": "uint256" }, { "internalType": "uint256", "name": "lastParticipation", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "winner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "winnerExclusionEnd", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "winners", "outputs": [ { "internalType": "address", "name": "winnerAddress", "type": "address" }, { "internalType": "uint256", "name": "lotteryId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "winTX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]




// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(lottoAbi, lottoAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);


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
        displayWinners();
        updateUI()

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
    updateUI()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    setTimeout(controlLoop, 5000)

}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0 };
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    console.log('Refreshing data...')
    if (!contract || !contract.methods) {
        console.log('contract is not yet loaded')
        loadContracts()
        displayWinners();
        updateLotteryStatus();

    }

    contract.methods.getLotteryStatus().call().then(status => {
        $("#lotteryStatus").html(`${status}`);
    }).catch((err) => {
        console.log('Error fetching lottery status', err);
    });



    contract.methods.lotteryId().call().then(id => {
        var lotto = Number(id).toFixed(0);
        $("#LOTTOID").html(`${lotto}`)

    }).catch((err) => {
        console.log('LOTTOID', err);
    });

    contract.methods.ticketPrice().call()
        .then(ticketPrice => {
            // Convert ticketPrice from wei to readable format with 2 decimal places
            var formattedPrice = readableBUSD(ticketPrice, 0);
            // Update the HTML content of the ticketPrice element
            $("#ticketPrice").html(`${formattedPrice} USDT`);
        })
        .catch(error => {
            console.error('Error fetching ticket price:', error);
        });


    contract.methods.getMostRecentWinner().call()
        .then(winner => {
            // Extract the first 2 and last 4 characters from the address
            const firstTwo = winner.slice(0, 4);
            const lastFour = winner.slice(-4);

            // Combine them with ellipsis in the middle
            const displayAddress = `${firstTwo}...${lastFour}`;

            // Update the HTML element with the shortened address
            $("#WINNER").html(displayAddress);
        })
        .catch(err => {
            console.log('Error fetching the winner:', err);
        });

    contract.methods.getTotalTicketsSold().call()
        .then(totalTickets => {
            // Convert result to a number and update the HTML element
            $("#TOTAL_TICKETS").html(Number(totalTickets).toFixed(0));
        })
        .catch(err => {
            console.log('Error fetching total tickets sold:', err);
        });

    contract.methods.getNumberOfParticipants().call()
        .then(numberOfParticipants => {
            // Convert result to a number and update the HTML element
            $("#PARTICIPANT_COUNT").html(Number(numberOfParticipants).toFixed(0));
        })
        .catch(err => {
            console.log('Error fetching number of participants:', err);
        });


    if (started) {

        contract.methods
            .getPrizePool()
            .call()
            .then((balance) => {
                contractBalance = balance;
                var amt = web3.utils.fromWei(balance);
                var formattedAmount = roundNum(amt) + " USDT"; // Add " USDT" to the formatted number
                $("#prize-pool").html(formattedAmount);
            })
            .catch((err) => {
                console.log(err);
            });


        contract.methods
            .calculateRolloverPot()
            .call()
            .then((balance) => {
                contractBalance = balance;
                var amt = web3.utils.fromWei(balance);
                var formattedAmount = roundNum(amt) + " USDT"; // Add " USDT" to the formatted number
                $("#rolloverEstimate").html(formattedAmount);
            })
            .catch((err) => {
                console.log(err);
            });

    }


    if (!currentAddr) {
        console.log('check if user is logged in');
        web3.eth.getAccounts(function (err, accounts) {
            if (err != null) {
                console.error("An error occurred: " + err);
            }
            else if (accounts.length == 0) {
                console.log("User is not logged in to MetaMask");
            }
            else {
                console.log("User is logged in to MetaMask");
                loginActions(accounts);
            }
        });
        return;
    } else {
        tokenContract.methods.balanceOf(currentAddr).call().then(userBalance => {
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


        tokenContract.methods.allowance(currentAddr, lottoAddress).call().then(result => {
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


        contract.methods.getUserData(currentAddr).call()
            .then(result => {
                // Extract results from the call
                var ticketCount = result[0];
                var exclusionPeriodEnd = result[1];
                var lastParticipation = result[2];

                // Format the data (e.g., converting timestamps to readable dates)
                var exclusionDate = new Date(exclusionPeriodEnd * 1000).toLocaleString(); // Convert to readable date
                var lastParticipationDate = new Date(lastParticipation * 1000).toLocaleString(); // Convert to readable date

                // Update the UI
                $("#userTickets").html(ticketCount);
                $("#user-exclusion-period-end").html(exclusionDate);
                $("#user-last-participation").html(lastParticipationDate);
            })
            .catch(err => {
                console.log('Error fetching user data:', err);
            });




    }

    console.log('Done refreshing data...')
}

var startTimeInterval;
function setStartTimer() {
    var endDate = new Date().getTime();

    clearInterval(startTimeInterval)
    startTimeInterval = setInterval(function () {
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

async function updateUI() {
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
                document.getElementById('timeLeft').textContent = 'Raffle Ended';

                // Automatically update the lottery status when the timer ends

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

    // Fetch lottery status initially when UI loads

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

        await tokenContract.methods.approve(lottoAddress, amountToApprove).send({ from: userAddress });

        document.getElementById('buy-eggs-btn').disabled = false;
        console.log("Approval successful");
        refreshData()
    } catch (error) {
        console.error("Approval failed:", error);
    }
}

async function buyTickets() {
    const spendDoc = document.getElementById("approve-spend");
    const amount = spendDoc.value;

    if (!amount || isNaN(amount)) {
        console.error("Invalid amount input");
        return;
    }

    const amountToSpend = web3.utils.toWei(amount.toString(), 'ether');

    try {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        await contract.methods.purchaseTicket(amountToSpend).send({ from: userAddress });

        console.log("Tickets purchased successfully");
        refreshData()
    } catch (error) {
        console.error("Ticket purchase failed:", error);
    }
}

async function pickWinner() {
    console.log("Pick Winner Button Clicked");
    try {
        // Estimate gas required for the transaction
        const gasEstimate = await contract.methods.drawWinner().estimateGas({ from: currentAddr });
        console.log(`Estimated gas: ${gasEstimate}`);

        // Send the transaction with the estimated gas
        const receipt = await contract.methods.drawWinner().send({ from: currentAddr, gas: 5000000 });

        console.log("Winner picked successfully", receipt);
        updateUI()
        refreshData()
        displayWinners()

    } catch (error) {
        console.error('Error picking winner:', error.message);
    }
}



async function startNew() {
    console.log("Start New Lottery Button Clicked");
    try {
        await contract.methods.startNewLottery().send({ from: currentAddr });
        console.log("New lottery started successfully");
        updateUI()
        refreshData()
        displayWinners()

    } catch (error) {
        console.error('Error starting new lottery:', error);
    }
}

// Function to get and display winners
async function displayWinners() {
    try {
        // Call the getWinners function from your contract
        const winners = await contract.methods.getWinners().call();
        
        // Log the winners array to see its structure
        console.log('Winners:', winners);

        // Clear the previous winners list
        $("#winnersList").empty();

        // Check if there are any winners
        if (winners.length === 0) {
            $("#winnersList").html("No winners yet.");
            return;
        }

        // Get the latest 10 winners (or all if less than 10)
        const latestWinners = winners.slice(-5).reverse();

        // Iterate through the latest winners
        latestWinners.forEach((winner, index) => {
            // Assuming each winner is an object with 'winnerAddress' and 'lotteryId' properties
            let formattedAddress;
            let lotteryId;
            
            if (winner && typeof winner === 'object') {
                formattedAddress = `${winner.winnerAddress.slice(0, 4)}...${winner.winnerAddress.slice(-4)}`;
                lotteryId = winner.lotteryId; // Adjust if your property name is different
            } else {
                console.error('Unexpected winner format:', winner);
                return;
            }

            // Create a new div for each winner
            const winnerDiv = $("<div>").addClass("winner-entry").html(`Raffle ID: ${lotteryId} - ${formattedAddress}`);
            $("#winnersList").append(winnerDiv);
        });
    } catch (error) {
        console.error('Error fetching winners:', error);
    }
}

















