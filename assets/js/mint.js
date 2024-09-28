var currentAddr = null;
var web3;
var spend;
var usrBal;
var priceInUSD;

var lastUpdate = new Date().getTime()



var contract;
var started = true;

 

const tokenAddress = '0x993deA00A71210730eeF6664b47Fe0EC57E9Ee80';
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";


const tokenAbi = [ { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "routerAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "name": "addRewardToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "approveMax", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "amountGas", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountBOG", "type": "uint256" } ], "name": "AutoLiquify", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethForBurn", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethForGrowth", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "referralTax", "type": "uint256" } ], "name": "BuyFromMint", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "ref", "type": "address" } ], "name": "buyfromMintWithReferral", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newReferrer", "type": "address" } ], "name": "changeReferrer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initializePrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256" } ], "name": "LpBalanceUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "removeRewardToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_minPeriod", "type": "uint256" }, { "internalType": "uint256", "name": "_minDistribution", "type": "uint256" } ], "name": "setDistributionCriteria", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "gas", "type": "uint256" } ], "name": "setDistributorSettings", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_autoLiquidityReceiver", "type": "address" }, { "internalType": "address", "name": "_marketingReceiver", "type": "address" }, { "internalType": "address", "name": "_growthReceiver", "type": "address" }, { "internalType": "address", "name": "_bonusReceiver", "type": "address" }, { "internalType": "address", "name": "_morgueReceiver", "type": "address" } ], "name": "setFeeReceivers", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_buyFee", "type": "uint256" }, { "internalType": "uint256", "name": "_buyBurnFee", "type": "uint256" } ], "name": "setFeesForBuy", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_sellFee", "type": "uint256" }, { "internalType": "uint256", "name": "_sellBurnFee", "type": "uint256" } ], "name": "setFeesForSell", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsBuyFeeExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsDividendExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsSellFeeExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsTxLimitExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_value", "type": "uint256" } ], "name": "setPriceIncrement", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_value", "type": "uint256" } ], "name": "setPriceIncrementStep", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_liquidityFee", "type": "uint256" }, { "internalType": "uint256", "name": "_marketingFee", "type": "uint256" }, { "internalType": "uint256", "name": "_reflectionFee", "type": "uint256" }, { "internalType": "uint256", "name": "_growthFee", "type": "uint256" }, { "internalType": "uint256", "name": "_distroFee", "type": "uint256" } ], "name": "setSwapBackMetrics", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bool", "name": "_enabled", "type": "bool" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "setSwapBackSettings", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_target", "type": "uint256" }, { "internalType": "uint256", "name": "_denominator", "type": "uint256" } ], "name": "setTargetLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "setTxLimit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "systemRecovery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" } ], "name": "ZeusProtocol", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "currentPriceInUSD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "distributorAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "distributorGas", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeDenominator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCirculatingSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "token", "type": "address" } ], "name": "getCurrentPriceInUSD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCurrentTokenPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getETHPriceInUSD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "accuracy", "type": "uint256" } ], "name": "getLiquidityBacking", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "getLpTokenBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getRewardTokenInfo", "outputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTokenPriceInUSD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalEthSpent", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "userAddress", "type": "address" } ], "name": "getUserInfo", "outputs": [ { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "referrals", "type": "uint256" }, { "internalType": "uint256", "name": "referralReward", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialPriceInUSD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" } ], "name": "isExemptFromDividends", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "target", "type": "uint256" }, { "internalType": "uint256", "name": "accuracy", "type": "uint256" } ], "name": "isOverLiquified", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lpdistributor", "outputs": [ { "internalType": "contract LPDistributor", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lpdistributorGas", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lpToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "pair", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "priceIncreasePercent", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "priceIncrementStep", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "priceSet", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "router", "outputs": [ { "internalType": "contract IDEXRouter", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "swapEnabled", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "swapThreshold", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "targetLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "targetLiquidityDenominator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalBuyFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthSpent", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRefBonus", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSellFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSwapMetric", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokensMinted", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "users", "outputs": [ { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "referrals", "type": "uint256" }, { "internalType": "uint256", "name": "referralReward", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]


// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    
	contract = new web3.eth.Contract(tokenAbi, tokenAddress);
    
    console.log('Done loading contracts.')
}

// Function to fetch the current user's address
function fetchAndStoreUserAddress() {
    // Assuming you have a way to get the user's address, like using Web3 or another library
    // Example with Web3:
    return new Promise((resolve, reject) => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    resolve(accounts[0]);
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            reject(new Error('No Ethereum provider found'));
        }
    });
}

function myReferralLink() {
    fetchAndStoreUserAddress().then(address => {
        var prldoc = document.getElementById('reflink');
        // Get the current page URL without existing query parameters
        var currentPageURL = window.location.href.split('?')[0];
        // Update the referral link content
        var referralLink = currentPageURL + "?ref=" + address;
        prldoc.textContent = referralLink;
        // Assuming you have an input field with the id "reflink" to copy the generated link
        var copyText = document.getElementById("reflink");
        copyText.value = referralLink;
    }).catch(error => {
        console.error('Error fetching user address:', error);
    });
}

function copyRef() {
	var $temp = $("<input>")
	$("body").append($temp)
	$temp.val($("#reflink").text()).select()
	document.execCommand("copy")
	$temp.remove()
	$("#copied")
		.html("<i class='ri-checkbox-circle-line'> copied!</i>")
		.fadeOut("10000ms")
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1)
	var vars = query.split("&")
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=")
		if (pair[0] == variable) {
			return pair[1]
		}
	}
	return false
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
        myReferralLink(currentAddr);
        console.log('Wallet connected = ' + currentAddr);
        

        loadContracts();
        refreshData();

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
    setTimeout(controlLoop, 10000)
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
		updateFarmTokenPrice();
        updateCurrentTokenPrice();
        updateTotalTokensMinted();
        updateButtonWithEstimate();
        // return;
    }
    
    contract.methods.getCirculatingSupply().call().then(busd => {
        supply = busd;
        $("#circulating").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('circulating', err);
    });
    

	contract.methods.balanceOf(DEAD_ADDRESS).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#burned').html(roundNum1(amt))
        
    }).catch((err) => {
        console.log('balanceOf', err)
    });

    contract.methods.balanceOf(tokenAddress).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#contract').html(roundNum1(amt))
        
    }).catch((err) => {
        console.log('balanceOf', err)
    });

    contract.methods.totalSupply().call().then(busd => {
        supply = busd;
        $("#supply").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('supply', err);
    });

    contract.methods.balanceOf(currentAddr).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#userBalance').html(roundNum1(amt))
        // calcNumTokens(roundNum(amt)).then(usdValue => {
        //     $('#user-balance-usd').html(roundNum(usdValue))
        // })
    }).catch((err) => {
        console.log('balanceOf', err)
    });

    web3.eth
.getBalance(currentAddr)
.then((userBalance) => {
  usrBal = userBalance
  var amt = web3.utils.fromWei(userBalance)
  $("#balance").html(roundNum1(amt))
  //var usd = Number(priceInUSD*amt).toFixed(2);
  //$("#user-balance-usd").html(usd)
})
.catch((err) => {
  console.log(err)
});


    contract.methods.getTokenPriceInUSD().call()
    .then(priceInUSD => {
        const formattedPrice = readableBUSD(priceInUSD, 7); // Format the price with 2 decimal places
        $("#price").html(`$${formattedPrice}`); // Update the HTML element with the formatted price
    })
    .catch(err => {
        console.log('Error fetching farm token price:', err);
    });

    contract.methods.getCurrentTokenPrice().call()
    .then(currentTokenPrice => {
        const formattedPrice = readableBUSD(currentTokenPrice, 7); // Format with 7 decimal places
        $("#mintPrice").html(`$${formattedPrice}`); // Update the HTML element with the formatted price
    })
    .catch(err => {
        console.log('Error fetching current token price:', err);
    });


    contract.methods.totalTokensMinted().call()
    .then(totalTokens => {
        const formattedTokens = readableBUSD(totalTokens, 2); // Assuming 18 decimals
        $("#minted").html(formattedTokens); // Update the HTML element with the formatted total tokens
    })
    .catch(err => {
        console.log('Error fetching totalTokensMinted:', err);
    });

    contract.methods.getUserInfo(currentAddr).call().then(user => {
            var referralReward = user.referralReward; 
            var referrals = user.referrals;
            var refuser = user.referrer;
            setReferralReward(referralReward);
            setReferrals(referrals);
            setRef(refuser);
        }).catch((err) => {
            console.log('getUserInfo', err);
        });




function roundNum1(num) {
    return parseFloat(num).toFixed(2); // Adjust the precision as needed
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
            loginActions(accounts);
        
        }
      
        });
        return;

    }
    
    console.log('Done refreshing data...')
}


function setReferralReward(referralReward) {
    var totalBUSD = readableBUSD(referralReward, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#referral-Reward").html(totalBUSD);
    // $("#total-withdrawn-usd").html(totalUSD);
}

function setReferrals(referrals) {
    // Define the new format for presenting the number
    var formattedReferrals = formatReferralNumber(referrals);

    // Update the referral count in the UI
    $("#ref-count").html(formattedReferrals);
}


function formatReferralNumber(value) {
    return parseFloat(value).toFixed(0);
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





async function updateButtonWithEstimate() {
    try {
        // Get the ETH amount from the input field
        const ethAmount = parseFloat(document.getElementById('eth-amount').value);

        // Check if the ETH amount is valid
        if (isNaN(ethAmount) || ethAmount <= 0) {
            // Set button text to default if invalid amount
            const buttonElement = document.getElementById('buy-tokens-button');
            if (buttonElement) {
                buttonElement.textContent = 'Purchase Tokens';
            }
            return;
        }

        // Fetch token price in USD and ETH price in USD
        const [tokenPriceInUSD, ethPriceInUSD] = await Promise.all([
            contract.methods.getCurrentTokenPrice().call(),
            contract.methods.getETHPriceInUSD().call()
        ]);

        // Convert ETH price in USD to a floating-point number
        const ethPriceInUSDValue = parseFloat(ethPriceInUSD) / 1e18;

        // Calculate amount in USD
        const amountInUSD = ethAmount * ethPriceInUSDValue;

        // Convert token price in USD to a floating-point number
        const tokenPriceInUSDValue = parseFloat(tokenPriceInUSD) / 1e18;

        // Calculate estimated number of tokens
        const tokenAmount = amountInUSD / tokenPriceInUSDValue;

        // Format the estimated token amount (e.g., rounding to 2 decimal places)
        const formattedTokenAmount = readableBUSD1(tokenAmount);

        // Update the button text with the estimate
        const buttonElement = document.getElementById('buy-tokens-button');
        if (buttonElement) {
            buttonElement.textContent = `Mint ${formattedTokenAmount} Tokens`;
        }

        refreshData()

    } catch (error) {
        console.error('Error updating button with estimate:', error);
    }
}

// Function to format the token amount in a readable format
function readableBUSD1(amount, decimals = 2) {
    if (!amount) return '0.00';
    const formattedAmount = parseFloat(amount).toFixed(decimals);
    return formattedAmount;
}

// Add event listener to update the button with the estimate when the ETH amount changes
document.getElementById('eth-amount').addEventListener('input', updateButtonWithEstimate);

async function updateTotalEthSpent() {
    try {
        // Call the smart contract function to get the total ETH spent
        const totalEthSpent = await contract.methods.getTotalEthSpent().call();

        // Convert the result from Wei to Ether (assuming totalEthSpent is in Wei)
        const totalEthSpentInEth = web3.utils.fromWei(totalEthSpent, 'ether');

        // Update the UI element with the total ETH spent
        const totalEthSpentElement = document.getElementById('total-eth-spent');
        if (totalEthSpentElement) {
            totalEthSpentElement.textContent = ` ${totalEthSpentInEth}`;
        }

        refreshData()

    } catch (error) {
        console.error('Error fetching total ETH spent:', error);
    }
}

// Call the update function periodically to keep the UI updated
setInterval(updateTotalEthSpent, 10000); // Update every 10 seconds

function approveRef(newReferrer) {
    var newReferrer = document.getElementById("new-referrer-address").value.trim();

    if (newReferrer === "") {
        alert("Please enter a valid wallet address");
        return;
    }

    // Assuming you have a Web3 instance and contract methods set up
    contract.methods.changeReferrer(newReferrer).send({ from: currentAddr }).then(result => {
        refreshData()
    }).catch((err) => {
    console.log(err)
    });
    setTimeout(function(){
            
    },10000);
    
    console.log('Settle Down Ape...')
    
}

function setRef(refuser) {
    var referrerElement = document.getElementById('referrer-address');
    
    if (referrerElement) {
        // Ensure refuser is at least 9 characters long to avoid errors
        if (refuser.length > 9) {
            // Extract the first 5 and last 4 characters
            var firstPart = refuser.substring(0, 5);
            var lastPart = refuser.slice(-4);

            // Construct the displayed address
            referrerElement.textContent = `${firstPart}...${lastPart}`;
        } else {
            // If the address is too short, display it as is
            referrerElement.textContent = refuser;
        }
    } else {
        console.error('Referrer element not found');
    }

    // Optional: You can also log it to the console or perform other actions
    console.log('Referrer Address Set:', refuser);
}



async function buyTokens() {
    try {
        // Get the ETH amount from the input field
        const ethAmount = parseFloat(document.getElementById('eth-amount').value);

        // Check if the ETH amount is valid
        if (isNaN(ethAmount) || ethAmount <= 0) {
            alert('Please enter a valid ETH amount.');
            return;
        }

        // Get the referral address from the URL or the input field (or set to zero address if neither is provided)
        let referralAddress = getQueryVariable('ref'); // Try getting referral address from the URL
        
        if (!web3.utils.isAddress(referralAddress)) {
            referralAddress = document.getElementById('referrer-address').value; // Fallback to input field value
            
            // If the input field doesn't provide a valid address, default to zero address
            if (!web3.utils.isAddress(referralAddress)) {
                referralAddress = "0x0000000000000000000000000000000000000000"; // Default to zero address
            }
        }

        // Check if the user has connected their wallet
        if (!window.ethereum) {
            alert('Please install MetaMask or another Ethereum wallet.');
            return;
        }

        // Get the current user's account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAccount = accounts[0];

        // Convert the ETH amount to Wei
        const ethAmountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');

        // Call the buyfromMintWithReferral function on the smart contract
        await contract.methods.buyfromMintWithReferral(referralAddress).send({
            from: userAccount,
            value: ethAmountInWei
        });

        // Optionally refresh data or update UI after a successful purchase
        refreshData();

        alert('Token purchase successful!');
    } catch (error) {
        console.error('Error buying tokens with referral:', error);
        alert('Token purchase failed. Check the console for details.');
    }
}

// Helper function to get query variables from the URL
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false; // Return false if the query parameter is not found
}

// Add event listener to the "Buy Tokens" button
document.getElementById('buy-tokens-button').addEventListener('click', buyTokens);























  
  
  
  
