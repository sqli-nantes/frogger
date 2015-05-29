#Evol SQLI#

## Installation : 
1. Avoir NodeJS d'installé !
2. Dans le répertoire, lancer en ligne de commande ```npm install```
3. Toujours en ligne de commande : ```gulp less```

## Lancement : 
2 options : 
* ```node server.js``` : aller dans son navigateur sur l'url http://localhost:8080
* ```gulp serve``` : Votre navigateur doit s'ouvrir sur l'url http://localhost:3000

Il faut ensuite avoir un smartphone et depuis le mobile aller sur la page : 
* http://[L'ADRESSE_IP_DE_MON_PC_SUR_LE_RESEAU]:8080/index_phone.html
* ou * http://[L'ADRESSE_IP_DE_MON_PC_SUR_LE_RESEAU]:3000/index_phone.html en fonction du lancement choisit

## Instructions
Pour se déplacer dans le jeu : 
Il faut que le téléphone soit droit (écouteur en haut) et orienté vers l'écran du pc
* Vous avez la possibilité de vous identifier avec un login sur le téléphone (on rentre le login et on clique sur valider)
* Sauter avec le téléphone => on fait monter la grenouille
* Swype vers gauche sur l'écran du téléphone => on fait se déplacer la grenouille sur la gauche
* Swype vers la droite sur l'écran du téléphone => on fait se déplacer la grenouille sur la droite.
* Le bouton son vous permet d'activer / désactiver la musique 
* Le bouton refresh vous permet de relancer une partie quand vous avez perdu



#Frogger#
[Play it here](http://natetarrh.com/frogger/).

A working version of Frogger playable in the browser, implemented with JavaScript.

All basic scoring methods are present, and the player recieves an additional life when 10,000 points are scored with fewer than 4 frogs left. Frogger moves on canvas using UP, DOWN, LEFT, and RIGHT arrow keys. If frogger collides with a vehicle or water, he loses a life. 

A leveling system is included that speeds up the cars after 5 frogs have been jumped home.
