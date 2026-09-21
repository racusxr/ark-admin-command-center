# ARK Command Center

Generador de comandos para **ARK: Survival Evolved**. Busca una criatura o un item, ajusta los
parámetros y copia el comando `admincheat` exacto — sin conexión RCON, sin backend.

Construido con **React + TypeScript + Vite + Tailwind CSS**.

## ⚠️ Nota importante sobre este entrega

Este proyecto fue generado en un entorno sin acceso a internet, por lo que **no fue posible
ejecutar `npm install` ni `npm run build` para verificarlo end-to-end** aquí mismo. El código
sigue la estructura estándar de un proyecto Vite + React + TS + Tailwind (ampliamente probada), pero
te recomiendo correr los pasos de instalación abajo y avisarme si algo falla para corregirlo.

También, siguiendo tu instrucción de "no inventar IDs o blueprint paths": la base de datos de
criaturas e items incluye únicamente rutas de blueprint y class names que son de conocimiento
público y ampliamente documentados para ARK: Survival Evolved. **No se generan IDs numéricos
inventados** para `GiveItemNum` — por eso el generador de items usa `GiveItem` (basado en
blueprint path) como formato principal, que es la forma fiable y estable de dar items. La base de
datos está pensada para que la amplíes fácilmente (ver más abajo).

## 1. Instalación

Requisitos: Node.js 18+ y npm.

```bash
cd ark-command-center
npm install
npm run dev
```

Abre la URL que te muestre Vite (normalmente `http://localhost:5173`).

Para compilar producción:

```bash
npm run build
npm run preview
```

## 2. Estructura del proyecto

```
src/
├── components/       # Header, SearchBar, CommandCard, CommandPreview, CopyButton,
│                      # CreatureSelector, ItemSelector, FilterBar, FavoriteButton, CommandBuilder,
│                      # LanguageToggle (interruptor ES | EN)
├── i18n/             # translations.ts (diccionarios ES/EN), I18nContext.tsx, commands.ts
├── pages/            # Home, Spawn, Items, Creatures, Commands, SearchResults, History
├── data/
│   ├── creatures.json
│   ├── items.json
│   ├── commands.json         # fuente en español
│   └── commands.en.json      # traducción al inglés (descripciones) por id
├── utils/
│   ├── commandGenerator.ts   # construcción y validación de comandos
│   ├── clipboard.ts          # copiar al portapapeles (con fallback)
│   ├── storage.ts            # favoritos + historial en localStorage
│   └── search.ts             # búsqueda global
├── types.ts
├── App.tsx
└── main.tsx
```

## 3. Funcionalidades incluidas

- Buscador global en vivo (`/search`) sobre criaturas, items y comandos.
- **Spawn Creature**: selección de criatura + variante (Normal/Aberrant/Tek/Alpha, según
  disponibilidad real), nivel, cantidad, tamed, y elección entre `SpawnDino` y `GMSummon`.
  Cantidad > 1 genera varios comandos (uno por criatura) porque el juego no soporta cantidad
  múltiple en un solo `SpawnDino`/`GMSummon`.
- **Spawn Item**: selección de item, cantidad, calidad y modo blueprint, generando `GiveItem`.
- **Creature Database** y **Item Database**: exploración con filtros por categoría.
- **ARK Commands**: referencia de comandos admin (sintaxis, parámetros, ejemplo) + **Command
  Builder** genérico y dinámico que arma el comando según el comando elegido.
- **Copy / Copy All** con confirmación visual "✓ Copied!".
- **Favorites** y **Recent Commands / History** persistidos en `localStorage`.
- Validación de campos (nivel, cantidad, calidad) con mensajes de error.
- Configuración de Spawn reflejada en la URL (`/spawn?creature=rex&level=150&...`) para poder
  compartir un enlace con una configuración específica.
- Selector de "Game Version" (ARK: Survival Evolved / Ascended) — Ascended queda deshabilitado y
  preparado para una futura versión, tal como pediste priorizar Evolved primero.
- Totalmente responsive, con menú hamburguesa en móvil.

## 4. Cómo agregar o corregir criaturas

Edita `src/data/creatures.json`. Cada entrada:

```json
{
  "id": "spinosaurus",
  "name": "Spinosaurus",
  "category": "Carnivore",
  "notes": "Texto opcional que se muestra en la UI",
  "variants": [
    {
      "variant": "Normal",
      "blueprintPath": "Blueprint'/Game/PrimalEarth/Dinos/Spino/Spino_Character_BP.Spino_Character_BP'",
      "gmSummonId": "Spino_Character_BP_C"
    }
  ]
}
```

`category` debe ser una de: `Carnivore`, `Herbivore`, `Aquatic`, `Flyer`, `Boss`, `Other`
(ver `src/types.ts`). `variant` debe ser una de: `Normal`, `Aberrant`, `Tek`, `X`, `R`, `Alpha`.
Puedes agregar tantas variantes como tengas confirmadas — no hace falta que todas las criaturas
tengan las mismas.

## 5. Cómo agregar o corregir items

Edita `src/data/items.json`:

```json
{
  "id": "compound-bow",
  "name": "Compound Bow",
  "category": "Weapons",
  "blueprintPath": "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponCompoundBow.PrimalItem_WeaponCompoundBow'",
  "description": "Texto que se muestra en la UI",
  "stackSize": 1,
  "canBeBlueprint": true
}
```

`category` debe ser una de: `Resources`, `Weapons`, `Armor`, `Saddles`, `Structures`,
`Consumables`, `Ammo`, `Tools`, `Artifacts`, `Tributes`, `Cosmetics`, `Other`.

Si en algún momento confirmas IDs numéricos fiables para `GiveItemNum`, puedes añadir el campo
opcional `"itemNumId": <número>` a un item — el tipo ya lo soporta (`src/types.ts`), solo falta
conectarlo en `Items.tsx`/`commandGenerator.ts` si quieres exponerlo en la UI.

## 6. Cómo agregar comandos al Command Builder

Edita `src/data/commands.json`. Cada `param` con `"type": "creature"` renderiza un
`CreatureSelector`, `"type": "item"` renderiza un `ItemSelector`, y el resto renderiza inputs de
texto/número/checkbox automáticamente. Usa el nombre `BlueprintPath` para parámetros que deban
resolverse al blueprint path de la criatura/item, o `ClassName` para el class name (`GMSummon`
style) — así lo interpreta `buildGenericCommand` en `src/utils/commandGenerator.ts`.

## 7. Cómo modificar el diseño

- Colores, tipografías y sombras: `tailwind.config.js` (tokens `ink`, `surface`, `rust`, `moss`,
  `tek`, `bone`, fuentes `display`/`body`/`mono`).
- Estilos base y clases reutilizables (`.btn-primary`, `.panel`, `.field-input`, `.code-box`,
  etc.): `src/index.css`.
- Tipografías cargadas desde Google Fonts en `index.html` (Rajdhani para títulos, Inter para
  texto, IBM Plex Mono para los comandos).

## 8. Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub/GitLab.
2. En Vercel: **New Project** → importa el repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

También funciona igual en Netlify (build command `npm run build`, publish directory `dist`) y
Cloudflare Pages (build command `npm run build`, output directory `dist`).

## 9. Antes de considerarlo terminado, verifica localmente

```bash
npm install
npm run dev     # probar búsqueda, filtros, spawn generator, item generator,
                 # command builder, copy, favorites, history, responsive
npm run build   # debe compilar sin errores de TypeScript
```

Si `npm run build` marca algún error de tipos o de un import, dime el mensaje exacto y lo
corrijo de inmediato.

---

## Actualización: SpawnExactDino, base de datos ampliada

### Datos (`src/data/`)

| Archivo | Contenido |
|---|---|
| `creatures.json` | 413 criaturas de ARK: Survival Evolved (id, name, className, blueprintPath, group, dlc, variant, movement, tags) |
| `items.json` | 356 items con className, blueprintPath, stackSize, `canBeBlueprint`, `verified` y, cuando existe confirmado, `itemNumId` |
| `colors.json` | 127 colores: 0 (unset), 1–100 base y 201–226 tintes de ASE, con hex real |
| `spawnPresets.json` | Presets de nivel (`Flex 254`, `Flex 200`, `Flex 100`, `Custom`) y de color (Default, All Black, All White, Rainbow, Custom) |

Los datos se generan desde tablas compactas con los scripts de `build/`
(`build_creatures.py`, `build_items.py`, `build_colors.py`), que validan IDs y
blueprints duplicados, campos vacíos y contenido exclusivo de ASA.

### Fuentes y verificación

- Criaturas, colores y la sintaxis de `SpawnExactDino`: ARK Official Community
  Wiki (`ark.wiki.gg`) y ARK Fandom Wiki.
- Solo ARK: Survival Evolved. Todo lo que aparece bajo `/Game/ASA/` está excluido
  y el generador lo rechaza.
- En items, `verified: false` marca rutas que siguen el patrón estándar del juego
  pero que no pudieron confirmarse contra el wiki (Armor, Structures, Ammo). La
  interfaz lo avisa al seleccionarlas.

### SpawnExactDino

`buildSpawnExactDinoCommand()` en `src/utils/commandGenerator.ts` construye los
21 parámetros en el orden real del juego:

```
SpawnExactDino <DinoBlueprintPath> <SaddleBlueprintPath> <SaddleQuality>
               <BaseLevel> <ExtraLevels> <BaseStats> <AddedStats> <DinoName>
               <Cloned> <Neutered> <TamedOn> <UploadedFrom> <ImprinterName>
               <ImprinterPlayerID> <ImprintQuality> <Colors> <DinoID> <Exp>
               <spawnDistance> <YOffset> <ZOffset>
```

- `BaseStats` / `AddedStats`: 8 valores (Health, Stamina, Oxygen, Food, Weight,
  Melee Damage, Movement Speed, Crafting Skill).
- `Colors`: 6 regiones (0–5), que es lo que usa ARK.
- Los presets `Flex N` reparten N puntos en los 7 stats salvajes y calculan el
  nivel como `N*7+1` (Flex 254 → 1779), siguiendo la regla del wiki de que
  `BaseLevel` debe ser la suma de `BaseStats` + 1.

---

## Idiomas (Español / English)

El header incluye un interruptor **ES | EN**. La elección se guarda en `localStorage`
(`ark-cc:lang`); si el usuario nunca eligió, se usa el idioma del navegador (inglés si es `en-*`,
español en cualquier otro caso). Al cambiar de idioma no se pierde lo que el usuario ya escribió o
configuró, y `<html lang>` y la meta description se actualizan.

- **Textos de la interfaz**: `src/i18n/translations.ts`. Hay dos diccionarios, `es` y `en`, con las
  mismas claves. `en` está tipado contra las claves de `es`, así que si agregas una clave en uno y
  olvidas el otro, `npm run build` falla. En los componentes: `const { t } = useI18n()` y
  `t('home.recent')`; admite variables: `t('sel.showing', { shown: 60, total: 413 })`.
- **Comandos** (`commands.json`): la descripción de cada comando y de sus parámetros está en español
  en `commands.json` y en inglés en `commands.en.json` (mismo `id`). Syntax, ejemplos y nombres de
  parámetros son código y no se traducen. Si agregas un comando, agrega también su entrada en
  `commands.en.json` (si falta, se muestra la descripción en español).
- **Presets y etiquetas derivadas de datos** (filtros, categorías, stats, presets de nivel/color):
  claves `filter.*`, `movement.*`, `cat.*`, `itemcat.*`, `stat.*`, `preset.*` en `translations.ts`.
  Si no existe la clave se muestra el valor original.
- **Lo que NO se traduce**: nombres de criaturas, items y colores, nombres de DLC y variantes
  (Aberrant, Tek, Alpha...), class names y blueprint paths. Son nombres del juego / valores exactos
  del comando. Tampoco cambian los comandos generados ni el historial ya guardado.
- **Agregar otro idioma**: añade el código en `Lang` y `LANGS`, crea el diccionario con todas las
  claves y regístralo en `dictionaries` (`translations.ts`); si quieres descripciones de comandos en
  ese idioma, agrega su `commands.<lang>.json` y extiende `localizeCommands` (`i18n/commands.ts`).
