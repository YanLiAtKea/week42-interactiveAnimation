let bgMusic = document.querySelector('#bgMusic');
let chuSound = document.querySelector('#chu');
let gameOverSound = document.querySelector('#gameOver');
let scene = document.querySelector('.scene');
let intro = document.querySelector('div.intro');
let closeIntro = document.querySelector('button.closeIntro');
let halfDoor = document.querySelectorAll('.halfDoor');
let humanWrapper = document.querySelector('.humanWrapper');
let human = document.querySelector('img.h');
let humanL = document.querySelector('img.hL');
let humanR = document.querySelector('img.hR');
let suitcasesToMove = document.querySelectorAll('.itemsToMove li');
let ulToMove = document.querySelector('ul.itemsToMove');
let ulInside = document.querySelector('ul.itemsInside');
let bed = document.querySelector('.bed');
let bedImg = document.querySelector('.bed img');
let ask = document.querySelector('.ask');
let hint= document.querySelector('.hint p');
let strengthLevel = document.querySelector('.blood p');
let blood = document.querySelector('.blood div div');
let currentBlood = blood.clientWidth; //style.width only gives percentage. OBS.clientWidth includes also padding!

// game start
closeIntro.addEventListener('click', closeI);
function closeI(){
    //reset blood
    currentBlood = 170;
    //lower background volume
    let lowerVolumeF = setInterval(lowerVolume, 200);
    let volume = 1;
    function lowerVolume(){
        volume *= .91; // use * for gradual change without sudden stop of music
        bgMusic.volume = volume;
        if (volume <.05 ){
            bgMusic.pause();
            clearInterval(lowerVolumeF);
        }
    };
    // show hint before anything is clicked
    hint.textContent = "click on any stuff to move it into the elevator";
    // remove intro div
    intro.style.display = "none";
    // show only the human img facing front
    humanL.style.display = "none";
    humanR.style.display = "none";
    // click on each suitcase
    suitcasesToMove.forEach(suitcaseClicked);
    function suitcaseClicked(li, index){
        ask.className = "ask"; // remove hint for bed in the case that user click suitcase after bed is already moved and the ask div is shown at the moment
        li.addEventListener('click', checkIndexStrengthAndMove);
        let suitcase = li.childNodes;
        function checkIndexStrengthAndMove(){
            humanWrapper.className = "humanWrapper"; // reset humanWrapper movement with pushing the bed
            human.style.display = "none";
            humanL.style.display = "none";
            humanR.style.display = "inherit";
            humanR.style.transform = "translate(0px, 0px)";
            humanL.style.transform = "translate(0px, 0px)";
            if (index != 0){ // if suitcase is not on top
                hint.textContent = "You need to move the stuff above me first ~";
            } else if(index == 0) { // for the case where the clicked suitcase is on top
                // check if bed is finished moving and reached elevator, bedXY.left starting at 32, ends at 218.26...
                let bedXY = bed.getBoundingClientRect();
                if (bedXY.left <218 && bedXY.left >32){
                    hint.textContent = "can you move 2 things at the same time in 2 different directions? humm??"
                } else if (bedXY.left >=218 || bedXY.left == 32){
                console.log(bedXY.left);
                    if (currentBlood >10) { //check if have enough blood left for the task // help the user to finish the game
                        humanL.style.display = "none";
                        humanR.style.display = "inherit"; // turn to right, pick up the suitcase
                        hint.textContent = "";
                        setTimeout(throwSuitcase, 30); // human turns and suitcase moves
                        function throwSuitcase(){
                            chuSound.play();
                            currentBlood = currentBlood - 10;
                            blood.style.width = currentBlood + "px";
                            humanL.style.display = "inherit";
                            humanR.style.display = "none";
                            hint.textContent ="Nice work~";
                            ulInside.insertBefore(li, ulInside.firstChild); // move this item from the original list of toMove to the new list of insideElevator. Don't use appendChild, use insertBefore, so the first suitecase is at the bottom in the elevator and the later ones are on top of the previous one
                            let itemsInEle = document.querySelectorAll('.itemsInside li');
                            itemsInEle.forEach(doNotClickAgain); // get array of items inside elevator
                            function doNotClickAgain(suitcaseInside){
                                suitcaseInside.addEventListener('mouseover', hideCursor);
                                function hideCursor(){
                                    suitcaseInside.style.cursor = "none";
                                }
    //                            suitcaseInside.addEventListener('click', noLeave);
    //                            function noLeave(){
    //                                hint.textContent = "Let me stay in the elevator, just keep working";
    //                            }
                            }
                            let suitcasesToMove1 = document.querySelectorAll('.itemsToMove li'); //update suitcasesToMove value in the toMove array, especially index value
                            suitcasesToMove1.forEach(suitcaseClicked); //repeat the check of order and move top element
                            if (itemsInEle.length ==4){
                                checkIfBedIn();
                                function checkIfBedIn(){
                                    let bedXY = bed.getBoundingClientRect();
                                    if (bedXY.left >100) {
                                        setTimeout(everythingIn, 500);
                                    }
                                }
                            }
                        }
                    } else {
                        hint.textContent = "You don't have enough strenge to move me now. Please wait and recover. Be Patient!";
                    }
                }
            }
        }
    }
    // move the bed
    bedImg.addEventListener('click', checkIfAlreadyInElevator);
    function checkIfAlreadyInElevator(){
        let bedPosition = bed.style.transform;
        if (!bedPosition){ // only after the bed is moved, will it have a transform attribute, so ! is for the case that user hasn't touch the bed yet // another way to check bed's position see line 91
            areYouSure();
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
                    hint.textContent = "nice work~";
                    bed.style.transform = "translate(228px, -77px)";
                    bed.addEventListener('transitionend', tiltBed);
                    function tiltBed(){
                        bed.removeEventListener('animationend',moveBed);
                        bed.style.transition = "all .2s";
                        bed.style.transform = "translate(228px, -77px) rotate(17deg)";
                    };
                    // lose blood while moving bed
                    let loseBloodBytime = setInterval(loseSomeBlood, 40);
                    let interval = 1;
                    function loseSomeBlood(){
                        if (currentBlood >3){
                            currentBlood -=3;
                            interval ++;
                            if (interval == 50){ // bed move for 2s, so display blood lost also in 2s, 40*50=2000ms
                                clearInterval(loseBloodBytime);
                                checkIfSuitcasesIn();
                                function checkIfSuitcasesIn(){
                                    let itemsInEle = document.querySelectorAll('.itemsInside li');
                                    if (itemsInEle.length ==4){
                                        hint.textContent = "Thank you! It's the right order to move the stuff and you didn't push yourself too hard. Congras and you get to take the elevator as well~";
                                        setTimeout(everythingIn2, 2000);
                                        function everythingIn2(){
                                            halfDoor.forEach(shut);
                                            function shut(hD){
                                                hD.style.transform = "rotateY(180deg)";
                                            }
                                            ulInside.style.transform = "translateY(-400px)"; // stuff in the elevator rises
                                            ulInside.style.transition = "all 1s ease-in";
                                        }
                                    }
                                }
                            }
                        } else { // not enough blood for moving the bed
                            clearInterval(loseBloodBytime);
                            humanR.style.transform ="translate(-400px, 117px) rotateX(87deg)"; // human down
                            gameOverSound.play();
                            setTimeout(hintDead, 500);
                            function hintDead(){
                                hint.textContent = "Sorry, you worked too hard...You should have waited in order to recover more before you decided to move the bed. I told you that you need to be careful with the moving...  Refresh page to start over~ Be patient this time and see what happens~";
                            }
                            blood.style.display = "none"; // cuz dead
                            scene.style.pointerEvents = "none"; // so that after death no click will trigger anything
                            interval = 51; // so that the success alternative doesn't show up
                        }
                    }
                }
//                let no = document.querySelectorAll('span')[1];
//                no.addEventListener('click', hideAsk);
//                function hideAsk(){
//                    ask.className = "ask";
//                    hint.textContent = "fine, choose another stuff then"
//                }
            }
        } else {
            hint.textContent = "you want to take me out again? I won't leave! Just keep moving..";
        }
    }
    setInterval(recover, 100);
    function recover(){
        if (currentBlood < 170){
            currentBlood += 0.2;
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
        hint.textContent = "I've got what I need and I can't wait for you to get in the elevator. It's not smart to just throw the suitcases in. Now you can take the stairs yourself. See you on the 117th floor ~ ;)))";
        ulInside.style.transform = "translateY(-400px)";
        ulInside.style.transition = "all 1s ease-in";
        human.style.display = "inherit";
        humanL.style.display = "none";
        humanR.style.display = "none";
        setTimeout(enlarge, 4000);
        function enlarge(){
            strengthLevel.textContent = "angry level";
            blood.style.backgroundColor = "red";
            human.style.transform = "scale(2)";
            human.style.transition = "all 3s ease-in";
            currentBlood += 10;
            blood.style.transform = "scale(2)";
            hint.style.transform = "scale(.7)";
            hint.style.transition = "all 3s ease-in";
        }
    }
}
