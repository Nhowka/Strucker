var deck = new Array();
var games = ["Carta Alta","Par", "Dois Pares", "Trinca", "Straight", "Flush", "Full House", "Quadra", "Straight Flush", "Royal Flush"];
var cp = 0; //Current Player
var dealer=3;
var nsc = 0; //Number of selected cards
var ntc = 0; //Number of turned cards
var psel = new Array();
var lw = 0;
var gScore=[0,0];
var tOrd=new Number();
var pScore=new Array();
var players=new Array();
var BackImage = new Image();
var DeckImage = new Image();

function nextPlayer(){
    cp=(++cp)%4;
    if (cp==lw){
        draw();
        window.setTimeout(clearHand,1250);
        ntc++;
        cp=lw=calculateWinner();
        clearScore(); 
    }
    if (players[cp].isBot==1){
        window.setTimeout(bot,1250,players[cp].ph, cp&1);
    }
}
function clearHand(){
        players[0].playedCards=new Array();
        players[1].playedCards=new Array();
        players[2].playedCards=new Array();
        players[3].playedCards=new Array();
        draw();
}
function clearScore(){
        players[0].score=0;
        players[1].score=0;
        players[2].score=0;
        players[3].score=0;
        document.getElementById("handstatus").innerHTML="";
}
function getMaior(a,b){
    if(a>b)
        return a;
    return b;
}
function calculateWinner(){
    if (getMaior(players[0].score, players[2].score)>getMaior(players[1].score, players[3].score)){
        pScore[tOrd]=1;
        if (tOrd==1)
            if ((pScore[0]==1)||(pScore[0]==3)){
                alert("Equipe 1 venceu! \nPontos: "+(++gScore[0]));
                newgame();
                return dealer;
            }
        if (tOrd==2){
            alert("Equipe 1 venceu! \nPontos: "+(++gScore[0]));
            newgame();
            return dealer;
        }    
        tOrd++;
        if (players[0].score > players[2].score)
            return 0;
        else
            return 2;
    }
    else if (getMaior(players[0].score, players[2].score)==getMaior(players[1].score, players[3].score)){
        pScore[tOrd]=3;
        if ((tOrd>0)&&(pScore[0]!=3)){
            if (pScore[0]==1){
                alert("Equipe 1 venceu! \nPontos: "+(++gScore[0]));
                newgame();
                return dealer;
            }
            if (pScore[0]==2){
                alert("Equipe 2 venceu! \nPontos: "+(++gScore[1]));
                newgame();
                return dealer;
            }
        }
        if ((tOrd==2)&&(pScore[0]!=3)&&(pScore[0]!=3)){
            if(dealer & 1){
                alert("Equipe 2 venceu! \nPontos: "+(++gScore[1]));
                newgame();
                return dealer;
            }
            else{
                alert("Equipe 1 venceu! \nPontos: "+(++gScore[0]));
                newgame();
                return dealer;
            }
        }
        tOrd++;
        var fp=lw;
        do{
            if(players[fp].score==getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score))){
                return fp;
            }
            fp=((fp-1)%4+4)%4;
        }
        while(true);
    }
    else{
        pScore[tOrd]=2;
        if (tOrd==1)
            if ((pScore[0]==2)||(pScore[0]==3)){
                alert("Equipe 2 venceu! \nPontos: "+(++gScore[1]));
                newgame();
                return dealer;
            }
        if (tOrd==2){
            alert("Equipe 2 venceu! \nPontos: "+(++gScore[1]));
            newgame();
            return dealer;
        }    
        tOrd++;
        if (players[1].score > players[3].score)
            return 1;
        else
            return 3;
    }
}
function playCards(selection){
    var playedCards = new Array();
    for (var i=players[cp].ph.length-1; ((i>=0)&&(playedCards.length<2)); i--)
        if (selection[i]==1)
            playedCards.push(players[cp].ph.splice(i, 1).pop());
    players[cp].playedCards=playedCards.reverse();
    players[cp].score=calculateScore(Array().concat(tb.cards.slice(0,ntc), playedCards));
    var score=getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score));
    if (score!=0)
        document.getElementById("handstatus").innerHTML="Melhor mao: "+games[score>>20];
    clearSelection();
    nextPlayer();
    draw();
}
function translateStraight(score){
    var test=0;
    var k;
    for (var i=12; i>0; i--)
        if (score & (1<<i)){
            test=test*0x10+i;
            k++;
            if(k==5)
                break;
        }
    return test;
}
function calculateScore(cards){
    var fsuit=new Number();
    var fflag=false;
    var fcards=[0,0,0,0];
    var scards=new Number();
    for (var i = 0; i<cards.length; i++)
        fcards[Math.floor(cards[i]/13)]++;
    for (i = 0; i<4; i++)
        if (fcards[i]>=5){
            fflag=true;
            fsuit=i;
            break;
        }
    if (fflag){
        for (i = 0; i<cards.length; i++)
            if (Math.floor(cards[i]/13)==fsuit)
                scards|=1<<Math.floor(cards[i]%13);
        if ( (scards & 0x1E01)== 0x1E01)
            return 0x9EDCBA;
        else{
            var test=0x1F00;
            for (i=0; i<9; i++){
                if ((scards & test) == test)
                    return 0x800000+translateStraight(test);
                test>>=1;
            }
        }
        var k=0;
        var score=0;
        var pcards=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (i=0; i<cards.length; i++)
            if (Math.floor(cards[i]/13)==fsuit)
                pcards[cards[i]%13]++;
        if (pcards[0]==1){
            k++;
            score=0xE;
        }
        for (i=12; i>0; i--){
            if(pcards[i]==1){
                score=score*0x10+i;
                k++;
            }
            if(k==5)
                break;
        }
        return 0x500000+score;
    }
    scards=0;
    for (i = 0; i<cards.length; i++)
        scards|=1<<Math.floor(cards[i]%13);
    if ((scards & 0x1E01)== 0x1E01)
        return 0x4EDCBA;
    else{
        var test=0x1F00;
        for (i=0; i<9; i++){
            if ((scards & test) == test)
                return 0x400000+translateStraight(test);
            test>>=1;
        }
    }
    var pflag=false;
    var tflag=false;
    var pcount=0;
    var pcards=[0,0,0,0,0,0,0,0,0,0,0,0,0];
    var score=0;
    for (i = 0; i<cards.length; i++)
        pcards[cards[i]%13]++;
    for (i=12; i>=0; i--){
        if (pcards[i]==4){
            if (i==0)
                score=0xEEEE0;
            else
                score=i*0x11110;
            pcards[i]=0;
            if (pcards[0]!=0)
                score+=0xE;
            else
                for (i=12; i>0; i--)
                    if (pcards[i]!=0){
                        score+=i;
                        break;
                    }
            return 0x700000+score;
        }
        if (pcards[i]==3)
            tflag=true;
        if (pcards[i]==2){
            pcount++;
            pflag=true;
        }
    }
    if ((pflag==true)&&(tflag==true)){
        for (i=12; i>=0; i--)
            if (pcards[i]==3){
                if (i==0)
                    score=0xEEE00;
                else
                    score=i*0x11100;
                pcards[i]=0;
                break;
            }
        if (pcards[0]==2)
            score+=0xEE;
        else
            for (i=12; i>0; i--)
                if (pcards[i]==2){
                    score+=i*0x11;
                    break;
                }
        return 0x600000+score;
    }
    if (tflag==true){
        for (i=12; i>=0; i--)
            if (pcards[i]==3){
                if (i==0)
                    score=0xEEE;
                else
                    score=i*0x111;
                pcards[i]=0;
                break;
            }
        var k=3;
        if (pcards[0]==1){
            score=score*0x10+0xE;
            k++;
        }
        for (i=12; i>0; i--){
            if (pcards[i]==1){
                score=score*0x10+i;
                k++;
            }
            if (k==5)
                break;
        }
        return 0x300000+score;
    }
    if (pcount>=2){
        var k=0;
        if (pcards[0]==2){
               score=0xEE;
               k+=2;
        }
        for (i=12; i>0; i--)
            if (pcards[i]==2){
                score=score*100+i*0x11;
                pcards[i]=0;
                k+=2;
                if (k==4)
                    break;
            }
        if (pcards[0]==1){
            score=score*0x10+0xE;
            k++;
        }
        for (i=12; i>0; i--){
            if (k==5)
                break;            
            if (pcards[i]==1){
                score=score*0x10+i;
                k++;
            } 
        }
        return 0x200000+score;
    }
    if (pflag==true){
        for (i=12; i>=0; i--)
            if (pcards[i]==2){
                if (i==0)
                    score=0xEE;
                else
                    score=i*0x11;
                pcards[i]=0;
                break;
            }
        var k=2;
        if (pcards[0]==1){
            score=score*0x10+0xE;
            k++;
        }
        for (i=12; i>0; i--){
            if (pcards[i]==1){
                score=score*0x10+i;
                k++;
            }
            if (k==5)
                break;
        }
        return 0x100000+score;
    }
    var k=0;
    if (pcards[0]==1){
               score=0xE;
               k++;
        }
        for (i=12; i>0; i--){
            if (pcards[i]==1){
                score=score*0x10+i;
                k++;
            }
            if (k==5)
                break;
        }
    return score;
}
function getMenor(){
    if (window.innerWidth < window.innerHeight)
        return window.innerWidth;
    return window.innerHeight;
}
function draw(){
    player1draw();
    player2draw();
    player3draw();
    player4draw();
    drawTable();
    var nbutton= document.getElementById("next");
    nbutton.style.position="absolute";
    nbutton.style.width=getMenor()*0.2+"px";
    nbutton.style.height=getMenor()*0.2+"px";
    nbutton.style.left = window.innerWidth*0.75+getMenor()*0.05+"px";
    nbutton.style.top = (window.innerHeight-getMenor()*0.95)/2+"px";

}
function toggle(card){
    if (psel[card]==1){
        nsc--;
        psel[card]^=1;
    }
    else if (nsc<2){
        nsc++;
        psel[card]^=1;
    }
    if (nsc==2)
        document.getElementById("next").disabled=false;
    else
        document.getElementById("next").disabled=true;
}
function selectCard(canvas, event){
    if (canvas.ord!=cp)
        return;
    var x = new Number();
    var y = new Number();
    x = event.clientX-canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = event.clientY-canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;
    var tam;
    var i;
    if (canvas.height>canvas.width){
        tam=canvas.width*0.8;
        i=(canvas.height-tam)/(canvas.ph.length-1);
        if (y>i*(canvas.ph.length-1)){
            toggle(canvas.ph.length-1);
        }
        else{
            toggle(Math.floor(y/i));
        }
    }
    else{
        tam=canvas.height*0.8;
        i=(canvas.width-tam)/(canvas.ph.length-1);
        if (x>i*(canvas.ph.length-1)){
            toggle(canvas.ph.length-1);
        }
        else{
            toggle(Math.floor(x/i));
        }
    }
    draw();
}
function clearSelection(){
    document.getElementById("next").disabled=true;
    psel=[0,0,0,0,0,0];
    nsc=0;
}
function drawTable(){
    canvas = document.getElementById("table");
    canvas.width  = getMenor()/2;
    canvas.height = getMenor()/2;
    canvas.style.left = ((window.innerWidth-canvas.width)/2)+"px";
    canvas.style.top = (window.innerHeight-canvas.height)/2+"px";
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    tamY=getMenor()*0.25;
    tamX=tamY;
    for (i=0; i<canvas.cards.length; i++){
        x=canvas.cards[i]%13;
        y=Math.floor(canvas.cards[i]/13);
        if (i<ntc)
            context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*((canvas.width-tamX)/(ntc-1)), (canvas.height-tamY)/2, tamX, tamY);
    }

}
function player1draw(){
    var x;
    var y;
    var canvas = players[0];
    canvas.width  = getMenor()/2;
    canvas.height = getMenor()/4;
    canvas.style.left = ((window.innerWidth-canvas.width)/2)+"px";
    canvas.style.top = (window.innerHeight/2-canvas.height+(getMenor()/2))+"px";
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    tamY=canvas.height*0.8;
    tamX=tamY;
    if((canvas.score==getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score)))&&(canvas.score!=0))
        canvas.style.border="blue 2px solid";
    else
        canvas.style.border="";
    
    for (var i=0; i<canvas.ph.length; i++){
        if (canvas.isBot==0){
            x=canvas.ph[i]%13;
            y=Math.floor(canvas.ph[i]/13);
            if (cp==canvas.ord){
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*((canvas.width-tamX)/(canvas.ph.length-1)), (1-psel[i])*(canvas.height-tamY), tamX, tamY);
                canvas.style.border="red 2px solid";
            }
            else
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*((canvas.width-tamX)/(canvas.ph.length-1)), (canvas.height-tamY), tamX, tamY);
        }
        else{
            context.drawImage(BackImage, 0, 0, 102, 102,  i*((canvas.width-tamX)/(canvas.ph.length-1)), (canvas.height-tamY), tamX, tamY);
        }
    }
    for (i=0; i<canvas.playedCards.length; i++){
        x=canvas.playedCards[i]%13;
        y=Math.floor(canvas.playedCards[i]/13);
        context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*(canvas.width-tamX), 0, tamX, tamY);
    }
}
function player2draw(){
    var x;
    var y;
    canvas = players[1];
    canvas.width  = getMenor()/4;
    canvas.height = getMenor()/2;
    canvas.style.left = (window.innerWidth/4-canvas.width)+"px";
    canvas.style.top = ((window.innerHeight-canvas.height)/2)+"px";
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    tamX=canvas.width*0.8;
    tamY=tamX;
        if((canvas.score==getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score)))&&(canvas.score!=0))
        canvas.style.border="blue 2px solid";
    else
        canvas.style.border="";
    for (i=0; i<canvas.ph.length; i++){
        if(canvas.isBot==0){
            x=canvas.ph[i]%13;
            y=Math.floor(canvas.ph[i]/13);
            if (cp==canvas.ord){
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  canvas.width*0.2*psel[i], i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
                canvas.style.border="red 2px solid";
            }
            else
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  0, i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
            }
        else
            context.drawImage(BackImage, 0, 0, 102, 102,  0, i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
        
    }
    for (i=0; i<canvas.playedCards.length; i++){
        x=canvas.playedCards[i]%13;
        y=Math.floor(canvas.playedCards[i]/13);
        context.drawImage(DeckImage, x*101, y*101, 101, 101, canvas.width*0.2, i*(canvas.height-tamY), tamX, tamY);
    }
}
function player3draw(){
    var x;
    var y;
    canvas = players[2];
    canvas.width  = getMenor()/2;
    canvas.height = getMenor()/4;
    canvas.style.left = ((window.innerWidth-canvas.width)/2)+"px";
    canvas.style.top = ((window.innerHeight-getMenor())/2)+"px";
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    tamY=canvas.height*0.8;
    tamX=tamY;
        if((canvas.score==getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score)))&&(canvas.score!=0))
        canvas.style.border="blue 2px solid";
    else
        canvas.style.border="";
    for (i=0; i<canvas.ph.length; i++){
        if(canvas.isBot==0){
        x=canvas.ph[i]%13;
        y=Math.floor(canvas.ph[i]/13);
        if (cp==canvas.ord){
            context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*((canvas.width-tamX)/(canvas.ph.length-1)), psel[i]*(canvas.height-tamY), tamX, tamY);
            canvas.style.border="red 2px solid";
        }
        else
            context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*((canvas.width-tamX)/(canvas.ph.length-1)), 0, tamX, tamY);
    }
    else
        context.drawImage(BackImage, 0, 0, 102, 102,  i*((canvas.width-tamX)/(canvas.ph.length-1)), 0, tamX, tamY);
    }
    for (i=0; i<canvas.playedCards.length; i++){
        x=canvas.playedCards[i]%13;
        y=Math.floor(canvas.playedCards[i]/13);
        context.drawImage(DeckImage, x*101, y*101, 101, 101,  i*(canvas.width-tamX), canvas.height*0.2, tamX, tamY);
    }
}
function player4draw(){
    var x;
    var y;    
    canvas = players[3];
    canvas.width  = getMenor()/4;
    canvas.height = getMenor()/2;
    canvas.style.left = (window.innerWidth*0.75)+"px";
    canvas.style.top = ((window.innerHeight-canvas.height)/2)+"px";
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    tamX=canvas.width*0.8;
    tamY=tamX;
    if((canvas.score==getMaior(getMaior(players[0].score, players[2].score),getMaior(players[1].score, players[3].score)))&&(canvas.score!=0))
        canvas.style.border="blue 2px solid";
    else
        canvas.style.border="";
    for (i=0; i<canvas.ph.length; i++){
        if (canvas.isBot==0){
        x=canvas.ph[i]%13;
        y=Math.floor(canvas.ph[i]/13);
        for (i=0; i<canvas.ph.length; i++){
            x=canvas.ph[i]%13;
            y=Math.floor(canvas.ph[i]/13);
            if (cp==canvas.ord){
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  canvas.width*0.2*(1-psel[i]), i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
                canvas.style.border="red 2px solid";
            }
            else
                context.drawImage(DeckImage, x*101, y*101, 101, 101,  canvas.width*0.2, i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
        }
    }
    else
        context.drawImage(BackImage, 0, 0, 102, 102,  canvas.width*0.2, i*((canvas.height-tamY)/(canvas.ph.length-1)), tamX, tamY);
    }
    for (i=0; i<canvas.playedCards.length; i++){
        x=canvas.playedCards[i]%13;
        y=Math.floor(canvas.playedCards[i]/13);
        context.drawImage(DeckImage, x*101, y*101, 101, 101, 0, i*(canvas.height-tamY), tamX, tamY);
    }
}
function newgame(){
    var k=0;
    var p1h = new Array();
    var p2h = new Array();
    var p3h = new Array();
    var p4h = new Array();
    var table = new Array();
    clearSelection();
    shuffle();
    for (var i=0; i<3; i++){
        p1h.push(deck[k++]);
        p1h.push(deck[k++]);
        p2h.push(deck[k++]);
        p2h.push(deck[k++]);
        p3h.push(deck[k++]);
        p3h.push(deck[k++]);
        p4h.push(deck[k++]);
        p4h.push(deck[k++]);
    }
    k++;
    table.push(deck[k++]);
    table.push(deck[k++]);
    table.push(deck[k++]);
    k++;
    table.push(deck[k++]);
    k++;
    table.push(deck[k++]);
    players[dealer].ph=p1h;
    players[0].playedCards=new Array();
    players[(1+dealer)%4].ph=p2h;
    players[1].playedCards=new Array();
    players[(2+dealer)%4].ph=p3h;
    players[2].playedCards=new Array();
    players[(3+dealer)%4].ph=p4h;
    players[3].playedCards=new Array();
    tb.cards=table;
    ntc=3;
    lw=cp=(dealer+1)%4;
    dealer=(++dealer)%4;
    clearScore();
    pScore=[0,0,0];
    tOrd=0;
    draw();
}
function shuffle(){
    var shuffled = new Array();
    for (var i=0; i<52; i++){
        shuffled.push(deck.splice(Math.floor(Math.random()*deck.length), 1).pop());
    }
    deck = shuffled;
}
function initialize(){
    for (var i=0; i<52; i++)
        deck.push(i);
    players.push(document.getElementById("player1"));
    players.push(document.getElementById("player2"));
    players.push(document.getElementById("player3"));
    players.push(document.getElementById("player4"));
    players[0].ord=0;
    players[0].isBot=0;
    players[1].ord=1;
    players[1].isBot=1;
    players[2].ord=2;
    players[2].isBot=1;
    players[3].ord=3;
    players[3].isBot=1;
    tb = document.getElementById("table");
    if (window.opera){
        DeckImage.src="Deck.png";
        BackImage.src="Back.png";
    }
    else
    {
        DeckImage.src="Deck.svg";
        BackImage.src="Back.svg";
    }
    newgame();
    window.setTimeout(draw,3000);
}