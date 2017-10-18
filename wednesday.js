let suitcasesToMove = document.querySelectorAll('.itemsToMove li');
let ulToMove = document.querySelector('ul.itemsToMove');
let ulInside = document.querySelector('ul.itemsInside');
let bed = document.querySelector('.bed');
let ask = document.querySelector('.ask');
let hint= document.querySelector('.hint p');
let blood = document.querySelector('.blood div');
let currentBlood = blood.clientWidth; //style.width only gives percentage. OBS.clientWidth includes also padding!

suitcasesToMove.forEach(suitcaseClicked);
function suitcaseClicked(li, index){
    ask.className = "ask"; // remove hint for bed
    li.addEventListener('click', checkIndexAndMove);
    function checkIndexAndMove(){
        if (index != 0){
            hint.textContent = "you can't move me";
            li.style.backgroundColor = "black";
        } else if(index == 0) {
            currentBlood = currentBlood -5;
            blood.style.width = currentBlood + "px"; // each suitecase costs you 5 strength
            ulInside.insertBefore(li, ulInside.firstChild); // so the first suitecase moved is at the bottom in the elevator and the later ones are on top of the previous one
            li.style.backgroundColor ="transparent";
            let suitcasesToMove = document.querySelectorAll('.itemsToMove li'); //update index value
            suitcasesToMove.forEach(suitcaseClicked); //repeat the check of order and move top element
            suitcasesToMove.forEach(changeToBlank); //remove error hint and color
            function changeToBlank(li){
                li.style.backgroundColor = "transparent";
            }
            hint.textContent =" ";
        }
    }
}
bed.addEventListener('click', checkIfAlreadyInElevator);
function checkIfAlreadyInElevator(){
    let bedPosition = bed.style.transform;
    if (!bedPosition){
        areYouSure();
    } else {
        hint.textContent = "you want to take me out again? I won\'t leave!";
    }
}
function areYouSure(){
    ask.className = "ask show";
    let yes = document.querySelector('span');
    yes.addEventListener('click', moveBed);
    function moveBed(){
        ask.className = "ask";
        bed.style.transform = "translate(259px, -60px)";
        bed.addEventListener('transitionend', tiltBed);
        function tiltBed(){
            bed.removeEventListener('animationend',moveBed);
            bed.style.transition = "all .2s";
            bed.style.transform = "translate(259px, -60px) rotate(7deg)";
        }
        let loseBloodBytime = setInterval(loseSomeBlood, 40);
        let interval = 1;
        function loseSomeBlood(){
            if (currentBlood >3){
                currentBlood -=3;
                blood.style.width = currentBlood + "px";
                interval ++;
                if (interval == 50){
                    clearInterval(loseBloodBytime);
                }
            } else {
                hint.textContent = "Sorry, you worked too hard...";

            }
        }
    }
    let no = document.querySelectorAll('span')[1];
    no.addEventListener('click', hideAsk);
    function hideAsk(){
        ask.className = "ask";
    }
}
