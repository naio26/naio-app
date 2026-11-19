# Resum de fases — naio.

Última actualització: 19 de novembre de 2026 (publicada la versió de prova v2; les quatre fases estan fetes)

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
  - **Pendent de la teva resposta:** com preguntar d'on ets, com ha de ser la pantalla després de crear el perfil (en lloc de «Welcome to Athens») i si afegim més «moods».

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
