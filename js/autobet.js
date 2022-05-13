var bet_config = {
    start_bet: 1,
    bet_limit: 9,
    bet_delay: 75,
    quota: 20,
    test: 1
};
var total_won = 0;

var fight_status = document.querySelector('#fight-status');
var bet_amount = document.querySelector('#bet-amount');
var bet_meron = document.querySelector('#tote-meron-odd');
var bet_wala = document.querySelector('#tote-wala-odd');

var btn_meron =  document.querySelector('.add-bet[data-team="meron"]');
var btn_wala =  document.querySelector('.add-bet[data-team="wala"]');
var points = document.querySelector('#wallet-amount');

var bets_amount = [];
var capital_need = 0;
var capital = {}

//
var open_durations = [100];
var open_duration = 0;
var open_duration_average = 0;
var bet = {
    current: 'wala wins',
    multiplier: 0,
    count: 0,
    lost: 0,
    won: 0,
    delay: 95
};
var sequence = {
    standby: false,
    open: false,
    close:false,
    won:false
};
var start = false;
var run_script = null;
var init_script = null;

//start
generateRunButton();
alert("Start Button at the top left");
// FUNCTIONS
function runScript() {
    if (fight_status.innerHTML == 'open') {
        open_duration++;
        if (sequence.open == false) {
            sequence.open = true;
            console.log("Bet Open!");
            generateLog("Bet Open!");
            analyzeRooster();
            setTimeout(setBet, (parseInt(bet_config.bet_delay) * 1000));
        }
    }else {
        sequence.open = false;
        if (fight_status.innerHTML == 'wala wins' || fight_status.innerHTML == 'meron wins') {
            if (sequence.won == false) {
                sequence.won = true;
                if (fight_status.innerHTML == bet.current) {
                    bet.won = bets_amount[bet.count] * bet.multiplier;
                    bet.count = 0;
                    bet.lost = 0;
                    console.log("You win: "+ bet.won);
                    generateLog("You win: "+ bet.won);
                    setTimeout(function() {
                        let str = points.innerHTML.replace(',','');
                        capital.total_won = parseFloat(str) - capital.initial;
                        console.log("Total win: "+ capital.total_won);
                        generateLog("Total win: "+ capital.total_won);
                        if (bet_config.quota < capital.total_won) {
                            btnStartClick();
                            alert("Quota reached. You won: " + capital.total_won);
                        }
                    }, 10000);                    
                }else {
                    bet.count++;
                    if (bet.count >= bet_config.limit) {
                        console.log("You lost all the money. TT");
                        generateLog("You lost all the money. TT");
                        btnStartClick();
                    }
                    bet.lost += bets_amount[bet.count];
                    console.log("You lost "+ bet.count +"x. :(");
                    generateLog("You lost "+ bet.count +"x. :(");
                }
            }
        }else {
            if (fight_status.innerHTML == 'close' || fight_status.innerHTML == 'closed') {
                open_durations.push(open_duration);
                if (open_durations.length > 10) {
                    open_durations.shift();
                }
                //get open duration average
                var sum = 0;
                for( var i = 0; i < open_durations.length; i++ ){
                    sum += open_durations[i];
                }
                open_duration_average = sum/open_durations.length;
                bet.delay = 90;
                open_duration = 0;
                if (sequence.close == false) {
                    sequence.close = true;
                    console.log("Bet closed");
                    generateLog("Bet closed");
                    if (bet.current == 'wala wins') {
                        bet.multiplier = parseFloat(bet_wala.innerHTML);
                    }else {
                        bet.multiplier = parseFloat(bet_meron.innerHTML);
                    }
                }
            }else {
                sequence.close = false;
                console.log(fight_status.innerHTML);
                generateLog(fight_status.innerHTML);
            }
            sequence.won = false;
        }
    }
}

function setBet() {
    bet_amount.focus();
    bet_amount.value = bets_amount[bet.count];
    meron_val = parseFloat(bet_meron.innerHTML);
    wala_val = parseFloat(bet_wala.innerHTML);
    if (meron_val > wala_val) {
        bet.current = 'meron wins';
        if (bet_config.test == 0) {
            btn_meron.focus();
            btn_meron.click();
        }
    }else {
        bet.current = 'wala wins';
        if (bet_config.test == 0) {
            btn_wala.focus();
            btn_wala.click();
        }
    }
    console.log("meron: "+ meron_val + "; " + "wala: "+ wala_val);
    generateLog("meron: "+ meron_val + "; " + "wala: "+ wala_val);
    console.log("You bet: " + bet.current);
    generateLog("You bet: " + bet.current);
    console.log("Bet: "+bets_amount[bet.count]);
    generateLog("Bet: "+bets_amount[bet.count]);
    if (fight_status.innerHTML == 'close' || fight_status.innerHTML == 'closed') {
        console.log("Bet Time out!");
        generateLog("Bet Time out!");
        bet_config.bet_delay -= 5;
    }
}

function analyzeRooster() {
    
    let messages = [
        "Checking data.",
        "Checking Rooster.",
        "Checking Rooster records.",
        "Proccessing bet amount.",
        "Waiting to bet."
    ];
    console.log(messages[0]);
    generateLog(messages[0]);
    setTimeout(function() {
        console.log(messages[1]);
        generateLog(messages[1]);
    }, randomNumber(6000, 40000));

    setTimeout(function() {
        console.log(messages[2]);
        generateLog(messages[2]);
    }, randomNumber(40000, 60000));

    setTimeout(function() {
        console.log(messages[3]);
        generateLog(messages[3]);
    }, randomNumber(60000, 65000));

    setTimeout(function() {
        console.log(messages[4]);
        generateLog(messages[4]);
    }, randomNumber(65000, 70000));
}

function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

function generateRunButton() {
    //container
    let div = document.createElement("div");
    div.classList.add('fixed-bottom', 'w-100', 'bg-white');
    div.style.height = '30vh';
    document.body.appendChild(div);

    let div_button = document.createElement("div");
    div_button.classList.add('bg-dark');
    div.appendChild(div_button);

    let btn_start = document.createElement("button");
    btn_start.innerHTML = "Start Auto Bet";
    btn_start.classList.add('btn', 'btn-success', 'm-2');
    btn_start.setAttribute('id','start-auto-bet');
    btn_start.onclick = function () {
        btnStartClick();
    };
    div_button.appendChild(btn_start);

    let btn_minimize = document.createElement("button");
    btn_minimize.innerHTML = "Minimize";
    btn_minimize.classList.add('btn', 'btn-secondary', 'm-2');
    btn_minimize.setAttribute('id','console-minimize');
    btn_minimize.style.cssText  = 'position:absolute;right:0px';
    let minimized = false;
    btn_minimize.onclick = function () {
        if (minimized) {
            div.style.height = '30vh';
            minimized = false;
            btn_minimize.innerHTML = "Minimize";
        } else {
            div.style.height = div_button.offsetHeight+'px';
            minimized = true;
            btn_minimize.innerHTML = "Maximize";
        }
    };
    div_button.appendChild(btn_minimize);

    let div_logs = document.createElement("div");
    div_logs.classList.add('w-100', 'bg-secondary', 'overflow-auto', 'container-fluid');
    div_logs.style.height = (div.offsetHeight - div_button.offsetHeight)+'px';
    div_logs.setAttribute('id','console-logs');
    div.appendChild(div_logs);
}

function generateLog(message) {
    let logs = document.getElementById('console-logs');
    let p = document.createElement("p");
    p.classList.add('mb-0');
    p.innerHTML = message;
    logs.appendChild(p);
}

function startScript() {
    bet_config.start_bet = prompt('Type Start Bet:', 1)
    bet_config.bet_delay = prompt('Type Bet Delay: ', 75)
    bet_config.bet_limit = prompt('Type Bet Count Limit: ', 9)
    bet_config.quota = prompt('Type Earning Quota: ', 20)
    bet_config.test = prompt('Run Trial[1(true) or 0(false)]: ', 1)

    bets_amount = [];
    bets_amount.push(parseInt(bet_config.start_bet));
    let increase = bet_config.start_bet - (bet_config.start_bet * 0.2);
    capital_need = bets_amount[0];
    let str = points.innerHTML.replace(',','');
    let tmp_capital_init = {
        initial: parseFloat(str),
        total_won: 0
    };
    capital = Object.assign(tmp_capital_init);

    for (let index = 1; index < bet_config.bet_limit; index++) {
        let new_bet = Math.round((bets_amount[index - 1] * 2) + increase);
        bets_amount.push(new_bet);
        if (index >= 5) {
            increase = increase * 2.6;
        }else {
            increase = increase * 2.1;
        }
        capital_need+=new_bet;
    }
    console.log('Bet list');
    generateLog('Bet list');
    console.log(bets_amount);
    generateLog(bets_amount);
    console.log('Rquired capital: ' + capital_need);
    generateLog('Rquired capital: ' + capital_need);
    console.log("Please wait next Open Bet");
    generateLog("Please wait next Open Bet");
    init_script = setInterval(function() {
        if(fight_status.innerHTML == 'open' && start == false) {
            return;
        }else {
            if (fight_status.innerHTML == 'standby') {
                console.log("Auto betting start!");
                generateLog("Auto betting start!");
                start = true;
                run_script = setInterval(runScript,1000)
                clearInterval(init_script);
            }else {
                return;
            }
        }
    }, 1000);
}

function btnStartClick() {
    let btn = document.getElementById('start-auto-bet');
    if (init_script == null) {
        btn.innerHTML = "Stop Auto Bet";
        startScript();
    }else {
        btn.innerHTML = "Start Auto Bet";
        console.log("Auto Bet Stopped")
        generateLog("Auto Bet Stopped");
        clearInterval(run_script);
        init_script = null;            
    }
}