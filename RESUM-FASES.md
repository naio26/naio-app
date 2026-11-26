
# Resum de fases — naio.

Última actualització: 26 de novembre de 2026 (opcions A/B del marcador del teu pla, logo d'una sola mida, els teus plans en groc, Today turquesa, un sol taronja per a «Open to plans», una sola mida de títol, logo més petit, dia i hora en verd als plans on ets, quadre de ratlles de les persones en taronja, opció A triada, botó verd del xat a tot arreu, botó verd del xat, persones en taronja, llistes sense noms, colors definitius de My plans, fitxa de les persones en taronja, idiomes, àrea i missatge de «Create a plan», colors de My plans per tipus amb una sola regla, fitxa verda suau al mapa per als plans on ets, pantalles dels plans, grups de fins a 15 persones, diversos idiomes, «Leave plan», «Your plan» en verd, «(HOST)»; versió de prova v3 actualitzada)

Aquest document explica, en paraules senzilles, què s'ha fet a l'app, què falta i què necessito de tu. S'actualitza cada vegada que s'acaba una fase.

## Com provar l'app al mòbil

1. Obre el terminal de Codespaces i escriu: `npm start`
2. Espera que surti el codi QR (tarda un minut, més o menys).
3. Escaneja'l: a l'iPhone amb l'app **Càmera**; a Android amb **Expo Go → Scan QR code**.
4. Per tornar a carregar l'app després d'un canvi, prem `r` al terminal. Per aturar-ho, prem `Ctrl + C`.

Ara l'app guarda el teu progrés al mòbil: si la tornes a carregar, continua on eres (per exemple, al mapa). Per començar de zero, ves a Profile → ⚙️ Settings → «Reset demo».

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
- 21: en tocar «Create profile» surt l'avís de la ubicació i després «You're all set!» + «Welcome to Athens, (nom).» (abans era «Welcome to Athens.» sol, canviada el 19 de novembre de 2026: mira «Altres canvis»).
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
- **Crear un pla**: prem el «+». Omple l'activitat, tria avui o demà i una hora, les places, l'idioma, la zona, el punt de trobada i l'estat d'ànim, i prem «Post plan» → «Plan posted.» → «View my plan». El pla surt al mapa amb una estrella i el text «Your plan» (en verd, com tots els plans, des del 9 de novembre).
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
- **Versió desada a GitHub (9 de novembre de 2026):**
  - Tot el que hi ha fins ara està desat amb git i pujat a GitHub, a la branca `phases-1-4`: https://github.com/naio26/naio-app/tree/phases-1-4
  - Les 5 fotos originals del vídeo inicial (uns 120 MB) continuen a la carpeta `assets/Reel` del projecte, però git les ignora i no s'han pujat. L'app fa servir les còpies lleugeres.
- **Icones més netes (9 de novembre de 2026):**
  - Totes les icones són ara del mateix estil: línia fina (Lucide), de la mateixa mida i gruix a tota l'app.
  - He tret els requadres, cercles i fons que tenien al voltant: ara surten directament sobre el fons, al costat del text. Només els botons de debò semblen botons.
  - Les icones són de color marró fosc o gris càlid, i de color de marca només quan són actives o les més importants (per exemple, la pestanya seleccionada).
  - Mantenen la forma només el «+» gran, les fotos de perfil (avatars) i els pins del mapa.
  - El botó d'enrere ara és una «‹» sense cercle a totes les pantalles.
  - Les icones grans de «You’re in», «Plan posted», «Plan cancelled» i «Request sent» són més grans que la resta, però sense cercle.
- **Colors més suaus i càlids (9 de novembre de 2026):** el groc mostassa es va provar i després es va canviar per una paleta més suau i harmoniosa:
  - **Color principal: terracota** `#C66337`, a tots els botons principals, el «+» i la pestanya activa, amb el text en blanc. Cap botó és marró fosc.
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

- **El progrés es guarda al mòbil (9 de novembre de 2026):**
  - Ara l'app recorda el que has fet encara que la tanquis o la tornis a carregar:
    - qui ha entrat;
    - el teu perfil;
    - els filtres;
    - els plans on t'has apuntat o has demanat entrar;
    - els plans que has creat, editat o cancel·lat;
    - el Leo acceptat, els xats, els avisos, les persones bloquejades i les opcions de Settings.
  - **On s'obre l'app:**
    - Si ja havies creat el perfil, va directament al **mapa**.
    - Si només havies entrat (Apple, Google o correu) però no havies acabat el perfil, va a **«Your profile»**.
    - Si encara no havies fet res, va al **vídeo inicial**.
  - Si tanques l'app mentre esperes que t'acceptin en un pla, en tornar-la a obrir l'organitzador t'accepta igualment al cap d'uns segons.
  - **Nova opció «Reset demo»** a **Profile → ⚙️ Settings**, a sota de tot (secció «Demo»). Et demana confirmació («Keep» / «Reset»). Després esborra tot el que s'ha guardat al mòbil i torna a començar des del vídeo inicial.
  - Tot es guarda només al teu mòbil, sense cap servei extern.
  - **Com provar-ho al mòbil:**
    1. Fes el perfil fins al mapa, posa un filtre i apunta't a un pla.
    2. Tanca Expo Go del tot (o prem `r` al terminal) i torna a obrir l'app: has de tornar al mapa amb tot igual.
    3. Després prova «Reset demo» per tornar a començar.

- **Retocs al registre i al perfil, i nou camp «Gender» (16 de novembre de 2026):**
  - **Vídeo inicial, diapositiva 2:** «Pick one or create your own.» ara comença en una línia nova.
  - **Entrar amb Apple i amb Google:** he tret el requadre groc. El text explicatiu («naio will receive your name and email address. You can change profile visibility inside naio.») ara va sense fons, petit, sense negreta i centrat. Les dues pantalles tenen exactament el mateix estil.
  - **Apple:** «Hide my email» es manté, una mica més avall i una mica més petit.
  - **«Your profile»:**
    - A dalt només hi diu «Your profile» (he tret «Takes one minute»). Quan edites el perfil més tard, a dalt continua posant «EDIT».
    - El cercle de la foto: el text de dins («Add your photo *», «Required · selfie check») és més petit i queda ben dins del cercle.
    - Totes les caselles són iguals: vora fina i la mateixa fletxeta petita (⌄) a la dreta. Ja no hi ha el «+».
    - **Nou camp «Gender»** a sota d'«Age range»: en tocar-lo s'obre una llista amb Male, Female i Other. És obligatori per crear el perfil.
    - «+ Add more about you» es queda igual.
    - La frase de sota de tot està centrada i més separada de «+ Add more about you».
    - «Optional profile details» ara és del mateix color terracota que «+ Add more about you».
  - **Nou filtre «Who’s hosting?»** a Filters: pots triar Male, Female i/o Other per veure només els plans d'organitzadors d'aquest gènere. Si no en tries cap, surten tots. El teu pla sempre surt.
  - **Text explicatiu igual a tot arreu:** la mateixa mida petita (13) a les pantalles d'entrar, al perfil i a les següents (selfie, foto del document, idiomes).
  - He instal·lat petites actualitzacions d'Expo (correccions d'errors).
  - **Què has de mirar al mòbil:**
    1. A la segona diapositiva del vídeo, «Pick one…» comença a la línia de sota.
    2. A «Sign in with Apple» i «Sign in with Google», el text de sota no té fons i està centrat.
    3. A «Your profile», tria un gènere: el botó del final no s'activa fins que l'hagis triat.
    4. Al mapa, obre Filters i tria «Female» a «Who’s hosting?»: només queden els plans de la Nora i la Sofia (i el teu).
  - **Decisions:** el filtre mira el gènere de qui organitza el pla. Si prefereixes una altra cosa (per exemple, el gènere de les persones apuntades), m'ho dius.

- **Interessos (19 de novembre de 2026, després de la v2):**
  - **El teu perfil:** els interessos continuen en dues columnes, però ara centrats al mig de la pantalla.
  - **«Your profile» (la llista per omplir):** a «Choose your interests» ja no es talla el text amb «…»: surten tots els interessos triats, en tantes línies com calgui, i la casella es fa més alta. El mateix passa a la resta de caselles (idiomes, etc.).
  - **La v2 s'ha actualitzat amb aquests canvis dels interessos** (19 de novembre de 2026, missatge «v2 - 19 Nov 2026 (updated)»). El QR i l'enllaç de la v2 són els mateixos: tanca Expo Go del tot i torna a obrir la v2 (de vegades cal fer-ho dues vegades). La v1 no ha canviat.

- **Publicada la versió de prova v2 (19 de novembre de 2026):**
  - S'anomena **«v2 - 19 Nov 2026»** i porta tot el que hem fet fins avui (perfil amb «Gender», filtres nous, retocs de disseny, la ciutat, l'etiqueta «Everyone is age and selfie verified»…).
  - **La v1 no ha canviat:** cada versió té el seu enllaç i el seu codi QR, i totes dues es poden obrir sense el Codespace.
  - **Com obrir la v2:** escaneja amb la Càmera de l'iPhone el codi QR `docs/expo-go-preview-v2-2026-11-19.png` (o toca l'enllaç de la v2 de `docs/PREVIEW.md` des del mòbil). S'obre a Expo Go.
  - **Com obrir la v1:** igual, amb el codi QR antic `docs/expo-go-preview-qr.png` (o l'enllaç de la v1 de `docs/PREVIEW.md`).
  - A Expo Go, les dues versions surten a la llista «Recently opened». Per canviar d'una a l'altra, toca la que vulguis (o torna a escanejar el seu QR).
  - Si la v2 s'obre directament al mapa amb dades antigues, ves a **Profile → ⚙️ Settings → «Reset demo»** per començar des del vídeo inicial.
  - A expo.dev la trobaràs amb el missatge «v2 - 19 Nov 2026»: https://expo.dev/accounts/naioali/projects/naio/updates/359fea66-aa9a-4208-b4c5-251fe771b30d
  - També està desada a GitHub amb l'etiqueta `v2-2026-11-19`.

- **Retocs al perfil, a «What are you up to?» i als filtres (19 de novembre de 2026):**
  - **El teu perfil (pestanya Profile i revisió abans de crear-lo):**
    - Ja no posa «Exploring Athens» (encara no sabem on ets). Ara posa **d'on ets**, per exemple «From Barcelona, Spain», si ho has omplert a «Where you’re from» (dins de «+ Add more about you»). Si no ho has omplert, no surt res.
    - «My kind of plans» ja no va en negreta.
    - Els interessos surten en dues columnes, alineats a l'esquerra.
    - Idiomes sense banderes. El nivell (Native, Fluent…) va en color terracota, sense negreta ni cursiva.
    - He tret el llapis de dalt a la dreta de la pantalla de revisió: ja hi ha el botó «Edit profile».
  - **«What are you up to?»:** «First things first» igual. El títol ocupa només dues línies. El text de sota és centrat i més petit. L'última frase va en dues línies i centrada.
  - **Filters:**
    - «Reset» i els títols de cada secció una mica més petits.
    - Les etiquetes de «mood» estan repartides en files equilibrades: «Music» ara és a la segona fila i «Wellness» ja no queda sola al final.
    - Els idiomes s'adapten a la ciutat: a Athens surten primer **Greek i English**. També a «Languages you speak» del perfil («Popular near you» comença per Greek i English).
    - A «When?», «Available» ara està centrat com la resta i les caselles estan repartides igual.
    - He tret el requadre «Everyone is verified» del final.
  - **Nova etiqueta discreta «Everyone is age and selfie verified»** (amb un escut verd petit): al mapa, sota la llegenda de colors, i a la pantalla de detall d'un pla, just a sobre del botó «Join plan».
  - He instal·lat petites actualitzacions d'Expo (correccions d'errors).
  - **Pendent de la teva resposta:** com preguntar d'on ets, com ha de ser la pantalla després de crear el perfil (en lloc de «Welcome to Athens»; ja triada: «You're all set.», el 19 de novembre) i si afegim més «moods».

- **Retocs de disseny (17 de novembre de 2026):**
  - **Regla general:** els textos d'ajuda petits sota els títols («We show a range…», «Use a clear…», «Choose…», «Select 3–8…») ara són una mica més petits i tots de la mateixa mida a tota l'app.
  - **Sign in with Apple:** «Hide my email» i la seva explicació van sense requadre ni fons, separats de la targeta del compte només amb més espai (sense línia divisòria, no calia). Més espai entre les seccions (també a Google).
  - **Your profile:** el que has omplert dins de cada casella ja no surt en negreta. Els idiomes surten un per línia, amb el nivell en cursiva i color terracota (per exemple «English · *Native*»).
  - **Choose your age range:** el text de dalt és més petit. El requadre de sota té les cantonades gairebé rectes i un color més clar.
  - **Verify your range:** el requadre «Selected range» té les cantonades més petites i és més baix. La frase «Use an official document…» és més petita i centrada. «Add the photo page» ara és blanc amb vora fina, com les opcions de document, i «What naio checks» ara no té fons i té la vora discontínua.
  - **Add your ID i Upload ID photo:** el text de dalt és més petit. «Before you continue» ara diu **«Make sure your ID photo is clear»**.
  - **What are you into?:** «Select 3–8…» més petit.
  - **Languages you speak:** la lupa ara surt dins del camp de cerca, al principi. **Add your level:** el requadre amb el codi de l'idioma (per exemple «EN») ja no té fons, només vora.
  - **About me:** el text d'exemple ara diu «A line or two: what you do, what you love, who you are.»
  - **Your situation:** «Living locally» ara es diu **«Local»** (si ja ho tenies triat, es canvia sol). El requadre groc de sota ara és text sense fons i centrat.

- **La ciutat ja no està escrita a mà (16 de novembre de 2026):**
  - Ara hi ha un sol lloc on es guarda «la ciutat on ets» (de moment sempre Athens). Tots els textos la fan servir: «Welcome to Athens.», el mapa, «Exploring Athens» al perfil, «How are you experiencing Athens?», el missatge per compartir del Safety centre i el «In Athens for 4 days» de la Maya.
  - Més endavant, quan l'app faci servir la ubicació real, només caldrà canviar aquest lloc i tots els textos es posaran al dia sols. De moment no fa servir la ubicació real.
  - Al telèfon no es veu cap canvi: continua posant Athens.

- **Arreglat: l'app es quedava a les pantalles del perfil (16 de novembre de 2026):**
  - **Què passava:** si havies entrat (Apple, Google o correu) però no havies acabat el perfil, en tornar a obrir l'app anava directament a «Your profile». Aquesta pantalla quedava com la primera, sense res al darrere: el botó «‹» no tenia on tornar i sortia l'error «The action 'GO_BACK' was not handled by any navigator». I com que el perfil no estava acabat, no podies arribar al mapa.
  - **Què he canviat:**
    - Fins que no acabes el perfil, l'app **sempre comença pel vídeo inicial**. Quan l'acabes («Create profile»), s'obre directament al **mapa**.
    - El que ja havies omplert del perfil es guarda igualment.
    - Tots els botons d'enrere i «Cancel» ara són segurs: si no hi ha pantalla anterior (per exemple, després de recarregar l'app), tornen a l'inici en lloc de donar error.
  - **Provat de cap a peus** en un navegador de proves: vídeo inicial, registre amb Google i Apple, tot el perfil (selfie, edat i document, gènere, idiomes, interessos), la benvinguda, el mapa, les 5 pestanyes, filtres, apuntar-se a un pla, xat, el teu pla (editar, grup, xat, cancel·lar), la sol·licitud del Leo, crear un pla, Settings, Safety centre i «Reset demo». Tots els botons d'enrere funcionen i no surt cap error.

- **Versió de prova publicada amb EAS Update (9 de novembre de 2026):**
  - Ara pots obrir l'app al teu iPhone amb Expo Go **sense que el Codespace estigui obert**.
  - El projecte és al teu compte d'Expo: https://expo.dev/accounts/naioali/projects/naio
  - **Com obrir-la:** escaneja amb la Càmera de l'iPhone el codi QR de `docs/expo-go-preview-qr.png` (o toca l'enllaç de `docs/PREVIEW.md` des del mòbil). S'obre a Expo Go.
  - **L'enllaç i el QR no canvien mai.** Quan et publiqui una versió nova, només cal tancar l'app del tot i tornar-la a obrir (de vegades cal fer-ho dues vegades).
  - Quan vulguis una versió nova, digues-me «publish a new preview».
  - Nota: Expo no explica oficialment aquesta manera d'obrir actualitzacions a Expo Go. Des d'aquí he comprovat que el servidor d'Expo serveix bé l'app, però el pas final s'ha de confirmar al teu iPhone.

- **Nova pantalla després de crear el perfil: «You're all set.» (19 de novembre de 2026):**
  - Substitueix «Welcome to Athens.». Has triat l'opció A; l'opció B s'ha esborrat. Fons sense foto.
  - **La ubicació és obligatòria.** Sense ubicació no es pot continuar: el mapa i les pestanyes no s'obren fins que la permets. Si tanques l'app sense haver-la permès, en tornar-la a obrir torna a aquesta pantalla.
  - **Com funciona (l'ordre final, de la fi del perfil fins al mapa):**
    1. **«Review profile»:** veus el teu perfil tal com el veuran els altres i toques «Create profile».
    2. **Primer, la nostra explicació:** surt la pantalla «Plans near you», que explica per què necessitem la ubicació («naio needs your location to show plans and people nearby. Only an approximate area is used.»), amb el botó «Continue». **L'avís del mòbil no surt sol ni amb temps:** només quan toques «Continue» surt «Allow “naio.” to use your location?», amb «Allow while using the app» o «Don't allow». (Canviat el 23 de novembre de 2026 perquè tinguis temps de llegir l'explicació.)
    3. **Si la permets → «You're all set!»:** a dalt la marca ✓ i «PROFILE CREATED»; el títol «You're all set!»; a sota, en un terracota més suau, «Welcome to Athens, (el teu nom).» (la ciutat surt de la ubicació, el nom del teu perfil); i «See who's around and join a plan today.». Ja no cal esperar: el botó «Find plans nearby →» obre el mapa.
    4. **Mapa amb la targeta «First things first»** («What are you up to?»).
    - **Si no la permets → pantalla que bloqueja:** «naio. needs your location to show plans nearby», amb el text de sota més petit, i el botó «Turn on location», que obre la configuració del mòbil. No es pot anar enlloc més. Quan tornes a l'app, passa al punt 3.
    - Si tanques l'app abans de respondre, en tornar-la a obrir surt de nou l'explicació «Plans near you» amb «Continue».
  - **De moment és de mentida:** no es llegeix cap ubicació real. A la demo, en tornar de la configuració del mòbil, l'app fa com si l'haguessis activat.
  - **Color:** has triat la **A1, amb fons crema**. La versió terracota (A2) s'ha esborrat.
  - **Per provar-ho (Profile → Settings →** baixa fins a **Demo):**
    - «Test the location question»: surt l'explicació; en tocar «Continue» surt l'avís, i pots provar «Allow» i «Don't allow».
    - «Preview “You're all set!”»: la pantalla final.
    - «Test “location denied” screen»: la pantalla que bloqueja.
    - Aquestes proves no canvien el que hi ha desat: la teva ubicació continua permesa.
  - **El logo ara és exactament igual a tot arreu:** totes les pantalles fan servir el mateix logo (la mateixa lletra, el mateix gruix i el mateix punt). Només canvia la mida. Sobre fons crema és marró fosc amb el punt terracota; sobre fons de color o fotos (per exemple, el vídeo inicial) és el mateix logo, tot de color crema. He corregit les pantalles «Request sent», «You're in», «Plan posted» i «Plan cancelled», que el tenien de color terracota. Aquesta norma ara també és a CLAUDE.md.

- **Canvis de disseny i mapa real (19 de novembre de 2026):**
  - **Selfie («Show us it's really you»):** el punt i coma abans de «age verification…» ara és un punt: «… with your ID. Age verification happens separately.»
  - **«Add your ID»:** quan la foto del document està llesta (feta amb la càmera o pujada), surt la mateixa targeta clara «ID photo ready · All four corners detected» amb un ✓ verd, i el quadre groc de consells s'amaga. A la càmera, després de fer la foto, el marc es posa verd i diu «✓ ID photo ready» un moment abans de tornar. El text «Encrypted…» no ha canviat.
  - **«What are you into?»:** ara diu «The ones you choose will appear on your profile.» (sense «together»).
  - **«Add your level»:** ja no hi ha la caixeta amb el codi (CA, IT, FR…) davant de cada idioma, només el nom, i així «Italian» hi cap encara que triïs «Conversational». El text diu «Choose the native language…».
  - **«Your situation»:** el títol de la pantalla ara és la pregunta «What's your situation?», i l'opció «Local» es diu «I'm a local» (també als perfils que ja la tenien triada).
  - **El meu perfil:** sota la franja d'edat surt d'on ets («From Barcelona, Spain») en terracota i sense negreta.
  - **Filtres:**
    - **When:** el dia va a sobre de les opcions, així les caselles tenen més espai (també quan estan triades). «Now» està alineat a l'esquerra i té la mida d'una casella.
    - **Nou «Age range»** (just després dels idiomes): una barra amb dues boles que es mouen per triar de quina edat vols que sigui la gent amb qui fas plans. Salta sempre a les franges oficials (18-24, 25-30, 31-39, 40-45, 46-49, 50+). Si les deixes als extrems, vol dir «qualsevol edat».
    - **Moods:** hi ha «Party» i «Beach».
    - **Idiomes:** nova etiqueta «Suggested languages for your location» damunt dels idiomes suggerits.
  - **Mapa real:** ara és un mapa de debò (Apple Maps a l'iPhone, Google Maps a Android). Et pots moure, fer zoom amb dos dits i explorar zones. Funciona a Expo Go, sense cap compte ni pagament. Encara no fa servir la teva ubicació real: el punt blau és una posició de demo al centre d'Athens.
  - **Marques del mapa:** només surten les que coincideixen amb els teus filtres (distància, gènere, idioma, edat i hora).
    - **Verdes (plans):** «Today» o «Tomorrow» a dalt i l'hora a sota. El teu pla diu «★ Your plan · Today» i surt sempre.
    - **Taronges (gent oberta a plans, sense pla):** el cercle amb la inicial, i a sota el nom i la franja d'edat.
    - **Punt blau (tu):** l'etiqueta «You (approximate)» només surt quan el toques (i s'amaga al cap de 3 segons).
  - **«Everyone is age and selfie verified»:** ja no surt al mapa. Només surt a la pantalla de detalls del pla, just a sobre del botó «Join».
  - **«First things first»:** l'etiqueta i el títol «What are you up to?» estan centrats.
  - **Pendent de la teva resposta:** com ha de ser «My kind of plans» al perfil (t'he proposat dues opcions més tranquil·les).

- **«My kind of plans»: has triat l'opció B (23 de novembre de 2026):**
  - Al perfil (i a la vista prèvia abans de crear-lo), els interessos són etiquetes petites amb una vora fina de color sorra, sense fons i amb text fosc normal.
  - **Alineades com un text justificat:** cada fila comença al marge esquerre i arriba fins al marge dret, amb les etiquetes repartides per igual, de manera que els dos costats queden rectes. L'última fila, si és més curta, queda a l'esquerra. L'app mesura cada etiqueta i tria quines van a cada fila perquè quedin ben plenes (si cal, canvia l'ordre).
  - L'opció A, la versió antiga (boletes de color) i les dues files del menú Demo s'han esborrat.

- **Versió de prova v3 publicada (23 de novembre de 2026):**
  - Té tots els canvis des de la v2: la ubicació obligatòria i «You're all set!», el logo igual a tot arreu, el mapa real, el filtre d'edat, els canvis de disseny i les dues propostes de «My kind of plans».
  - **Com obrir-la:** escaneja amb la Càmera de l'iPhone el QR de `docs/expo-go-preview-v3-2026-11-23.png` (o toca l'enllaç de `docs/PREVIEW.md`). S'obre a Expo Go.
  - La v1 i la v2 continuen igual, amb els seus QR.
  - **Actualitzada el 23 de novembre de 2026** amb l'opció B de «My kind of plans», alineada com un text justificat (mateix QR i mateix enllaç).
  - **Actualitzada de nou el 23 de novembre de 2026:** l'avís de la ubicació ja no surt sol; primer surt l'explicació i l'avís només apareix en tocar «Continue».

- **Petits canvis i punt blau del mapa arreglat (23 de novembre de 2026):**
  - **Nivells d'idioma** (Native, Fluent, Conversational…): una mica més petits a tot arreu (pantalla «Add your level», «Your profile» i el perfil).
  - **«Verify your range»:** la frase «Use an official document…» és més petita, centrada i en dues línies, sense ocupar tota l'amplada.
  - **«Your situation»:** a «Add more about you», el camp ja no diu «How are you experiencing Athens?», sinó «What's your situation?» (com el títol de la pantalla). Aquest text antic ja no surt enlloc de l'app.
  - **«First things first»:** «Customize your experience / to set the perfect plan.» va centrat en dues línies equilibrades, i «Skip for now» és més petit.
  - **Filtres:** a «When?», «Now», «Today» i «Tomorrow» van en negreta i terracota. A l'idioma, el text diu exactament «Leave empty for any language. Suggested languages considering your location.» i s'ha tret l'etiqueta de sota.
  - **El meu perfil:** tot el que hi ha a la targeta (About me, My kind of plans, Languages, Your situation) va en lletra normal, sense negreta. Al costat de la franja d'edat surt el gènere que has triat (per exemple «25-30 · Female»).
  - **Punt blau del mapa:** l'etiqueta «You (approximate)» ara només surt quan toques el punt blau, i s'amaga sola al cap de 3 segons o si toques el mapa. Abans, al mòbil, el toc del punt també comptava com un toc al mapa i l'etiqueta desapareixia de seguida (i a l'iPhone un segon toc no funcionava). Provat en un navegador de proves: no surt abans de tocar, surt en tocar, s'amaga als 3 segons, torna a sortir amb un segon toc i s'amaga en tocar el mapa. **Cal comprovar-ho al mòbil**, perquè el mapa real només funciona allà.
  - **Després:** al perfil, els títols de cada apartat («About me», «My kind of plans», «Languages», «Your situation») van en negreta; el contingut de sota continua en lletra normal.
  - La versió de prova v3 s'ha actualitzat amb aquests canvis (mateix QR i mateix enllaç).

- **Mapa: marques, avís de «sense resultats» i fitxa del pla (23 de novembre de 2026):**
  - **Marques verdes:** només diuen «Now», «Today» o «Tomorrow», sense l'hora. El teu pla diu «★ Your plan» a dalt i, a sota, només «Now», «Today» o «Tomorrow».
  - **Quan cap pla coincideix amb els teus filtres:** el text és el mateix, però els dos botons («Change filters» i «Show all») ara tenen el mateix estil (vora terracota, sense fons), són més petits i van centrats. «Show all» esborra tots els filtres.
  - **Fitxa del pla (en tocar una marca verda):** igual que abans, però el lloc («Psyrri · 1.1 km») va en lletra normal i de color terracota.
  - **Pendent de la teva resposta:** com mostrar «Going», «Spots» i «Language» a la fitxa (t'he proposat dues opcions més senzilles).
  - **Perfil:** hi ha una línia separadora entre «About me» i «My kind of plans», igual que la de sobre de «Languages» (mateix estil, color i espai).
  - La versió de prova v3 s'ha actualitzat amb tots aquests canvis (mateix QR i mateix enllaç).

- **«My kind of plans» arreglat i pantalles dels plans (23 de novembre de 2026):**
  - **«My kind of plans»:** al mòbil, l'app podia mesurar les etiquetes més amples del que eren i deixava espais buits al final d'algunes files. Ara mesura cada etiqueta sola, amb tot l'espai, i omple cada fila tant com pot (si una etiqueta de més avall hi cap, la puja), i després la reparteix d'un marge a l'altre. L'última fila queda a l'esquerra. Comprovat amb 96 combinacions (8 amplades de mòbil, de 360 a 440 punts, i 12 grups d'interessos): cap fila buida al final, cap etiqueta que hi càpiga més amunt.
  - **Fitxa del pla al mapa:** més espai entre el dia i l'hora i el títol. El lloc és una mica més petit i, a sota, en petit: «Exact point is shared after joining» (o el punt exacte, si ja hi ets). La línia del cadenat que hi havia més avall s'ha tret perquè no surti dues vegades.
  - **«View details»:** la descripció és una mica més petita. Sota el lloc surt «Exact point is shared after joining» en petit (la línia repetida de baix s'ha tret). Sota la inicial de cada persona surt la seva franja d'edat. Els títols van en negreta i el text en lletra normal. A «Who's going»: «4 people» en negreta i, després del punt, els noms en terracota i lletra normal, amb «(host)» entre parèntesis, per exemple «Nora (host)». Les places que queden («3 spots left») surten a sota, en petit.
  - **«You're in» (quan t'accepten):** «Who's going» igual: «3 people» en negreta i els noms en terracota.
  - **Fotos de la gent:** de moment continuen les inicials de colors, però l'app ja està preparada perquè, més endavant, cada persona hi tingui la seva foto.
  - **Pendent de la teva resposta:** com vols que es vegi la descripció del pla quan ja t'han acceptat (t'he proposat dues opcions).
  - La versió de prova v3 s'ha actualitzat amb aquests canvis (mateix QR i mateix enllaç).

- **Correccions a les pantalles dels plans i propostes al menú Demo (23 de novembre de 2026):**
  - **Host entre parèntesis** a totes les pantalles: «Nora (host)» (també sota la inicial, a «View details», i al costat de les inicials de la fitxa del mapa).
  - **«Who's going»:** primera línia «4 people» en negreta i «· 3 spots left» en lletra normal i terracota. A sota, els noms en el color normal del text («Maya, Leo, Nora (host), Jonas»). Igual a «View details» i a «You're in».
  - **«Exact point is shared after joining»:** amb una petita icona de punt de mapa davant, i tota la línia en terracota (fitxa del mapa i «View details»). Quan ja hi ets, mostra el punt exacte en verd.
  - **Propostes per comparar (Profile → ⚙︎ Settings → Demo):**
    - «Plan sheet (Going, Spots, Language) - A»: una sola línia sense caixes, amb les inicials i «Maya, Leo, Nora (host) +1 · 3 spots left · English».
    - «Plan sheet (Going, Spots, Language) - B»: dues línies amb una icona fina («4 going · 3 spots left» i «English»), sense caixes, i les inicials a sota.
    - «Plan description (after joining) - A»: la descripció dins d'un requadre suau de color mantega amb el títol «ABOUT THIS PLAN».
    - «Plan description (after joining) - B»: la descripció com una nota de l'amfitriona: la seva inicial, «Sofia says» i el text en cursiva amb una línia fina terracota.
    - El mapa i les pantalles normals continuen igual fins que triïs.
  - La versió de prova v3 s'ha actualitzat amb aquests canvis (mateix QR i mateix enllaç).

- **Enllaç «latest»: sempre la versió més nova (23 de novembre de 2026):**
  - L'entrada «naioali/naio» de la llista de projectes d'Expo Go no pot triar versió sola: obre l'última adreça que hi vas fer servir (una versió antiga o el `npm start` del Codespace, que només funciona amb el Codespace obert). Per això no hi veies cap llista.
  - He creat un enllaç fix nou, **«latest»**, que **sempre obre la versió més nova** (ara la v3). Quan publiqui una versió nova (v4…), el faré apuntar a la nova. L'enllaç i el QR no canviaran mai.
  - **QR:** `docs/expo-go-preview-latest.png` (també a dalt de tot de `docs/PREVIEW.md`).
  - **Com fer-ho servir:** escaneja aquest QR una vegada amb la Càmera de l'iPhone. A partir d'aleshores, a Expo Go, toca l'entrada que surt a «Recently opened»: sempre carregarà la versió més nova. Si veus una versió antiga, tanca Expo Go del tot i torna'l a obrir (de vegades dues vegades).
  - Els QR de la v1, v2 i v3 continuen funcionant igual, per si vols obrir una versió concreta.

- **«Your plan» en verd clar i fitxa del pla B (23 de novembre de 2026):**
  - **El teu pla:** l'etiqueta només diu «★ Your plan», mai «Now», «Today» ni «Tomorrow», i és de color **verd clar** perquè es distingeixi dels altres plans. Surt així al mapa (la marca del teu pla), a la fitxa del mapa, a la pantalla del pla i a la llista de «My plans». L'hora del pla continua a la seva línia de sempre («TODAY · 5:00 PM»).
  - **Fitxa del pla al mapa: has triat la B.** «Going», «Spots» i «Language» ja no van en caixes: són dues línies tranquil·les amb una icona fina («**4 going** · 3 spots left» i l'idioma), i a sota les inicials amb els noms. L'opció A, les caixes antigues i les seves files del menú Demo s'han esborrat.
  - **Després, corregit:** el verd era massa clar. Ara l'etiqueta «★ Your plan» té la mateixa lletra i el mateix color de text (blanc) que les altres marques verdes, només que el fons és d'un verd més clar (#4A9878), prou fosc perquè el text blanc es llegeixi bé.
  - La versió de prova v3 (i l'enllaç «latest») s'ha actualitzat amb aquests canvis.

- **Fitxa del pla, detalls i color de «Your plan» (23 de novembre de 2026):**
  - **«Your plan» més clar o groc:** l'etiqueta del teu pla ara té dues opcions per comparar al menú Demo: **A**, un verd més clar amb text blanc, i **B**, un groc agradable amb text fosc (en groc el text blanc no es llegiria). Quan en tries una, canvia al mapa, a la fitxa, a la pantalla del pla i a «My plans». L'app comença amb la A.
  - **Fitxa del pla (en tocar una marca verda):**
    - El lloc va en terracota, en una sola línia: «Lycabettus Hill, Athens (📍 Exact point is shared after joining)». La línia separada de sota s'ha tret. Quan ja hi ets, entre parèntesis surt el punt exacte.
    - **«Going», «spots» i «language»: dues opcions al menú Demo.** **A:** una caixa amb «4/7 going · 3 spots left» i, al costat, una caixa amb l'idioma. **B (proposta meva):** una sola fila amb un puntet per cada plaça (ple = ocupada), «3 spots left» i l'idioma a la dreta. Fins que triïs, el mapa continua amb les dues línies d'ara.
    - Els noms de la gent van en lletra normal i sense «host». Les inicials de colors continuen (més endavant, fotos).
    - **Botons:** ja no hi ha «Join plan». Només «View details», perquè sempre has de veure els detalls abans d'apuntar-te. Quan ja t'han acceptat, surt «Open the group chat». Al teu pla, els botons de sempre.
  - **Pantalla de detalls:**
    - «Exact point is shared after joining» en terracota.
    - S'ha tret «Meet near», perquè el lloc ja surt sota el títol.
    - «3 spots left» ara té la mateixa mida que «4 people» (abans semblava més gran perquè agafava la mida del text normal).
    - A «Who's going», «(host)» va en cursiva, i sota la inicial de l'amfitrió surt una etiqueta petita «HOST».
  - **Per veure les opcions:** Profile → ⚙︎ Settings → baixa fins a **Demo**.
  - La versió de prova (v3 i l'enllaç «latest») s'ha actualitzat amb aquests canvis.

- **Fitxa del pla: has triat la A amb l'idioma de la B (24 de novembre de 2026):**
  - En tocar una marca verda, «going / spots / language» surt en una sola fila: a l'esquerra la caixa de l'opció A amb «**3/7 going** · 4 spots left» (les places que queden en terracota) i, a la dreta, l'idioma com a l'opció B: una icona fina de bafarada i l'idioma en gris càlid, sense caixa.
  - Les dues files «Plan sheet - A / B» del menú Demo i la pantalla de prova s'han esborrat.
  - La versió de prova v3 (i l'enllaç «latest») s'ha actualitzat amb aquest canvi.

- **Pantalles dels plans, grups de 15, idiomes i «Leave plan» (24 de novembre de 2026):**
  - **«Who's going» (detalls del pla):** ja no surt la llista de noms sota «3 people · 2 spots left»; les inicials ja ho diuen. L'etiqueta «HOST» continua sota la inicial de l'amfitrió.
  - **Plans on ja hi ets:** la descripció surt en cursiva, només el text (no com si ho digués l'amfitrió). Les opcions A/B de la descripció i les seves files del menú Demo s'han esborrat.
  - **Punt exacte (quan ja hi ets):** s'ha tret la fila «Exact meeting point» de sobre «Language». L'adreça en verd sota el títol ja no diu «Exact point:», va subratllada i es pot tocar: surt un menú per anar-hi amb **Apple Maps, Google Maps o Waze** (iPhone) o **Google Maps o «Other maps app»** (Android, que ensenya totes les apps de mapes del mòbil).
  - **Fitxa del pla (abans d'apuntar-te):** «(📍 Exact point is shared after joining)» en cursiva i en color fosc.
  - **«View details»:** la franja de color de dalt ara és **verda** (és un pla per unir-s'hi, com al mapa).
  - **Marges:** el mateix espai a sobre i a sota de la descripció.
  - **«Create a plan»:** pots triar **un o més idiomes** (com a mínim un). Es mostren així: «English · Greek». El filtre d'idioma troba el pla si coincideix qualsevol dels seus idiomes.
  - **Grups de 15 com a màxim:** un pla pot tenir com a molt **15 persones en total, amfitrió inclòs**. A «Create a plan» i «Edit plan» el comptador no passa de 14 («people can join, besides you»), i a sota hi diu «Up to 15 people in total, you included». Els plans de prova ja hi complien (el més gran és de 7).
  - **Sortir d'un pla:** en un pla on ja t'han acceptat, a sota d'«Open the group chat» hi ha un enllaç discret **«Leave plan»**. Abans surt «Leave this plan?» amb «Leave» i «Stay». Si el deixes: desapareix de My plans, ja no pots entrar al xat, la teva plaça queda lliure («spots left» puja un) i al xat surt «(nom) left the plan». Si la teva sol·licitud encara no està acceptada, en lloc de «Leave plan» hi ha **«Cancel request»**, que funciona igual.
  - **L'avís a l'amfitrió:** l'app el desa per a l'amfitrió, però a la demo no el pots veure, perquè l'amfitrió és una persona de prova i a Alerts només hi surten els teus avisos. Per això, a la demo tu reps una línia a Alerts: «You left the plan · Maya has been told». Quan hi hagi una base de dades de debò, l'amfitrió el rebrà al seu Alerts.
  - La versió de prova v3 (i l'enllaç «latest») s'ha actualitzat amb aquests canvis.

- **Més ajustos a les pantalles dels plans (24 de novembre de 2026):**
  - **Color de «Your plan»: has triat la A**, el verd més clar amb text blanc. El groc i les files del menú Demo s'han esborrat. Ara al menú Demo ja no queda cap opció A/B per triar.
  - **Franja de color de «View details»** (corregit): **taronja suau** mentre només mires el pla, i **verda** quan ja hi ets (t'han acceptat, o és el teu pla).
  - **L'amfitrió sempre surt com «(HOST)»**, en majúscules i entre parèntesis. L'he canviat a:
    - **«View details»:** sota la inicial de l'amfitrió, a «Who's going».
    - **«You're in»** (la pantalla després d'apuntar-te): a la línia de noms, «Sofia (HOST), Leo, You».
    - He revisat la resta de pantalles dels plans (xat, «Request sent», «Manage group», «My plans»): no marquen l'amfitrió, i a la fitxa del mapa no s'hi posa.
  - **«My kind of plans» (perfil), centrat:** cada fila d'etiquetes va centrada al mig (també l'última), en lloc d'anar d'esquerra a dreta. Cada fila continua omplint-se tant com pot perquè quedin equilibrades.
  - **Perfil curt de la gent del pla:** a «View details», a «Who's going», pots tocar el cercle de cada persona. Puja una targeta des de baix (amb el fons enfosquit) amb la inicial (més endavant la foto), el nom, «(HOST)» si és l'amfitrió, la franja d'edat, d'on és, un «About me» curt (com a molt dues línies), els idiomes que parla i fins a quatre interessos. Mai l'edat exacta ni on és ara. Es tanca amb la ✕ o tocant fora, i tornes al pla.
  - **Després, ajustat:** dins d'aquesta targeta, «My kind of plans» va alineat a l'esquerra. A My profile continua centrat. També té més espai a baix, perquè el contingut no quedi enganxat a la vora.
  - **Més ajustos a la targeta:** una mica d'espai a dalt, com a baix. S'ha tret la ratlleta de dalt (era l'agafador per arrossegar). La targeta es tanca lliscant cap avall, tocant fora o amb la ✕. Lliscar cap avall també tanca ara la fitxa del pla al mapa.
  - **Filtres → Language:** els idiomes suggerits per la ciutat continuen igual. A sota hi ha «+ Add another language»: obre un camp de cerca amb la lupa davant (com a la pantalla d'idiomes del perfil). Mentre escrius, surten els idiomes de la llista fixa que coincideixen, i en tries un (no es pot escriure text lliure, perquè els noms siguin sempre iguals). L'idioma triat surt com un xip més, al costat dels suggerits. Si el desmarques, desapareix.
  - **«Request sent»:** es queda a la pantalla fins que l'amfitrió accepta. A la demo ara triga uns **15 segons**; per no esperar, a **Settings → Demo** hi ha **«Simulate host accepts»** (accepta ara les sol·licituds que tinguis pendents). El missatge principal és una sola frase amb el nom de l'amfitrió, per exemple «Leo has your request.», i a sota la resta, una mica més petit. A la caixa del pla diu «Exact point is shared after Leo accepts» (el nom surt de les dades del pla). «Cancel request» d'aquesta pantalla ara també pregunta abans.
  - **«(HOST)» només on vam quedar:** sota la inicial de l'amfitrió a «Who's going» (detalls del pla) i a la targeta de perfil. A les llistes de noms (per exemple a «You're in») ja no hi surt: «Sofia, Leo, You».
  - **Xat del grup:** la caixa de dalt (el punt de trobada) ja no té el fons groc: només el marc, amb el mateix fons que la resta de la pantalla.
  - **«You're in»:** la caixa del pla té un fons verd clar, el mateix verd que fem servir quan ja ets dins d'un pla.
  - **Adreça exacta en blau d'enllaç:** l'adreça que es pot tocar (i obre Apple Maps / Google Maps) ara és del blau típic dels enllaços (#007AFF), perquè es vegi que es pot tocar. Després, s'ha tret la fletxeta blava de la dreta; l'adreça continua blava i es pot tocar.
  - **Xat del grup:** «Today» / «Tomorrow» és només text, sense fons. Per veure el pla, toca el nom del pla a dalt o «View plan» (a la dreta): obre la mateixa pantalla del pla que des de Plans.
  - **«Request sent»:** a la caixa del pla ara diu «Exact point is shared once accepted».
  - **«once they accept» → «once accepted»:** l'únic lloc de l'app on sortia era el text de sota de «Request sent», que ara diu «Once accepted, you'll be active in the group chat and see the exact meeting point.»
  - **Xat del grup:** el títol del pla de dalt surt sempre sencer, en dues línies si cal; mai tallat amb «…».
  - **«Create a plan»:**
    - «Pick one or more languages.» ara surt just a sota del títol «Languages» (que ara va separat de «Spots»).
    - A «Day / time», a més de «Today» i «Tomorrow», hi ha **«Now»**: el pla comença ara mateix i no cal triar hora.
    - **Area:** la llista són els barris de la ciutat on ets (a la demo, Atenes, que surt del valor de la ciutat actual, mai escrit a mà). Ara és **opcional**: pots crear el pla sense triar-ne cap (es toca un altre cop per treure'l), i llavors la gent només hi veu el nom de la ciutat.
    - **Mood:** pots triar fins a **3**.
    - «Short note» ara es diu **«Description»**.
  - **Plans cancel·lats amb vora vermella suau:** a la pantalla «Plan cancelled.», a **My plans** (els plans cancel·lats on eres o que organitzaves continuen sortint a «Upcoming», amb la vora vermella i «Cancelled») i a **Alerts** (quan cancel·les un pla teu, surt «You cancelled your plan», emmarcat en vermell suau; si el toques, obre la pantalla del pla cancel·lat).
  - **«Create a plan» → Day / time:** si toques «Now», a sota diu «Next 2 hours». Amb «Today» o «Tomorrow» no surt res a sota (s'ha tret «Plans are for today or tomorrow only»).
  - **My plans (Upcoming i Past):** la part esquerra de cada pla ara és només un bloc de color, sense res a dins. Cada pla de la llista té un color diferent, tots de la mateixa gamma càlida (préssec, terracota suau, mantega…), perquè quedin harmoniosos.
  - **Requests buit:** el missatge «No requests right now.» ara és més petit, en proporció amb la resta.
  - **Plans cancel·lats a My plans:** surten en gris i esvaïts, com una marca d'aigua, perquè ja no són vàlids. En aquesta llista ja no tenen la vora vermella (es manté a la pantalla «Plan cancelled.» i a Alerts).
  - **My plans, més canvis:**
    - **Plans cancel·lats:** són més petits que els altres, i si els llisques cap a l'esquerra surt **«Remove»** (en vermell) per treure'ls de la llista.
    - **Colors del bloc de l'esquerra** (substitueix «un color diferent per a cada pla»): depèn del tipus de pla, i són els mateixos a tota l'app: **el teu pla** en verd clar (com l'etiqueta «Your plan»), **Now** en terracota suau, **Today** en préssec i **Tomorrow** en mantega. Els passats, en color sorra, i els cancel·lats, en gris.
    - **Past:** «chat closed», al final de cada pla, en cursiva.
    - **Corregit:** el color del bloc ara depèn **només del dia**: tots els plans del mateix dia tenen el mateix color. **Today** (també «Now» i el teu pla d'avui) en préssec, i **Tomorrow** en mantega. El teu pla continua marcat amb l'etiqueta verda «★ Your plan».
    - **Corregit de nou:** tornen els quatre tipus, ara amb colors pastís suaus però **clarament diferents**: **el teu pla** verd menta, **Now** coral, **Today** mel i **Tomorrow** lavanda. (Els passats, sorra; els cancel·lats, gris.)
    - **«Plans don't live forever»:** sense el fons groc; té el mateix fons que la pantalla, amb un marc fi.
    - **Corregit (la lògica, no només els colors):** un pla que comença d'aquí a menys d'una hora es pintava com a «Now» (coral), però a la targeta posava «Today». Per això semblava que hi havia plans «Today» de dos colors. Ara hi ha **una sola regla** a tota l'app que decideix si un pla és «Now», «Today» o «Tomorrow», i la fan servir el text de la targeta («NOW · 4:30 PM»), el color del bloc i l'etiqueta del mapa. Així el text i el color sempre coincideixen: tots els «Today» mel, tots els «Tomorrow» lavanda, tots els «Now» coral, i el teu pla verd menta.
    - **«Plans don't live forever», sense caixa:** ni fons ni marc, només la icona i el text sobre el fons de la pantalla.
  - **Fitxa del pla al mapa, plans on ja ets («You're in»):** el mateix estil i disposició, però amb el fons d'un verd molt suau, per distingir-los. Els plans on no ets queden igual.
  - **«Create a plan», més canvis:**
    - **Languages** funciona exactament igual que a Filters (és la mateixa peça): primer els idiomes suggerits per a la ciutat on ets (a Atenes, grec i anglès), i després «+ Add another language», que obre el cercador amb la lupa i una llista fixa (no es pot escriure lliurement). Pots triar-ne un o més; «Pick one or more languages.» continua just a sota del títol.
    - **Area:** el text ara diu «Without choosing one, people will see just Athens.» (el nom de la ciutat surt de la ciutat actual, mai escrit a mà).
    - **Missatge de sota:** només diu el que falta, amb «and» abans de l'últim, i acaba amb «to continue». Per exemple: «Add an activity to continue.», «Add an activity and a meeting point to continue.».
  - **Persones en taronja al mapa («Open to plans»), en tocar-les:**
    - La línia ara diu «In Athens for 4 days · **Available until** 8:00 PM» (la ciutat i l'hora surten de les dades, mai escrites a mà).
    - A sota hi surt d'on és la persona («From Lisbon, Portugal»), amb el mateix estil que a la fitxa curta de les persones d'un pla.
    - El text que la descriu és una mica més petit, com a la resta de l'app.
  - **Fitxa del pla al mapa:** el fons verd suau dels plans on ets s'ha tret (torna a ser igual que la resta). Ara, per saber que ja hi ets, el botó **«Open the group chat»** és verd (ple de verd, amb el text blanc).
  - **Persones en taronja al mapa, més canvis:** el quadre de sota ja no té el fons groc, només el marc. El text fa servir el gènere de la persona: «her / She'll» per a dones, «him / He'll / his» per a homes, i «them / They'll» només si va triar «Other» o no ho va dir. «From …» ara és de color terracota, com a My profile.
  - **Per triar (Settings → Demo): la forma del marcador del teu pla al mapa.** Mateixos colors (groc clar, estrella i text daurats), però una forma pròpia, diferent dels plans verds i de les persones taronja. **A**: un quadrat amb les puntes arrodonides i una estrella, fet com els marcadors taronja, amb «Your plan» a sota. **B**: una agulla de mapa (en forma de gota) amb una estrella i «Your plan» a sota. Toca «“Your plan” marker - A» o «- B» (surt «On» a la triada) i mira el mapa. Si tanques l'app, torna a A.
  - **Logo «naio.» una mica més petit i igual a tot arreu:** ara té una sola mida (30), definida al mateix logo, i és igual a My profile, a l'inici de sessió, a les diapositives i a totes les altres pantalles.
  - **Colors nous:**
    - **Els teus plans sempre en groc** (té prioritat sobre Now/Today/Tomorrow): groc clar per al bloc de My plans, l'etiqueta «★ Your plan» i el marcador del mapa; un groc daurat més intens per als textos (l'etiqueta, l'hora i el títol). Als detalls del teu pla, la franja de dalt és d'un groc molt pàl·lid. El verd queda només per als plans on t'has unit («You're in»).
    - **Today** ara és un **turquesa suau** (bloc, «TODAY · hora» i títol). Now (granat suau) i Tomorrow (lila) no canvien.
    - **Taronja d'«Open to plans»:** un sol taronja a tot arreu: el punt de la llegenda, els marcadors de les persones i la fitxa de la persona («AVAILABLE» i la vora de ratlles del quadre). Els plans on encara no ets mantenen el seu color terracota.
  - **Títols, tots iguals i una mica més petits:** ara hi ha **una sola mida de títol per a tota l'app, 32** (abans n'hi havia de 30 a 46; la majoria eren de 42). La fan servir tots els títols grans en lletra serif: «My plans», «Notifications», «Create a plan», «Settings», els títols dels plans, el nom a My profile, les fitxes del mapa, les diapositives inicials, etc. Està definida en un sol lloc del tema.
  - **Logo «naio.» una mica més petit** (al voltant d'un 15% menys), el mateix logo a tot arreu.
  - **Dia i hora en verd quan ja ets al pla:** «TOMORROW · 10:00 AM» (o Now / Today) surt del mateix verd que «You're in» a la fitxa del mapa, als detalls del pla (l'obris des del mapa, des de My plans, des del xat amb «View plan» o des d'Alerts) i a la pantalla «You're in.». Si encara no hi ets, es queda igual que abans.
  - **«Open the group chat» sempre verd:** a tot arreu on veus un pla on ets (mapa, plans de My plans, i xat → «View plan»), el botó és el mateix verd ple.
  - **Persones en taronja, «From …»:** ara en color fosc i una mica més gruixut (pes mitjà, no negreta del tot), per provar si t'agrada.
  - **Quadre de sota de les persones en taronja:** vas triar l'opció **A**: el mateix quadre, sense fons, amb la vora de ratlles (terracota clar). L'opció B (campaneta sense quadre) i les files de Settings → Demo s'han tret.
  - **Llistes de plans (My plans):** ja no hi surten els noms de qui hi va, només quantes persones: «Monastiraki · 3 people going» (a Past, «5 people went»).
  - **My plans, colors definitius:** **el teu pla** verd clar, **Now** granat (ara una mica més marró vermellós, però suau), **Today** groc (mel, igual que abans) i **Tomorrow** lila (igual que abans). L'hora i el títol de cada pla van del mateix color que el seu bloc, una mica més intens perquè es puguin llegir bé sobre el blanc.
    - Els interessos i els idiomes ara van separats en dues seccions amb títol, com a la fitxa curta: **«MY KIND OF PLANS»** i **«LANGUAGES»**.
  - **«You're in» (prova):** la caixa té el fons d'un verd més clar i una vora verda una mica més marcada. Digues-me si t'agrada.
  - **Fitxa del pla (en tocar un pla al mapa), nou ordre:** el títol; la descripció just a sota; una línia fina; el lloc en terracota amb «Exact point is shared after joining» **a la seva pròpia línia** a sota (en cursiva i fosc); i després la resta com abans. Quan ja hi ets, aquella línia mostra l'adreça exacta en verd, i si la toques et dona les indicacions.
  - La versió de prova v3 (i l'enllaç «latest») s'ha actualitzat amb aquests canvis.

## 2. PROPERAMENT

Les quatre fases del pla estan fetes. No hi ha cap fase més planificada. Quan vulguis, podem decidir junts què ve ara. Algunes idees (cap no està decidida):

- Repassar l'app sencera amb tu i ajustar el que no t'agradi.
- Més endavant, connectar-la a una base de dades real (Supabase), perquè els plans, els xats i els perfils siguin de debò i es comparteixin entre persones.
- Preparar-la per publicar-la a l'App Store i a Google Play. Això necessitaria comptes de desenvolupador, que són de pagament.

## 3. PENDENT

### El que necessito de tu

- **Unir la versió desada amb la branca principal:** la versió està desada a GitHub en una branca a part, `phases-1-4`. Quan vulguis, la puc unir amb la branca principal (`main`).
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
- **Les dades:** la gent i els plans són inventats. El que fas (crear plans, acceptar el Leo, escriure al xat…) es guarda només al teu mòbil: no ho veu ningú més. Amb «Reset demo» ho esborres tot. Més endavant es pot connectar a una base de dades real (Supabase).
