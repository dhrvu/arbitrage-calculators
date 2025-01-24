document.getElementById('calculatorSelect').addEventListener('change', function(e) {
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active-section');
    });
    if(e.target.value) {
        document.getElementById(e.target.value).classList.add('active-section');
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function formatCurrency(amount) {
    return '$' + Math.abs(parseFloat(amount)).toFixed(2);
}

// Arbitrage Calculator
let arbFields = 1;

function addArbField() {
    const container = document.getElementById('arb-odds-container');
    const newField = document.createElement('div');
    newField.className = 'dynamic-field';
    newField.innerHTML = `
        <input type="number" placeholder="Odds" class="arb-odds">
        <button type="button" onclick="removeArbField(this)" class="remove-field">×</button>
    `;
    container.appendChild(newField);
    arbFields++;
}

function removeArbField(button) {
    if(arbFields > 1) {
        button.parentElement.remove();
        arbFields--;
    }
}

function calculateArbitrage() {
    clearErrors();
    const stake = parseFloat(document.getElementById('arb-stake').value);
    const odds = Array.from(document.getElementsByClassName('arb-odds'))
                    .map(input => parseFloat(input.value))
                    .filter(odd => !isNaN(odd));

    let isValid = true;
    
    if(!stake || stake <= 0) {
        showError('arb-stake-error', 'Please enter a valid stake amount');
        isValid = false;
    }
    
    if(odds.length < 2) {
        showError('arb-stake-error', 'Minimum 2 odds required');
        isValid = false;
    }
    
    if(odds.some(odd => odd <= 1)) {
        showError('arb-stake-error', 'All odds must be greater than 1');
        isValid = false;
    }

    if(!isValid) return;

    const total = odds.reduce((acc, odd) => acc + (1 / odd), 0);
    const profit = stake / total;
    const stakes = odds.map(odd => profit / odd);
    const netProfit = profit - stake;

    const profitElement = document.getElementById('arb-profit');
    profitElement.textContent = formatCurrency(netProfit);
    profitElement.className = netProfit >= 0 ? 'positive' : 'negative';
    profitElement.innerHTML = (netProfit >= 0 ? 'Profit: ' : 'Loss: ') + profitElement.textContent;

    document.getElementById('arb-stakes').innerHTML = stakes
        .map((stake, index) => `
            <div class="result-item">
                <span>Stake ${index + 1}:</span>
                <span class="result-value">${formatCurrency(stake)}</span>
            </div>
        `).join('');
}

// Kelly Criterion Calculator
function calculateKelly() {
    clearErrors();
    const bankroll = parseFloat(document.getElementById('kelly-bankroll').value);
    const odds = parseFloat(document.getElementById('kelly-odds').value);
    const prob = parseFloat(document.getElementById('kelly-prob').value) / 100;

    let isValid = true;
    
    if(!bankroll || bankroll <= 0) {
        showError('kelly-bankroll-error', 'Invalid bankroll amount');
        isValid = false;
    }
    
    if(!odds || odds < 1) {
        showError('kelly-odds-error', 'Invalid odds');
        isValid = false;
    }
    
    if(!prob || prob <= 0 || prob >= 1) {
        showError('kelly-prob-error', 'Probability must be between 1-99%');
        isValid = false;
    }

    if(!isValid) return;

    const b = odds - 1;
    const q = 1 - prob;
    const stake = ((b * prob) - q) / b * bankroll;

    document.getElementById('kelly-stake').textContent = formatCurrency(stake);
}

// Hedging Calculator
function calculateHedging() {
    clearErrors();
    const initialStake = parseFloat(document.getElementById('hedge-initial-stake').value);
    const initialOdds = parseFloat(document.getElementById('hedge-initial-odds').value);
    const currentOdds = parseFloat(document.getElementById('hedge-current-odds').value);

    let isValid = true;
    
    if(!initialStake || initialStake <= 0) {
        showError('hedge-initial-error', 'Invalid initial stake');
        isValid = false;
    }
    
    if(!initialOdds || initialOdds < 1) {
        showError('hedge-initial-odds-error', 'Invalid initial odds');
        isValid = false;
    }
    
    if(!currentOdds || currentOdds < 1) {
        showError('hedge-current-odds-error', 'Invalid current odds');
        isValid = false;
    }

    if(!isValid) return;

    const hedgeStake = (initialStake * initialOdds) / currentOdds;
    const profit = (initialStake * initialOdds) - hedgeStake;

    const profitElement = document.getElementById('hedge-profit');
    profitElement.textContent = formatCurrency(profit);
    profitElement.className = profit >= 0 ? 'positive' : 'negative';
    profitElement.innerHTML = (profit >= 0 ? 'Profit: ' : 'Loss: ') + profitElement.textContent;

    document.getElementById('hedge-stake').textContent = formatCurrency(hedgeStake);
}

// Bonus Bet Calculator
function calculateBonus() {
    clearErrors();
    const bonusAmount = parseFloat(document.getElementById('bonus-amount').value);
    const bonusOdds = parseFloat(document.getElementById('bonus-odds').value);
    const normalStake = parseFloat(document.getElementById('normal-stake').value);
    const normalOdds = parseFloat(document.getElementById('normal-odds').value);

    let isValid = true;
    
    if(!bonusAmount || bonusAmount <= 0) {
        showError('bonus-amount-error', 'Invalid bonus amount');
        isValid = false;
    }
    
    if(!bonusOdds || bonusOdds < 1) {
        showError('bonus-odds-error', 'Invalid bonus odds');
        isValid = false;
    }
    
    if(!normalStake || normalStake <= 0) {
        showError('normal-stake-error', 'Invalid normal stake');
        isValid = false;
    }
    
    if(!normalOdds || normalOdds < 1) {
        showError('normal-odds-error', 'Invalid normal odds');
        isValid = false;
    }

    if(!isValid) return;

    const bonusReturn = bonusAmount * (bonusOdds - 1);
    const normalReturn = normalStake * (normalOdds - 1);

    document.getElementById('bonus-return').textContent = formatCurrency(bonusReturn);
    document.getElementById('normal-return').textContent = formatCurrency(normalReturn);
    document.getElementById('total-return').textContent = formatCurrency(bonusReturn + normalReturn);
}

// Initialize with first calculator
document.getElementById('arbitrage').classList.add('active-section');