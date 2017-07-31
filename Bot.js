function bot(cards, team){
    var bestGame=new Array();
    var worstGame=new Array();
    var bestScore=0;
    var worstScore=0xFFFFFF;
    var score=new Number();
    if (cards==undefined)
        cards=players[cp].ph;
    if (team==undefined)
        team=cp&1;
    for (var i=0;i<cards.length-1;i++)
        for (var j=i+1;j<cards.length;j++){
            score=calculateScore(Array().concat(tb.cards.slice(0,ntc), cards.slice(i,i+1), cards.slice(j,j+1)));
            if (score>bestScore){
                bestScore=score;
                bestGame=[i,j];
            }
        }
    if (cards.length>2){
        for (i=0;i<cards.length-1;i++)
            for (j=i+1;j<cards.length;j++)
                if ((i!=bestGame[0])&&(j!=bestGame[0])&&(j!=bestGame[1])&&(i!=bestGame[1])){
                    score=calculateScore(Array().concat(tb.cards.slice(0,ntc), cards.slice(i,i+1), cards.slice(j,j+1)));
                    if (score<worstScore){
                        worstScore=score;
                        worstGame=[i,j];
                    }
                }
    }
    else{
         playCards(makeSelection(bestGame[0], bestGame[1]));
         return;
     }
     if (team==0)
         if (getMaior(players[0].score, players[2].score)>getMaior(players[1].score, players[3].score)||(bestScore<getMaior(players[1].score, players[3].score))){             
             playCards(makeSelection(worstGame[0], worstGame[1]));
             return;
         }
         else{
             playCards(makeSelection(bestGame[0], bestGame[1]));
             return;
         }
         else
             if (getMaior(players[1].score, players[3].score)>getMaior(players[2].score, players[0].score)||(bestScore<getMaior(players[2].score, players[0].score))){
                 playCards(makeSelection(worstGame[0], worstGame[1]));
                 return;
             }
         else{
             playCards(makeSelection(bestGame[0], bestGame[1]));
             return;
         }     
}
function makeSelection(a,b){
    var selection=[0,0,0,0,0,0];
    selection[a]=1;
    selection[b]=1;
return selection;
}