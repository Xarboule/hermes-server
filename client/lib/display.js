/**
 * Created by xarboule on 24/04/17.
 * change le surlignage en bleu du menu de gauche en fonction de la page chargée
 */

function setPage(string){
    console.log("Page choisie : "+string);
    var elements = document.getElementsByClassName("w3-blue");
    elements[0].classList.remove("w3-blue");
    document.getElementById(string).classList.add("w3-blue");

}