# Resum de fases — naio.

Última actualització: 9 de novembre de 2026 (textos del vídeo inicial, icones més netes i colors més suaus; les quatre fases estan fetes)

Aquest document explica, en paraules senzilles, què s'ha fet a l'app, què falta i què necessito de tu. S'actualitza cada vegada que s'acaba una fase.

## Com provar l'app al mòbil

1. Obre el terminal de Codespaces i escriu: `npm start`
2. Espera que surti el codi QR (tarda un minut, més o menys).
3. Escaneja'l: a l'iPhone amb l'app **Càmera**; a Android amb **Expo Go → Scan QR code**.
4. Per tornar a carregar l'app després d'un canvi, prem `r` al terminal. Per aturar-ho, prem `Ctrl + C`.

Important: cada vegada que es torna a carregar, l'app comença de zero (al vídeo inicial) i s'oblida del perfil. Encara no es guarda res.

## 1. FET FINS ARA

### Fase 1 — La base, el vídeo inicial i el registre (pantalles 01–08)

**Què he construït**

- El projecte de l'app (React Native + Expo), preparat per funcionar amb Expo Go.
- L'estil de l'app: els colors de les teves imatges (crema, terracota, préssec…), la lletra amb serifa per als títols (Source Serif 4) i la lletra normal per a la resta (DM Sans).
- Les peces que es repeteixen a tota l'app: botons, etiquetes, targetes, camps de text, botó d'enrere, capçaleres i la barra de baix amb el «+» gran al mig.
- Les dades de prova (gent i plans d'Atenes) en un sol lloc, perquè més endavant es puguin canviar per una base de dades real (Supabase) sense tocar les pantalles.
- Els fitxers de regles del projecte (`CLAUDE.md`) i del pla (`PLAN.md`).

**Pantalles a punt**

- 01–05: el vídeo inicial (el «reel») de 5 diapositives.
- 06: «Let’s get you out there.» (registre).
- 07: entrar amb Apple. 08: entrar amb Google.

**Què has de comprovar al mòbil**

- Les diapositives passen soles cada 5 segons, amb barres de progrés a baix.
- Si toques la dreta avances, si toques l'esquerra tornes enrere, i si mantens el dit, s'atura.
- «Skip» i «Get started» porten al registre.
- Apple: el botó «Hide my email» canvia entre el correu privat i el teu correu real.
- Si escrius un correu mal escrit, surt «Add a valid email to continue.»

**Decisions que vaig prendre jo**

- Les franges d'edat a les dades de prova es van corregir a les permeses (Maya 25-30, Leo 31-39). La pantalla 42 posava «29–35» per a l'Alicia; mostrarà 25-30.
- La marca s'escriu sempre «naio.», mai «NAIO».
- El logo de Google és una «G» blava d'un sol color, no la de quatre colors.
- Per obrir l'app al mòbil faig servir `npm start` amb «ngrok», perquè la versió nova d'Expo demana un compte per a l'opció normal.

### Fotos del vídeo inicial

**Què he fet**

- Les 5 fotos que vas posar a `assets/Reel` ara són el fons de les diapositives, amb una capa fosca a sobre perquè el text blanc es llegeixi bé.
- Les fotos originals pesaven uns 25 MB cadascuna (120 MB en total). N'he fet còpies lleugeres de mida de mòbil: 1,7 MB en total, i es veuen igual de bé. Les còpies són a `assets/images/reel/` (01.jpg a 05.jpg). Les originals no s'han tocat.
- Les 5 fotos es carreguen a l'inici, perquè la següent mai aparegui en blanc.

**Què has de comprovar al mòbil**

- Diapositiva 1: la noia sota l'Acròpolis. 2: l'esmorzar entre amics. 3: l'excursió a la muntanya. 4: les copes a la posta de sol. 5: la festa de nit.
- La part de dalt de la foto és clara i la de baix més fosca, i els textos es llegeixen bé.

### Fase 2 — El perfil, la benvinguda i els filtres (pantalles 09–24)

**Pantalles a punt**

- 09: «Your profile» (la llista de coses per completar).
- 10: la comprovació de la cara («Show us it’s really you»).
- 11: triar la franja d'edat. 12: «Verify your range». 13: «Add your ID». 14: la càmera per fotografiar el document (de fons fosc). 15: pujar la foto del document.
- 16: els idiomes que parles. 17: el nivell de cada idioma.
- 18: els teus interessos (de 3 a 8).
- 19: la teva situació (opcional).
- 20: la vista prèvia del teu perfil.
- 21: «Welcome to Athens.» (passa sola al cap de 3 segons).
- 22: «What are you up to?» (a sobre del mapa).
- 23–24: els filtres (distància, estat d'ànim, idioma, quan).

**Què has de comprovar al mòbil**

- A «Your profile» el nom ja surt posat («Alicia»). El botó de baix queda pàl·lid fins que ho completes tot.
- Foto: «Take photo» fa una animació de comprovació i torna enrere; el cercle mostra una «A» amb un tic verd.
- Edat: tries la franja, tries el document, fas o puges la foto del document i prems «Verify my age». Després el camp diu «✓ Verified by ID».
- Idiomes: n'has de triar almenys un i posar-los nivell. Un ha de ser «Native».
- Interessos: entre 3 i 8.
- «Review profile» → vista prèvia → «Create profile» → benvinguda → mapa amb «What are you up to?».
- Als filtres, «Apply filters» els guarda i «Reset» els esborra.

**Pantalla nova que no era als dissenys**

- «+ Add more about you», a la pantalla 09: tres camps opcionals (About me, d'on ets i la teva situació). El que hi escriguis surt a la vista prèvia (20).

**Decisions que vaig prendre jo**

- Com que la foto és de mentida, el perfil mostra la teva inicial sobre un cercle terracota en lloc d'una foto real.
- A la pantalla 20 no hi ha la roda de «Settings», perquè aquesta pantalla arriba a la Fase 4.
- A la comprovació de la cara, les tres comprovacions comencen en gris i es posen verdes una a una.
- Els filtres comencen buits (el disseny mostrava opcions marcades d'exemple).
- Els textos són una mica més grans que a les imatges, perquè es llegeixin bé en un mòbil real.

### Fase 3 — El mapa i apuntar-se a plans (pantalles 25–28, 35, 36 i «Request sent»)

**Pantalles a punt**

- 25: el mapa d'Atenes amb els plans, la gent disponible i el teu punt blau («You · approximate»).
- 26: la targeta d'un pla quan el toques al mapa.
- 27: els detalls del pla.
- 28: la targeta d'una persona disponible (per exemple, la Maya).
- «Request sent» («Nearly there.»): pantalla nova, no era als dissenys.
- 35: «You’re in.»
- 36: «Manage group» (només per als plans que organitzes tu).
- El xat encara no hi és (arriba a la Fase 4); de moment surt una pàgina d'avís.

**Què has de comprovar al mòbil**

- Al mapa veus pins verds («Now», «Today 6 PM», «Tomorrow 10 AM»…), la Maya i el Daniel com a «disponibles», i un pin terracota per al teu pla («Your plan · 7:30 PM»).
- Toca «Today 6 PM» (Sunset drinks): surt una targeta amb «Join plan» i «View details». Es tanca amb la creu o tocant el mapa.
- «Join plan» → «Nearly there.»: la Nora (l'organitzadora) té la teva sol·licitud, i el xat i el punt exacte de trobada surten tancats amb un cadenat. **Al cap d'uns 5 segons** passa sol a «You’re in.» i ja es veu el punt exacte (Lycabettus entrance).
- Si prems «Cancel request» abans dels 5 segons, no es comparteix res.
- Toca la Maya: «Maya, 25-30», els seus interessos i idiomes, i un avís que no li pots escriure directament.
- Toca el teu pla → «Manage group» → «Remove» al costat d'algú: et pregunta «Remove Leo?» i, si confirmes, surt un missatge verd.
- Els filtres ja funcionen. Per exemple, si només tries «Spanish», al mapa queda només el sopar de meze (i el teu pla).

**Decisions que vaig prendre jo**

- El mapa és un dibuix d'Atenes, no un mapa real de Google o d'Apple. És gratuït i no fa servir cap servei extern.
- L'app fa servir un rellotge de prova: sempre pensa que és avui a les 4:18 de la tarda, perquè els plans semblin propers a qualsevol hora que ho provis. (A la Fase 3 eren les 4:00; a la Fase 4 ho vaig canviar a les 4:18 perquè el xat quadri amb el disseny: «Meet in 1h 42m».)
- «Coffee and a wander?» és un pla teu, ja preparat, perquè puguis provar les pantalles d'organitzador. A la Fase 4 el vaig ajustar per quadrar amb els dissenys: avui a les 5:00 PM a Monastiraki, amb la Maya i la Nora, i el Leo hi ha demanat entrar.
- A la targeta de la Maya, l'edat surt com a 25-30 (el disseny deia 29-35). El text diu «them/they» en lloc de «her/she», perquè la mateixa targeta serveix per a tothom.
- Sunset drinks l'organitza la Nora i la Maya només hi va, perquè quadri amb «Maya hasn’t created a plan».

### Fase 4 — Crear plans, els teus plans, xat, avisos, perfil i seguretat (pantalles 29–34 i 37–44)

**Pantalles a punt**

- 29: «Create a plan» (s'obre amb el «+» gran). 30: «Plan posted.» 31: el teu pla, amb «You’re hosting this plan.».
- 32: «Edit plan». 33: cancel·lar el pla («Cancel … ?»). 34: «Plan cancelled.».
- 37: «My plans», amb tres pestanyes: Upcoming, Requests i Past.
- 38: el xat temporal del pla.
- 39: «Notifications» (la pestanya Alerts). 40–41: la sol·licitud del Leo per entrar al teu pla, amb «Decline» i «Accept».
- 42: el teu perfil (pestanya Profile). 43: «Settings». 44: «Safety centre».
- Pantalles petites de Settings: «Location visibility», «Notifications» (amb interruptors) i «Terms & privacy».
- Pantalles de seguretat: «Report» (denunciar una persona o un pla) i «Block someone» (bloquejar algú).

**Pantalles noves que no eren als dissenys**

- Les pestanyes **Upcoming** i **Requests** de «My plans». Upcoming: els plans on vas, amb una etiqueta («Your plan», «You’re in», «Request sent»). Requests: qui vol entrar als teus plans i les sol·licituds que has enviat tu.
- **Blocked people**: la llista de persones bloquejades, amb «Unblock».
- També: «Report», «Block someone» i les tres pantalletes de Settings, en el mateix estil.

**Què has de comprovar al mòbil**

- A la barra de baix surten números petits: **Alerts 2** (avisos sense llegir) i **Plans 1** (el Leo espera resposta).
- **Alerts**: «Leo asked to join your plan» → el perfil del Leo (els interessos que teniu en comú surten marcats) → **Accept** → «Leo has been accepted…» → «Open temporary chat».
- **Xat**: escriu alguna cosa i prem la fletxa. Al cap de 2 o 3 segons algú del grup et respon sol.
- **My plans**: a Upcoming hi ha el teu pla i la caminada de demà a Philopappou (ja hi ets acceptada). A Requests, el Leo. A Past, «Beach walk at Glyfada» (només informació, el xat ja està tancat).
- **Crear un pla**: prem el «+». Omple l'activitat, tria avui o demà i una hora, les places, l'idioma, la zona, el punt de trobada i l'estat d'ànim, i prem «Post plan» → «Plan posted.» → «View my plan». El pla surt al mapa en color terracota.
- **Editar i cancel·lar**: al teu pla, «Edit plan» → canvia alguna cosa → «Save changes». Després «Cancel plan» → «Yes, cancel plan» → «Plan cancelled.» → «Go to my plans». El pla desapareix del mapa i de les llistes.
- **Unir-te a Sunset drinks** (com a la Fase 3) i, quan t'acceptin, «Say hi in the chat»: veuràs la conversa del disseny (la Maya, el Leo, el Jonas) i «You joined the plan».
- **Profile** → roda dentada → **Settings**:
  - «Go offline & hide from map» posa una franja fosca al mapa («You’re offline…»), amb «Go online».
  - Si apagues els avisos de missatges, desapareixen d'Alerts.
- **Safety centre**:
  - «Block someone»: si bloqueges el Daniel, desapareix del mapa i surt a «Blocked people».
  - «Report a person or plan»: tries qui o què i el motiu, i surt «Thanks for telling us.».
  - «Share meetup details»: obre el menú de compartir del mòbil amb el teu proper pla.

**Decisions que vaig prendre jo**

- «Create a plan» té dos camps que no eren al disseny:
  - la **zona** (tothom la veu), separada del **punt de trobada exacte** (només el veuen les persones que acceptes). Així es compleix la norma de privacitat.
  - l'**estat d'ànim**, perquè el teu pla funcioni amb els filtres.
- A «Create a plan» només es poden triar hores d'avui (a partir d'ara) o de demà.
- **Comences ja acceptada** a «Morning walk on Philopappou» (demà), perquè hi hagi un xat amb missatges des del principi. Per això l'avís de missatge és de la Sofia d'aquest pla, i no de la Maya de Sunset drinks com al disseny.
- L'avís «A new nearby plan matches you» és de «Freddo in Koukaki» (el disseny deia «Street food», que no existeix a les dades de prova).
- **Al Leo l'edat li surt 31-39** (el disseny deia 29-35).
- **Plans passats:** el pla passat diu «Yesterday» en lloc de «18 Jul», perquè els plans només viuen avui i demà.
- **Avís d'emergència:** al Safety centre afegeixo «(112 in Greece)» a l'avís d'emergència, i el text diu «naio» en minúscula.
- **Pantalla del pla de mida:** «Create a plan» ara s'obre com una pàgina normal (amb la fletxa enrere), no com una finestra que puja des de baix, perquè coincideixi amb el disseny 29.
- **Pàgina provisional eliminada:** he tret la pàgina provisional «Coming in phase…», perquè ja no fa falta.

### Altres canvis

- He instal·lat petites actualitzacions d'Expo (correccions d'errors) perquè l'app segueixi funcionant amb Expo Go.
- 9 de novembre de 2026: he canviat els textos de les 5 diapositives del vídeo inicial pels que em vas donar (per exemple, «Go off script.»). A l'última, l'etiqueta de dalt és «GO WITH YOUR FLOW» i el títol «And have fun.» (amb la «A» majúscula). El disseny i l'estil no han canviat.
- Aquest document (`RESUM-FASES.md`) i la seva versió Word (`RESUM-FASES.docx`).
- **Icones més netes (9 de novembre de 2026):**
  - Totes les icones són ara del mateix estil: línia fina (Lucide), de la mateixa mida i gruix a tota l'app.
  - He tret els requadres, cercles i fons que tenien al voltant: ara surten directament sobre el fons, al costat del text. Només els botons de debò semblen botons.
  - Les icones són de color marró fosc o gris càlid, i de color de marca només quan són actives o les més importants (per exemple, la pestanya seleccionada).
  - Mantenen la forma només el «+» gran, les fotos de perfil (avatars) i els pins del mapa.
  - El botó d'enrere ara és una «‹» sense cercle a totes les pantalles.
  - Les icones grans de «You’re in», «Plan posted», «Plan cancelled» i «Request sent» són més grans que la resta, però sense cercle.
- **Colors més suaus i càlids (9 de novembre de 2026):** el groc mostassa es va provar i després es va canviar per una paleta més suau i harmoniosa:
  - **Color principal: terracota** `#C66337`, a tots els botons principals, el «+», la pestanya activa i el teu pin al mapa, amb el text en blanc. Cap botó és marró fosc.
  - **Superfícies suaus i lluminoses:** mantega `#FBEFD3` per als requadres d'informació i les bombolles del xat, préssec pàl·lid `#F8DED0` per a les etiquetes seleccionades, sorra `#EFDCCF` per a les vores.
  - **Detalls:** vores d'etiquetes en terracota clar `#E2A07C`, i etiquetes petites i enllaços en un terracota una mica més intens `#B05430` perquè es llegeixin bé.
  - **Text:** marró càlid `#43312A` (no gairebé negre), i gris càlid `#7D675B` per al text secundari.
  - La targeta fosca del Safety centre i la franja «You’re offline» ara són de terracota profund `#A84E30`, no marró fosc.
  - La pantalla «Welcome to Athens.» torna a ser terracota amb text blanc, com al disseny.
  - El botó «Get started» del vídeo inicial és de color préssec molt clar i suau.

- **Codi de colors del mapa (9 de novembre de 2026):**
  - Al mapa, el verd i el taronja tenen un significat i no canvien mai amb el tema.
  - **Verd** («Plan to join») per a tots els plans, també el teu, que es distingeix per l'estrella i el text «Your plan».
  - **Taronja** («Open to plans») per a les persones obertes a plans, com la Maya i el Daniel.
  - A dalt del mapa hi ha una petita llegenda amb els dos punts de color.
  - El disseny 25 no tenia aquesta llegenda: l'he fet seguint la teva descripció.

## 2. PROPERAMENT

Les quatre fases del pla estan fetes. No hi ha cap fase més planificada. Quan vulguis, podem decidir junts què ve ara. Algunes idees (cap no està decidida):

- Repassar l'app sencera amb tu i ajustar el que no t'agradi.
- Guardar el perfil al mòbil, perquè no calgui refer-lo cada vegada que es torna a carregar l'app.
- Més endavant, connectar-la a una base de dades real (Supabase), perquè els plans, els xats i els perfils siguin de debò i es comparteixin entre persones.
- Preparar-la per publicar-la a l'App Store i a Google Play. Això necessitaria comptes de desenvolupador, que són de pagament.

## 3. PENDENT

### El que necessito de tu

- **Git:** encara no he desat cap versió a git. Vols que en faci una amb tot el que hi ha fins ara?
- **Fotos originals del reel:** ocupen 120 MB dins del projecte i l'app no les fa servir. Et proposo treure-les del projecte (o dir a git que les ignori) abans de desar la versió. Em dius si et sembla bé?
- **Les decisions de les fases 3 i 4:** el rellotge de prova, el pla «Coffee and a wander?» com a teu, el mapa dibuixat i els camps nous de «Create a plan» (zona i estat d'ànim). Digues-me si en vols canviar alguna.
- **Textos legals:** les «Terms» i les «Safety Guidelines» encara no tenen text. A «Settings → Terms & privacy» de moment hi ha un resum curt fet per mi. Quan tinguis els textos de debò, me'ls pots passar.
- **Què fem ara:** com que les quatre fases estan fetes, digues-me què vols fer a continuació (mira «2. Properament»).
- **Fotos de perfil (opcional):** ara la gent surt amb la seva inicial en un cercle. Si vols fotos per a la Maya, el Leo, la Nora…, me les pots donar.

### El que és de mentida de moment

- **Entrar amb Apple, Google o correu:** és de prova. No es connecta enlloc i sempre entra com l'Alicia.
- **Comprovació de la cara i del document d'identitat:** són animacions. No es fa cap foto real ni es comprova res.
- **El mapa:** és un dibuix d'Atenes, no un mapa real, i la teva ubicació és fixa (a prop de Syntagma).
- **Acceptar sol·licituds:** l'organitzador «accepta» sol al cap de 5 segons.
- **L'hora:** l'app sempre pensa que és avui a les 4:18 de la tarda.
- **El xat:** només existeix dins del teu mòbil. Les respostes dels altres les escriu l'app sola.
- **Els avisos:** només surten dins de l'app, a la pestanya Alerts. No arriba cap notificació al mòbil.
- **Les denúncies i els bloquejos:** no s'envien enlloc. Només canvien el que veus a l'app.
- **Compartir el pla:** fa servir el menú de compartir del mòbil, i no passa per cap servei de naio.
- **Les dades:** la gent i els plans són inventats. El que fas (crear plans, acceptar el Leo, escriure al xat…) es manté mentre l'app està oberta, però si la tornes a carregar tot torna a començar. Més endavant es pot connectar a una base de dades real (Supabase).
