# Beeldmodellen lokaal draaien met ComfyUI

> **De affiches komen hier niet meer uit.** Die worden samengesteld op het echte
> sjabloon, zie [AFFICHES.md](AFFICHES.md). Een tekenmodel bleek de vijf
> tekstvakken niet foutloos te kunnen spellen, en dat is voor een affiche met een
> clubnaam en een uitslag geen optie.
>
> Deze opzet blijft staan voor los bewerkwerk, en voor het geval we het logo van
> een tegenstander ooit willen laten hertekenen. Dat laatste is één opdracht in
> plaats van vijf, en daar is zo'n model wél goed in.

Deze opzet laat **Qwen-Image-Edit-2509** op de eigen pc draaien in plaats van te
betalen bij een API.

Waarom dit model: het is er specifiek op getraind om een bestaand beeld te
bewerken in plaats van een nieuw beeld te verzinnen, het aanvaardt **drie
invoerbeelden** tegelijk, en het is sterk in tekst binnen afbeeldingen.

## Wat je nodig hebt

Een RTX 5070 Ti met 16 GB VRAM volstaat. Reken op ongeveer 25 GB schijfruimte
voor de modellen en een minuut of twee per affiche.

## 1. ComfyUI installeren

Haal de Windows-versie op via <https://www.comfy.org/download> en pak die uit
op een schijf met genoeg ruimte, bijvoorbeeld `D:\ComfyUI`.

Start ComfyUI één keer zodat de mappenstructuur wordt aangemaakt, en sluit het
daarna weer af.

## 2. De GGUF-node toevoegen

Qwen-Image-Edit draait bij ons in gekwantiseerde vorm, en daarvoor is een extra
node nodig.

1. Start ComfyUI en open de **Manager**
2. Kies **Custom Nodes Manager**
3. Zoek op `ComfyUI-GGUF` (van city96) en installeer die
4. Herstart ComfyUI

## 3. De modellen downloaden

Vier bestanden, allemaal gratis op Hugging Face.

| Bestand | Bron | Doelmap |
| --- | --- | --- |
| `Qwen-Image-Edit-2509-Q4_K_M.gguf` | [QuantStack/Qwen-Image-Edit-2509-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF) | `models\unet\` |
| `qwen_2.5_vl_7b_fp8_scaled.safetensors` | Comfy-Org/Qwen-Image_ComfyUI | `models\text_encoders\` |
| `qwen_image_vae.safetensors` | Comfy-Org/Qwen-Image_ComfyUI | `models\vae\` |
| `Qwen-Image-Lightning-4steps-V1.0.safetensors` | lightx2v/Qwen-Image-Lightning | `models\loras\` |

**Welke kwantisatie?** Begin met **Q4_K_M** (ongeveer 12 GB). Samen met de
tekstencoder past dat comfortabel binnen 16 GB VRAM. Valt de kwaliteit tegen,
probeer dan Q5_K_M; die is scherper maar zit dichter tegen de grens aan, en
ComfyUI zal dan vaker moeten wisselen tussen VRAM en systeemgeheugen, wat trager
is maar met 64 GB RAM geen probleem vormt.

De Lightning-LoRA is optioneel maar aan te raden: die brengt het aantal stappen
terug van vijftig naar vier, wat het verschil maakt tussen zeven minuten en
ongeveer een minuut per affiche.

## 4. ComfyUI starten met de API open

De bot stuurt ComfyUI aan via de ingebouwde API. Start ComfyUI zoals gewoonlijk;
de API luistert dan op `http://127.0.0.1:8188`.

Controleer dat met:

```powershell
curl http://127.0.0.1:8188/system_stats
```

Krijg je daar gegevens over je GPU terug, dan is alles klaar.

## 5. De werkstroom één keer exporteren

De affiche-maker gebruikt jouw eigen ComfyUI-werkstroom, zodat de nodes altijd
kloppen met wat er bij jou geïnstalleerd staat. Dat doe je eenmalig:

1. open in ComfyUI de sjabloon **Qwen-Image-Edit-2509**
   (menu **Workflow > Browse Templates**)
2. controleer dat er **drie Load Image-nodes** in staan; voeg er zo nodig een
   toe en verbind die met de derde beeldingang
3. maak één proefaffiche met de hand, zodat je zeker weet dat de werkstroom
   draait
4. kies **Workflow > Export (API)**
5. bewaar het bestand als `workflow-api.json` in `C:\Personal\KWS-Affiches\`

De affiche-maker vult daarin zelf de opdrachttekst en de drie beeldnamen in. Hij
zoekt de nodes op hun type, niet op hun nummer, dus je mag de werkstroom later
gerust nog aanpassen; exporteer hem dan opnieuw.

De volgorde van de Load Image-nodes telt: **sjabloon eerst**, dan het clubschild,
dan het logo van de tegenstander. De maker gaat af op de volgorde waarin de nodes
in het bestand staan.

## 6. De affiche-maker draaien

In `C:\Personal\KWS-Affiches\` staat een klein programma dat het werk doet:

1. het haalt bij de site op welke affiches nog ontbreken
   (`/api/social/opdrachten?open=1`)
2. het zet per affiche het sjabloon, het clubschild en het logo van de
   tegenstander in ComfyUI en start de werkstroom
3. het uploadt het resultaat terug naar de site, waar het aan de juiste wedstrijd
   gekoppeld wordt

Starten doe je met de snelkoppeling **KWS Affiches maken** op het bureaublad.
Laat ComfyUI daarbij openstaan.

Elke gemaakte affiche wordt ook lokaal bewaard als
`laatste-{ploeg}-{soort}.png`, zodat je meteen kan kijken wat eruit kwam zonder
de site te openen.

Je kan het programma laten draaien wanneer het jou uitkomt; het pakt telkens op
wat er openstaat. Draai het bijvoorbeeld dinsdagavond, dan staat woensdag om 18u
alles klaar in de mail.

## Als het misgaat

| Symptoom | Oorzaak |
| --- | --- |
| `out of memory` in ComfyUI | Kies een kleinere kwantisatie (Q4_K_M in plaats van Q5) of start ComfyUI met `--lowvram` |
| Verbinding geweigerd op poort 8188 | ComfyUI draait niet, of luistert op een andere poort. Wijkt de poort af, zet dan `KWS_COMFYUI_URL` als omgevingsvariabele |
| `workflow-api.json ontbreekt` | Stap 5 is nog niet gedaan |
| `de werkstroom heeft 2 LoadImage-nodes, er zijn er 3 nodig` | De derde Load Image-node ontbreekt; voeg die toe en exporteer opnieuw |
| Het model negeert het sjabloon | Controleer of de drie beelden in de juiste volgorde worden ingeladen: sjabloon eerst |
| Tekst staat er scheef of onleesbaar | Verhoog het aantal stappen, of schakel de Lightning-LoRA uit voor deze affiche |
| Elke keer hetzelfde beeld | Zou niet mogen: de maker zet zelf een nieuwe seed. Staat de seed in jouw werkstroom op `fixed`, zet die dan op `randomize` |

## Verhouding tot de andere wegen

Deze opzet vervangt niets, ze komt erbij. De opdrachtpagina blijft bestaan: valt
een affiche tegen, dan maak je hem alsnog met de hand in ChatGPT en sleep je hem
naar het vak. De bot gebruikt altijd het beeld dat er ligt, ongeacht wie het
gemaakt heeft.
