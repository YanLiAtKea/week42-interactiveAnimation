let itemsToMove = document.querySelectorAll('.itemsToMove li');
let ulToMove = document.querySelector('ul.itemsToMove');
let ulInside = document.querySelector('ul.itemsInside');

let hint= document.querySelector('.hint p');
itemsToMove.forEach(clicked);
function clicked(li, index){
    li.addEventListener('click', checkIndexAndMove);
    function checkIndexAndMove(){
        if (index !=0){
            hint.textContent = "you can't move me";
            li.style.backgroundColor = "black";
        } else if(index ==0) {
            ulInside.appendChild(li);
            li.style.backgroundColor ="transparent";
            let itemsToMove = document.querySelectorAll('.itemsToMove li');
            itemsToMove.forEach(clicked);
            itemsToMove.forEach(changeToBlank);
            function changeToBlank(li){
                li.style.backgroundColor = "transparent";
            }
            hint.textContent =" ";
        }
    }
}
