document.querySelector("#btn-hit").addEventListener("click",onHitClick);
document.querySelector("#btn-deal").addEventListener("click",onDealClick);
document.querySelector("#btn-stand").addEventListener("click",playDealer);

function PlayerDetails(scoreSpanId,cardContainerId,score) {
    this.ScoreSpanId = scoreSpanId;
    this.CardContainerId = cardContainerId;
    this.Score = score;
    this.NumberOf11Ace = 0;
    this.Reset = function(){
        this.Score = 0;
        this.NumberOf11Ace = 0;
    }
}


let game = {
    "user": new PlayerDetails("#user-score","#user-box",0),
    "dealer" : new PlayerDetails("#dealer-score","#dealer-box",0),
    "resultSpan": "#result",
    "cards" : ["2","3","4","5","6","7","8","9","10","A","J","Q","K"],
    "cardValueById" :{"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"A":[1,11],"J":10,"Q":10,"K":10},
    "finished":false,
    "standState": false,
    "wins":0,
    "draws":0,
    "losses":0
}

const user  = game['user'];
const dealer  = game['dealer'];

let cardImgById ={
    "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Playing_card_diamond_2.svg/1200px-Playing_card_diamond_2.svg.png",
    "3" : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Playing_card_heart_3.svg/819px-Playing_card_heart_3.svg.png",
    "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Playing_card_spade_4.svg/819px-Playing_card_spade_4.svg.png",
    "5": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Playing_card_club_5.svg/1200px-Playing_card_club_5.svg.png",
    "6":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Playing_card_heart_6.svg/1200px-Playing_card_heart_6.svg.png",
    "7":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Playing_card_club_7.svg/819px-Playing_card_club_7.svg.png",
    "8":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Playing_card_diamond_8.svg/1200px-Playing_card_diamond_8.svg.png",
    "9":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Playing_card_club_9.svg/1200px-Playing_card_club_9.svg.png",
    "10":"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Playing_card_spade_10.svg/1200px-Playing_card_spade_10.svg.png",
    "A":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Playing_card_heart_A.svg/614px-Playing_card_heart_A.svg.png",
    "J":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jack_of_spades2.svg/209px-Jack_of_spades2.svg.png",
    "Q":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/English_pattern_queen_of_hearts.svg/360px-English_pattern_queen_of_hearts.svg.png",
    "K":"https://upload.wikimedia.org/wikipedia/commons/3/39/Cardset1-ck.jpg",
}

let swishSound = new Audio("http://soundbible.com/grab.php?id=682&type=mp3");
let lossSound = new Audio("http://soundbible.com/grab.php?id=2014&type=mp3");
let winSound = new Audio("http://soundbible.com/grab.php?id=2103&type=mp3");

function onHitClick(){
    if(game.finished || game.standState){
        return;
    }
    addCard(user);
    if(game.finished){
        showResult(findWinner());
    }
}

function addCard(player){
    console.log("add card");
    swishSound.play();
    let cardId = game.cards[pickACard()];
    updateScore(player,cardId);
    let cardImg = document.createElement("img");
    cardImg.src=cardImgById[cardId];
    document.querySelector(player.CardContainerId).appendChild(cardImg);
    showScore(player);
    if(player.Score>=21){
        game.finished = true;
    }
    console.log("add card end");
}


function updateScore(player,cardId){
    let currentScore  = player.Score;
    if (cardId == "A"){
        if((currentScore + 11) > 21 ){
            player.Score+= 1;    
        }
        else{
            player.Score+= 11;
            player.NumberOf11Ace++;
        }

    }
    else{
        if((currentScore+game.cardValueById[cardId])>21 && player.NumberOf11Ace>0){
            player.Score -= 10;
            player.NumberOf11Ace--;
        }
        player.Score+= game.cardValueById[cardId];
    }
}

function showScore(player){
    if(player.Score>21){
        document.querySelector(player.ScoreSpanId).textContent = "Busted!";
        document.querySelector(player.ScoreSpanId).style.color = "Red";
    }
    else{
        document.querySelector(player.ScoreSpanId).textContent = player.Score;
    }
}

function pickACard(){
    return Math.floor(Math.random()*12);
}

function onDealClick(){
    removeImgs(user.CardContainerId);
    removeImgs(dealer.CardContainerId);
    user.Reset();
    dealer.Reset();
    showScore(user);
    showScore(dealer);
    document.querySelector(user.ScoreSpanId).style.color = "White";
    document.querySelector(dealer.ScoreSpanId).style.color = "White";
    document.querySelector("#result").textContent = "Let's Play";
    document.querySelector("#result").style.color = "black";
    game.finished = false;
    game.standState = false;
}

function removeImgs(containerId){
    let cardImgs = document.querySelector(containerId).querySelectorAll('img');
    cardImgs.forEach(element => { element.remove();      
    });
}

function findWinner() {
    userScore = user.Score;
    dealerScore = dealer.Score;
    winner = 0;
    if (userScore == 21) {
        winner = 1;
    }
    else if (dealerScore == 21) {
        winner = -1;
    }
    else if (userScore < 21 && dealerScore < 21) {
        if (userScore > dealerScore) {
            winner = 1;
        }
        else if (userScore === dealerScore) {
            winner = 0;
        }
        else {
            winner = -1;
        }
    }
    else {
        if(userScore>21){
            winner =-1;
        }
        else{
            winner =1;
        }
    }
    updateStats(winner);
    return winner;
}

function updateStats(winner){
    switch(winner){
        case 1:
            game.wins++;
            break;
        case -1:
            game.losses++;
            break;
        case 0 :
            game.draws++;
            break;
    }
}

async function playDealer(){
    if(game.finished || game.standState){
        return;
    }
    game.standState = true;
    while(user.Score > dealer.Score){
        await sleep(1);
        if(!game.standState){
            return;
        }
        addCard(dealer);
    }
    showResult(findWinner());
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve();}, time * 1000);
    });
}

function showResult(winner){
    let resultMessage,resultMessageColor;
    switch(winner){
        case 1:
            resultMessage = "You won!";
            resultMessageColor = "green";
            document.querySelector("#win").textContent = game.wins;
            winSound.play();
            break;
        case -1:
            resultMessage = "You lost!";
            resultMessageColor = "red";
            document.querySelector("#loss").textContent = game.losses;
            lossSound.play();
            break;
        case 0 :
            resultMessage = "Its a draw";
            resultMessageColor = "orange";
            document.querySelector("#draw").textContent = game.draws;
            winSound.play();
            break;
    }
    document.querySelector("#result").textContent = resultMessage;
    document.querySelector("#result").style.color = resultMessage;      
}


