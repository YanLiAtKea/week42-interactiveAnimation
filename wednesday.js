let bgMusic = document.querySelector('#bgMusic');
let chuSound = document.querySelector('#chu');
let intro = document.querySelector('div.intro');
let closeIntro = document.querySelector('button.closeIntro');
// add links to storyboard and diagram on the page
// stop music when everything is inside elevator
// elevator shuts
let halfDoor = document.querySelectorAll('.halfDoor');
let humanWrapper = document.querySelector('.humanWrapper');
let human = document.querySelector('img.h');
let humanL = document.querySelector('img.hL');
let humanR = document.querySelector('img.hR');
let suitcasesToMove = document.querySelectorAll('.itemsToMove li');
let ulToMove = document.querySelector('ul.itemsToMove');
let ulInside = document.querySelector('ul.itemsInside');
let bed = document.querySelector('.bed');
let ask = document.querySelector('.ask');
let hint= document.querySelector('.hint p');
let blood = document.querySelector('.blood div div');
let currentBlood = blood.clientWidth; //style.width only gives percentage. OBS.clientWidth includes also padding!
closeIntro.addEventListener('click', closeI);
function closeI(){
    currentBlood = 170;
    bgMusic.pause();
    intro.style.display = "none";
    humanL.style.display = "none";
    humanR.style.display = "none";
    suitcasesToMove.forEach(suitcaseClicked);
    function suitcaseClicked(li, index){
        ask.className = "ask"; // remove hint for bed
        li.addEventListener('click', checkIndexStrengthAndMove);
        let suitcase = li.childNodes;
        function checkIndexStrengthAndMove(){
            humanWrapper.className = "humanWrapper"; // reset humanWrapper movement with pushing the bed
            human.style.display = "none";
            humanL.style.display = "none";
            humanR.style.display = "inherit";
            humanR.style.transform = "translate(0px, 0px)";
            humanL.style.transform = "translate(0px, 0px)";
            if (index != 0){
                hint.textContent = "You need to move the stuff above me first ~";
            } else if(index == 0) {
                if (currentBlood >10) {
                    chuSound.play();
                    currentBlood = currentBlood - 10;
                    blood.style.width = currentBlood + "px";
                    humanL.style.display = "inherit";
                    humanR.style.display = "none";
                    ulInside.insertBefore(li, ulInside.firstChild); // so the first suitecase moved is at the bottom in the elevator and the later ones are on top of the previous one
                    li.style.backgroundColor ="transparent";
                    let suitcasesToMove = document.querySelectorAll('.itemsToMove li'); //update index value
                    suitcasesToMove.forEach(suitcaseClicked); //repeat the check of order and move top element
                    suitcasesToMove.forEach(changeToBlank); //remove error hint and color
                    function changeToBlank(li){
                        li.style.backgroundColor = "transparent";
                    }
                    hint.textContent ="";
                } else {
                    hint.textContent = "You don't have enough strenge to move me now, wait to recover and be patient!";
                }
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
            ask.className = "ask"; // hide ask div
            human.style.display = "none";
            humanL.style.display = "none";
            humanR.style.display = "inherit";
            humanR.style.transform = "translate(-400px, 0)"; //move human to the bed side
            humanWrapper.className = "humanWrapper pushBed";
            bed.style.transform = "translate(228px, -77px)";
            bed.addEventListener('transitionend', tiltBed);
            function tiltBed(){
                bed.removeEventListener('animationend',moveBed);
                bed.style.transition = "all .2s";
                bed.style.transform = "translate(228px, -77px) rotate(17deg)";
            }
            let loseBloodBytime = setInterval(loseSomeBlood, 40);
            let interval = 1;
            function loseSomeBlood(){
                if (currentBlood >3){
                    currentBlood -=3;
                    interval ++;
                    if (interval == 50){
                        clearInterval(loseBloodBytime);
                    }
                } else {
                    humanR.style.transform ="translate(-400px, 110px) rotateX(87deg)";
                    setTimeout(hintDead, 500);
                    function hintDead(){
                        hint.textContent = "Sorry, you worked too hard...I told you you need to be careful with the moving..";
                    }
                    blood.style.display = "none";
                    document.addEventListener('click', null); // so that after death no click will trigger anything else,like hint
                }
            }
        }
        let no = document.querySelectorAll('span')[1];
        no.addEventListener('click', hideAsk);
        function hideAsk(){
            ask.className = "ask";
        }
    }
    setInterval(recover, 100);
    function recover(){
        if (currentBlood < 170){
            currentBlood += 0.1;
        } else {
            currentBlood = 170;
        }
        blood.style.width = currentBlood + "px";
    }
    function everythingIn(){
        halfDoor.forEach(shut);
        function shut(hD){
            hD.style.transform = "rotateY(180deg)";
        }
    }
}
