if (window.location.href == "http://webaluc.com/aventures-labs-quebec/liste.htm") {
  location.replace("https://webaluc.com/aventures-labs-quebec/liste.htm")
}

genererBarreMenu();

function genererBarreMenu() {
  document.getElementById("barreMenu").innerHTML = '<a href="carte.htm" class="w3-button oc-bouton-menu" title="Carte des Aventures Labs du Québec"><img src="images/carte.svg"><\/a>'
    + '<a href="liste.htm" class="w3-button oc-bouton-menu" title="Liste des Aventures Labs du Québec"><img src="images/liste.svg"><\/a>'
    + '<a href="a-propos.htm" class="w3-button oc-bouton-menu" title="À propos de la carte et de la liste des Aventures Labs du Québec"><img src="images/info.svg"><\/a>'
    + '<a href="index.htm" class="w3-button oc-bouton-menu" title="Accueil - Les Aventures Labs du Québec"><img src="images/accueil.svg"><\/a>';
}

function formatterDate(dateAFormater) {
  var aaaa   = dateAFormater.substr(0, 4);
  var mm     = dateAFormater.substr(5, 2);
  var jj     = dateAFormater.substr(8, 2);
  var dateJS = new Date(aaaa, mm - 1, jj);
  var dateFormattee = dateJS.toLocaleString("fr-CA", { dateStyle: 'long' });
  dateFormattee = dateFormattee.replace(/^1 /, '1er ');
  dateFormattee = dateJS.toLocaleString("fr-CA", { weekday: 'long' }) + " le " + dateFormattee;
  return dateFormattee;
}
