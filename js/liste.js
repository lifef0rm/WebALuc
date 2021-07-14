var distanceEnKm, distanceEnTexte, posDiv, valLL, valLat, valLon, valRayon;
var masqueFormatNumerique = /^\d+$/;
var testFormatNumerique;
var masqueFormatNumeriqueAvecDecimale = /^-?[0-9]\d*(\.\d+)?$/;
var testFormatNumeriqueAvecDecimale;
var messageAlerte = "";

document.getElementById("dateMAJ").innerHTML = "(MAJ : " + dateMAJ + ")";
document.getElementById("toutQc").checked    = true;
genererListeAL();

function afficherOuMasquerOptionsListe(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

function activerOptionsRayon() {
  var x = document.getElementById("optionsRayon");
  x.className = x.className.replace(" inactif", "");
}

function deactiverOptionsRayon() {
  var x = document.getElementById("optionsRayon");
  if (x.className.indexOf("inactif") == -1) {
    x.className += " inactif";
  }
}

function afficherAlerte(valMessageAlerte) {
  document.getElementById("cadreListeAL").style.display   = "none";
  document.getElementById("idMessageAlerte").innerHTML    = valMessageAlerte;
  document.getElementById("idAlerteModale").style.display = "block";
}

function masquerAlerte() {
  document.getElementById("idAlerteModale").style.display="none";
  document.getElementById("idMessageAlerte").innerHTML = "";
}

function geolocaliserLatLon() {
  masquerAlerte();
  window.navigator.geolocation.getCurrentPosition(afficherGeolocation, erreurGeolocation);
}

function afficherGeolocation(position) {
  document.getElementById('idLL').value = position.coords.latitude
    + ", "
    + position.coords.longitude;
}

function erreurGeolocation() {
  afficherAlerte("Géolocalisation non autorisée ou non prise en charge.");
}

function validationSommaireDonneesSaisies() {
  masquerAlerte();
  messageAlerte = "";
  valLL     = document.getElementById("idLL").value.trim();
  valRayon  = document.getElementById("idRayon").value.trim();

  // Validation sommaire de la latitude et de la longitude
  if (valLL == "") {
    messageAlerte = "Latitude et longitude&nbsp;: Valeurs requises";
    return false;
  }
  valLL = valLL.replace(/,/g, " ");
  posDiv = valLL.indexOf(" ");
  valLat = valLL.substring(0, posDiv);
  valLon = valLL.substring(posDiv+1, valLL.length);
  if (valLat == "" || valLon == "") {
    messageAlerte = "La latitude et la longitude doivent être séparées par une virgule et/ou un espace";
    return false;
  }
  valLat = valLat.trim();
  valLon = valLon.trim();
  testFormatNumeriqueAvecDecimale = masqueFormatNumeriqueAvecDecimale.test(valLat);
  if (!testFormatNumeriqueAvecDecimale) {
    messageAlerte = "Le format de la latitude est invalide<br>Format requis&nbsp;: Degrés.Décimales<br>Exemple&nbsp;: 46.809916";
    return false;
  }
  testFormatNumeriqueAvecDecimale = masqueFormatNumeriqueAvecDecimale.test(valLon);
  if (!testFormatNumeriqueAvecDecimale) {
    messageAlerte = "Le format de la longitude est invalide<br>Format requis&nbsp;: Degrés.Décimales<br>Exemple&nbsp;: -71.184750";
    return false;
  }

  // Validation sommaire du rayon en km
  if (valRayon == "") {
    messageAlerte = "Rayon en km&nbsp;: Valeur requise";
    return false;
  }
  testFormatNumerique = masqueFormatNumerique.test(valRayon);
  if (!testFormatNumerique) {
    messageAlerte = "Rayon en km&nbsp;: Une valeur numérique est requise";
    return false;
  }
  if (valRayon < 1) {
    messageAlerte = "Rayon en km&nbsp;: Valeur minimale requise = 1";
    return false;
  }
}

function deg2rad(deg) {
  return (deg * Math.PI)/180
}

function calculerDistanceEnKm(lat1, lng1, lat2, lng2) {
  var R = 6371;   // Rayon de la terre en km 
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lng2-lng1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;  // Distance en km 
  return d.toFixed(1);
}

function filtrerLaListeDesAL() {
  var filtreSaisi, filtre, table, tr, i, contenuLigne;
  filtreSaisi = document.getElementById("monFiltre");
  filtre = filtreSaisi.value.toUpperCase();
  table = document.getElementById("tableDesAL");
  tr = table.getElementsByClassName("ligneAL");
  for (i = 0; i < tr.length; i++) {
    tr[i].classList.remove("itemVisible");
    contenuLigne = tr[i].getElementsByTagName("td")[0].textContent + ", " + tr[i].getElementsByTagName("td")[1].textContent;
    if (contenuLigne.toUpperCase().indexOf(filtre) > -1) {
      tr[i].style.display = "";
      tr[i].className += " itemVisible";
    } else {
      tr[i].style.display = "none";
    }
  }
  document.getElementById("compteurAL").innerHTML = document.getElementsByClassName("itemVisible").length;
}

function genererListeAL() {
  if (document.getElementById("rayonPz").checked == true) {
    validationSommaireDonneesSaisies();
    if (messageAlerte != "") {
      afficherAlerte(messageAlerte);
      return false;
    }
  }

  var i, detailsAL, htmlThImage, htmlTdImage, htmlBonusAL, contenuHtmlListeAL, libelleImageModale;
  var nbAL           = tableAventuresLabs.length;
  var lignesHtmlAL   = "";
  var classesBoutons = "boutonAction w3-button oc-survol-gris-pale w3-ripple w3-padding-small w3-left-align w3-block";

  // Variables des Aventures Labs
  var datePublicationAL,
    titreAL,
    slugAL,
    idAL,
    nomProprioAL,
    idProprioAL,
    latitudeAL,
    longitudeAL,
    coordonneesGpsAL,
    nbEtapesAL,
    typeParcoursAL,
    urlAL,
    descriptionAL,
    urlImageAL,
    codeCacheBonusAL,
    titreCacheBonusAL;

  for (i = 0; i < nbAL; i++) {
    detailsAL = tableAventuresLabs[i];

    // Ignorer les Aventures Labs non actives
    if (detailsAL[16] != "") {
      continue;
    }

    distanceEnTexte   = "";
    latitudeAL        = detailsAL[6];
    longitudeAL       = detailsAL[7];

    if (document.getElementById("rayonPz").checked == true) {
      distanceEnKm    = calculerDistanceEnKm(valLat, valLon, latitudeAL, longitudeAL);
      distanceEnTexte = " <span class='insecable'>(" + distanceEnKm.replace(".", ",") + " km)<\/span>";
      if (distanceEnKm*1000 > valRayon*1000) {
        continue;
      }
    }

    datePublicationAL = detailsAL[0];
    titreAL           = detailsAL[1];
    slugAL            = detailsAL[2];
    idAL              = detailsAL[3];
    nomProprioAL      = detailsAL[4];
    idProprioAL       = detailsAL[5];
    coordonneesGpsAL  = detailsAL[8];
    nbEtapesAL        = detailsAL[9];
    typeParcoursAL    = detailsAL[10];
    urlAL             = detailsAL[11];
    descriptionAL     = detailsAL[12];
    urlImageAL        = detailsAL[13];
    codeCacheBonusAL  = detailsAL[14].trim();
    titreCacheBonusAL = detailsAL[15];

    if (document.getElementById("idCheckImageAL").checked == true) {
      libelleImageModale = titreAL.replace(/&#39;/g, "\\'");
      htmlTdImage = '<td class="colonneVignette w3-hide-small">'
        + '<div class="cadreVignette" style="background-image: url('
        + urlImageAL
        + ');" onclick="afficherFenetreModale(\''
        + urlImageAL
        + "', '"
        + libelleImageModale
        + '\')"></div><\/td>';
    } else {
      htmlTdImage = '';
    }

    if (codeCacheBonusAL == "") {
      htmlBonusAL = '';
    } else {
      htmlBonusAL = 'Cache Bonus&nbsp;: <a href="https://coord.info/' + codeCacheBonusAL + '" target="_blank" title="' + titreCacheBonusAL + '">' + codeCacheBonusAL + '</a><br>';
    }

    lignesHtmlAL = lignesHtmlAL
      + '<tr class="ligneAL itemVisible">'
      + htmlTdImage
      + '<td class="colonneDescription">'
      + '<b>' + titreAL + '<\/b>'
      + distanceEnTexte + '<br>'
      + '<span class="insecable">' + coordonneesGpsAL + '<\/span> '
      + '<span class="insecable">(' + latitudeAL + ', ' + longitudeAL + ')<\/span><br>'
      + 'Aventure ' + typeParcoursAL.toLowerCase() + ' en ' + nbEtapesAL + ' étapes<br>'
      + 'Publiée ' + formatterDate(datePublicationAL) + '<br>'
      + 'Par <a href="https:\/\/www.geocaching.com\/p\/default.aspx?guid=' + idProprioAL + '" target="_blank" title="Profil de ' + nomProprioAL + ' sur geocaching.com">' + nomProprioAL + '<\/a><br>'
      + htmlBonusAL
      + '<\/td>'
      + '<td class="colonneAction" style="width: 1px">'
      + '<a href="description.htm?al=' + slugAL + '" target="_blank" title="Description de l\'Aventure Lab"><button class="' + classesBoutons + '"><img src="images\/info.png"><span class="w3-hide-small">&nbsp;Description<\/span><\/button><\/a>'
      + '<a href="' + urlAL + '" target="_blank" title="Page Groundspeak et code QR de l\'Aventure Lab"><button class="' + classesBoutons + '"><img src="images\/code-qr.png"><span class="w3-hide-small">&nbsp;Code QR<\/span><\/button><\/a>'
      + '<a href="https://www.geocaching.com/map/default.aspx#?ll=' + latitudeAL + ',' + longitudeAL + '&amp;z=14" target="_blank" title="Carte des caches du secteur sur geocaching.com"><button class="' + classesBoutons + '"><img src="images\/geo-map.png"><span class="w3-hide-small">&nbsp;Geocaching Map<\/span><\/button><\/a>'
      + '<a href="http:\/\/maps.google.com\/maps?q=' + latitudeAL + ',' + longitudeAL + '" target="_blank" title="Position du pointeur sur Google Maps"><button class="' + classesBoutons + '"><img src="images\/google-maps.png"><span class="w3-hide-small">&nbsp;Google Maps<\/span><\/button><\/a>'
      + '<\/td>'
      + '<\/tr>';
  }

  if (document.getElementById("idCheckImageAL").checked == true) {
    htmlThImage = '<th class="colonneVignette w3-hide-small" style="text-align:center;">Vignette<\/th>';
  } else {
    htmlThImage = '';
  }

  contenuHtmlListeAL = '<h5 class="w3-left">Nombre d\'Aventures Labs affichées&nbsp;: <span id="compteurAL">' + nbAventuresLabsActives + '<\/span><\/h5>'
    + '<input class="w3-input w3-border" type="text" placeholder="Filtre" id="monFiltre" onkeyup="filtrerLaListeDesAL()">'
    + '<table class="w3-table w3-bordered" id="tableDesAL">'
    + '<tr>'
    + htmlThImage
    + '<th>Description<\/th>'
    + '<th style="text-align:center;">Action<\/th>'
    + '<\/tr>'
    + lignesHtmlAL
    + '<\/table>';

  document.getElementById("listeAL").innerHTML          = contenuHtmlListeAL;
  document.getElementById("compteurAL").innerHTML       = document.getElementsByClassName("itemVisible").length;
  document.getElementById("cadreListeAL").style.display = "";
}

document.addEventListener('DOMContentLoaded', function() {
  window.onscroll = function(ev) {
    document.getElementById("cRetour").className = (window.pageYOffset > 100) ? "cVisible" : "cInvisible";
  };
});

function defilerVersLeHaut() {
  document.body.scrollTop            = 0;
  document.documentElement.scrollTop = 0;
}

function afficherFenetreModale(urlImage, texteImage) {
  document.getElementById("imageAAfficher").src          = urlImage;
  document.getElementById("texteAAfficher").innerHTML    = texteImage;
  document.getElementById("fenetreModale").style.display = "block";
  document.getElementById("cRetour").style.display       = "none";
}

function fermerFenetreModale() {
  document.getElementById("fenetreModale").style.display = "none";
  document.getElementById("cRetour").style.display       = "";
}