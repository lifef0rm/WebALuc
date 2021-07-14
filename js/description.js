var nomVariable;
var detailsAL;
var indAlTrouvee = "Non";

afficherAL();

function obtenirVariableUrl(variableAObtenir) {
  var requete = window.location.search.substring(1);
  var variablesUrl = requete.split("&");
  var i, paire;
  for (i = 0; i < variablesUrl.length; i++) {
    paire = variablesUrl[i].split("=");
    if (paire[0] == variableAObtenir) {
      return paire[1];
    }
  }
  return ("");
}

function chercherAl(argument, colonne) {
  for (var i = 0; i < tableAventuresLabs.length; i++) {
    detailsAL = tableAventuresLabs[i];
    if (detailsAL[colonne] == argument) {
      indAlTrouvee = "Oui";
      break;
    }
  }
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

function afficherAL() {
  var argumentUrl = obtenirVariableUrl("al");
  if (argumentUrl != "") {
    nomVariable = "Slug";
    chercherAl(argumentUrl, 2);
  } else {
    argumentUrl = obtenirVariableUrl("id");
    if (argumentUrl != "") {
      nomVariable = "Identifiant";
      chercherAl(argumentUrl, 3);
    } else {
      var messErreur = '<br><p class="messageSuivi cadreFondRouge"><strong>Erreur</strong><br />Slug ou identifiant manquant dans l\'URL</p>';
      document.getElementById("paragrapheResultat").innerHTML = messErreur;
      return false;
    }
  }

  if (indAlTrouvee == "Non") {
    var messErreur = '<br><p class="messageSuivi cadreFondRouge"><strong>Erreur</strong><br />'
      + nomVariable
      + ' inexistant dans la table des Aventures Labs</p>';
    document.getElementById("paragrapheResultat").innerHTML = messErreur;
    return false;
  }

  var datePublicationAL = detailsAL[0];
  var titreAL           = detailsAL[1];
  var slugAL            = detailsAL[2];
  var idAL              = detailsAL[3];
  var nomProprioAL      = detailsAL[4];
  var idProprioAL       = detailsAL[5];
  var latitudeAL        = detailsAL[6];
  var longitudeAL       = detailsAL[7];
  var coordonneesGpsAL  = detailsAL[8];
  var nbEtapesAL        = detailsAL[9];
  var typeParcoursAL    = detailsAL[10];
  var urlAL             = detailsAL[11];
  var descriptionAL     = detailsAL[12];
  var urlImageAL        = detailsAL[13];
  var codeCacheBonusAL  = detailsAL[14].trim();
  var titreCacheBonusAL = detailsAL[15];

  titreAL       = titreAL.replace(/&#34;/g, '"');
  titreAL       = titreAL.replace(/&#39;/g, "'");
  descriptionAL = descriptionAL.replace(/&#34;/g, '"');
  descriptionAL = descriptionAL.replace(/&#39;/g, "'");

  var htmlBonusAL = "";
  if (codeCacheBonusAL != "") {
    htmlBonusAL = '<br />Cache Bonus : <a href="https://coord.info/' + codeCacheBonusAL + '" target="_blank" title="' + titreCacheBonusAL + '">' + codeCacheBonusAL + '</a>';
  }

  var brHTML = "<br \/>";
  var contenuHTML   = '<div class="cadreGlobalAventure">'
    + '<div class="cadreImageEtTitreAL" style="background-image: url(' + urlImageAL + ');">'
    + '<div class="titreImageAL">'
    + titreAL
    + '</div>'
    + '</div>'
    + '<div class="cadreDescriptionAventure">'
    + '<div class="titreCentre">'
    + titreAL
    + '</div>'
    + '<div class="sommaireCentre">'
    + coordonneesGpsAL
    + brHTML + '(' + latitudeAL + ', ' + longitudeAL + ')'
    + brHTML + 'Aventure ' + typeParcoursAL.toLowerCase() + ' en ' + nbEtapesAL + ' étapes'
    + brHTML + 'Publiée ' + formatterDate(datePublicationAL)
    + brHTML + 'Par <a href="https://www.geocaching.com/p/default.aspx?guid=' + idProprioAL + '" target="_blank" title="Profil de ' + nomProprioAL + ' sur geocaching.com">' + nomProprioAL + '</a>'
    + htmlBonusAL
    + '</div>'
    + '<div class="barreHorizontaleBoutons">'
    + '<a href="' + urlAL + '" target="_blank" title="Page Groundspeak et code QR de l\'Aventure Lab"><button class="boutonAction"><img src="images\/code-qr.png"><span class="masquerSurMobile">&nbsp;Code QR<\/span><\/button><\/a>&nbsp;&nbsp;'
    + '<a href="https://www.geocaching.com/map/default.aspx#?ll=' + latitudeAL + ',' + longitudeAL + '&amp;z=14" target="_blank" title="Carte des caches du secteur sur geocaching.com"><button class="boutonAction"><img src="images\/geo-map.png"><span class="masquerSurMobile">&nbsp;Geocaching Map<\/span><\/button><\/a>&nbsp;&nbsp;'
    + '<a href="http:\/\/maps.google.com\/maps?q=' + latitudeAL + ',' + longitudeAL + '" target="_blank" title="Position du pointeur sur Google Maps"><button class="boutonAction"><img src="images\/google-maps.png"><span class="masquerSurMobile">&nbsp;Google Maps<\/span><\/button><\/a>'
    + '</div>'
    + '<hr class="hr1">'
    + '<strong>Description</strong>'
    + brHTML
    + brHTML + descriptionAL
    + brHTML
    + brHTML
    + '<div class="cadreCarteAL" style="background-image: url(captures/' + slugAL + '.jpg);"></div>'
    + '<div class="basDePageCentre">Source : <span class="insecable"><a href="https:\/\/webaluc.com\/aventures-labs-quebec\/" target="_blank" title="Les Aventures Labs du Québec">Les Aventures Labs du Qu&eacute;bec<\/a><\/span><\/div>'
    + '</div>'
    + '</div>';
  document.getElementById("paragrapheResultat").innerHTML = contenuHTML;
}