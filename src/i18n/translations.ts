/* ===========================================================================
   Diccionarios de traducción (ES / EN).

   - `es` es la fuente de verdad: define todas las claves válidas (TKey).
   - `en` está tipado como Record<TKey, string>, así que si agregas una clave
     en `es` y olvidas `en` (o al revés), TypeScript falla al compilar.
   - Los textos admiten variables con llaves: "Mostrando {shown} de {total}".
   =========================================================================== */

export type Lang = 'es' | 'en'

export const LANGS: Lang[] = ['es', 'en']

export const es = {
  /* --- Meta ------------------------------------------------------------- */
  'meta.description':
    'Generador de comandos para ARK: Survival Evolved — busca criaturas e items, arma el comando y cópialo.',

  /* --- Navegación / layout ---------------------------------------------- */
  'nav.home': 'Inicio',
  'nav.spawnExact': 'Spawn Exacto',
  'nav.spawn': 'Spawn',
  'nav.items': 'Items',
  'nav.creatures': 'Criaturas',
  'nav.commands': 'Comandos',
  'nav.search': 'Buscar',
  'nav.history': 'Historial',
  'nav.openMenu': 'Abrir menú',
  'nav.closeMenu': 'Cerrar menú',
  'lang.label': 'Idioma',
  'lang.switchToEs': 'Cambiar a español',
  'lang.switchToEn': 'Cambiar a inglés',
  'footer.text':
    'ARK Command Center — generador de comandos no oficial para ARK: Survival Evolved. No afiliado con Studio Wildcard.',

  /* --- Comunes ---------------------------------------------------------- */
  'common.copy': 'Copiar',
  'common.copyCommand': 'Copiar comando',
  'common.copyAll': 'Copiar todo',
  'common.copied': '¡Copiado!',
  'common.copiedCheck': '✓ ¡Copiado!',
  'common.copyLevel': 'Copiar Nv.{level}',
  'common.favorite': 'Favorito',
  'common.favorited': 'En favoritos',
  'common.reset': 'Restablecer',
  'common.configure': 'Configurar',
  'common.filter': 'Filtro',
  'common.level': 'Nivel',
  'common.quantity': 'Cantidad',
  'common.quality': 'Calidad',
  'common.tamed': 'Domesticada',
  'common.creature': 'Criatura',
  'common.item': 'Item',
  'common.command': 'Comando',
  'common.commandPrefix': 'Prefijo del comando',
  'common.generated': 'Comando generado',
  'common.fillFields': 'Completa los campos para generar el comando…',
  'common.commandsCount': '{count} comandos',
  'common.delete': 'Eliminar',
  'common.spawnExact': 'Spawn Exacto',

  /* --- Filtros y categorías --------------------------------------------- */
  'filter.All': 'Todos',
  'filter.Land': 'Terrestres',
  'filter.Flying': 'Voladoras',
  'filter.Aquatic': 'Acuáticas',
  'filter.Boss': 'Jefes',
  'filter.DLC': 'DLC',
  'movement.Land': 'Terrestre',
  'movement.Flying': 'Voladora',
  'movement.Aquatic': 'Acuática',
  'cat.All': 'Todos',
  'cat.Spawning': 'Generación',
  'cat.Player': 'Jugador',
  'cat.World': 'Mundo',
  'cat.Cheats': 'Trucos',
  'cat.Server': 'Servidor',
  'itemcat.All': 'Todos',
  'itemcat.Resources': 'Recursos',
  'itemcat.Weapons': 'Armas',
  'itemcat.Armor': 'Armaduras',
  'itemcat.Saddles': 'Sillas',
  'itemcat.Structures': 'Estructuras',
  'itemcat.Consumables': 'Consumibles',
  'itemcat.Ammo': 'Munición',
  'itemcat.Tools': 'Herramientas',
  'itemcat.Artifacts': 'Artefactos',
  'itemcat.Tributes': 'Tributos',
  'itemcat.Cosmetics': 'Cosméticos',
  'itemcat.Other': 'Otros',

  /* --- Stats ------------------------------------------------------------ */
  'stat.Health': 'Vida',
  'stat.Stamina': 'Resistencia',
  'stat.Oxygen': 'Oxígeno',
  'stat.Food': 'Comida',
  'stat.Weight': 'Peso',
  'stat.Melee Damage': 'Daño cuerpo a cuerpo',
  'stat.Movement Speed': 'Velocidad',
  'stat.Crafting Skill': 'Habilidad de crafteo',

  /* --- Presets (spawnPresets.json) -------------------------------------- */
  'preset.level.flex-254.label': 'Flex 254',
  'preset.level.flex-254.desc': '254 puntos en cada stat salvaje (7 stats) → nivel 1779',
  'preset.level.flex-200.label': 'Flex 200',
  'preset.level.flex-200.desc': '200 puntos en cada stat salvaje (7 stats) → nivel 1401',
  'preset.level.flex-100.label': 'Flex 100',
  'preset.level.flex-100.desc': '100 puntos en cada stat salvaje (7 stats) → nivel 701',
  'preset.level.custom.label': 'Personalizado',
  'preset.level.custom.desc': 'Nivel y puntos de stats totalmente manuales',
  'preset.color.default.label': 'Por defecto',
  'preset.color.all-black.label': 'Todo negro',
  'preset.color.all-white.label': 'Todo blanco',
  'preset.color.rainbow.label': 'Arcoíris',
  'preset.color.custom.label': 'Personalizado',

  /* --- Validaciones ----------------------------------------------------- */
  'val.levelMin': 'El nivel debe ser un número mayor o igual a 1.',
  'val.levelMax': 'Ese nivel es demasiado alto para ser válido.',
  'val.quantityMin': 'La cantidad debe ser mayor que 0.',
  'val.quantityMax': 'Cantidad máxima recomendada: 500 por lote.',
  'val.qualityMin': 'La calidad no puede ser negativa.',
  'val.qualityMax': 'La calidad máxima soportada por el juego es 100.',
  'val.baseLevelMin': 'El nivel base debe ser 1 o mayor.',
  'val.statsNegative': 'Los puntos de stats no pueden ser negativos.',
  'val.colorRange': 'Los IDs de color deben estar entre 0 y 255.',
  'val.warnBaseLevel':
    'El wiki recomienda BaseLevel = suma de BaseStats + 1 (aquí sería {expected}). Con otro valor las stats pueden quedar mal.',
  'val.warnExtraLevels': 'ExtraLevels debería ser la suma de AddedStats (aquí sería {expected}).',

  /* --- Selectores ------------------------------------------------------- */
  'sel.showing': 'Mostrando {shown} de {total}. Afina la búsqueda para ver más.',
  'creatureSel.placeholder': 'Buscar criatura…',
  'creatureSel.query': 'rhynio, rex, tek, wyvern, aberrant…',
  'creatureSel.none': 'No hay criaturas que coincidan.',
  'itemSel.placeholder': 'Buscar item…',
  'itemSel.query': 'metal, saddle, arrow, element…',
  'itemSel.none': 'No hay items que coincidan.',
  'color.region': 'Región de color {n}',
  'color.regionShort': 'región {n}',
  'color.search': 'Buscar color…',
  'color.query': 'black, blue, red, 254…',
  'color.none': 'No hay colores que coincidan.',
  'color.unset': 'Sin definir (sin color)',
  'color.showing': 'Mostrando {shown} de {total}.',

  /* --- Home ------------------------------------------------------------- */
  'home.titleBefore': 'Arma comandos de',
  'home.titleAfter': 'en segundos.',
  'home.intro':
    'Busca una criatura o un item, ajusta nivel, cantidad y variante, y copia el comando exacto para pegarlo en tu consola de servidor. Sin RCON, sin conexión directa — solo generación y copiado.',
  'home.cta.exact': 'Spawn Exact Dino',
  'home.cta.spawn': 'Generar una criatura',
  'home.cta.item': 'Generar un item',
  'home.quick.exact.title': 'Spawn Exact Dino',
  'home.quick.exact.desc': 'Nivel, stats, nombre y colores exactos con SpawnExactDino.',
  'home.quick.spawn.title': 'Generar criatura',
  'home.quick.spawn.desc': 'Genera SpawnDino o GMSummon con nivel, cantidad y variante.',
  'home.quick.items.title': 'Generar item',
  'home.quick.items.desc': 'Encuentra un item y arma su GiveItem listo para copiar.',
  'home.quick.commands.title': 'Constructor de comandos',
  'home.quick.commands.desc': 'Explora todos los comandos admin y arma el que necesites.',
  'home.quick.creatures.title': 'Base de criaturas',
  'home.quick.creatures.desc': 'Navega variantes: Normal, Aberrant, Tek, Alpha y más.',
  'home.recent': 'Comandos recientes',
  'home.viewHistory': 'Ver todo el historial →',
  'home.favorites': 'Favoritos',
  'home.favCount.one': 'Tienes {count} comando guardado.',
  'home.favCount.other': 'Tienes {count} comandos guardados.',
  'home.viewFavorites': 'Ver favoritos →',

  /* --- Spawn ------------------------------------------------------------ */
  'spawn.title': 'Generar criatura',
  'spawn.subtitle':
    'Elige una criatura y genera SpawnDino, GMSummon o Summon. Para colores y stats exactos usa Spawn Exacto.',
  'spawn.note':
    'Nota: GMSummon y Summon no reciben el estado domesticado como parámetro; la criatura aparece según el comportamiento estándar del comando.',

  /* --- Spawn Exact ------------------------------------------------------ */
  'exact.title': 'Spawn Exact Dino',
  'exact.subtitleBefore': 'Genera el comando completo',
  'exact.subtitleAfter':
    'con nivel, stats, nombre y colores exactos para ARK: Survival Evolved.',
  'exact.warning':
    'El wiki oficial avisa de que SpawnExactDino es inestable: la criatura debe meterse y sacarse de una criopod para que se apliquen bien stats y colores, y un error en una ruta de blueprint puede cerrar el juego.',
  'exact.levelPreset': 'Preset de nivel',
  'exact.statsToMax': 'Stats al máximo',
  'exact.statsHint': 'Elige qué stats reciben el valor del preset ({points})',
  'exact.statsHelp':
    'Marca el stat para que siga el valor del preset, o escribe el número que quieras en su campo. Habilidad de crafteo no se ofrece aquí porque no aplica a criaturas salvajes; puedes ajustarla a mano en Opciones avanzadas.',
  'exact.dinoName': 'Nombre del dino',
  'exact.dinoNameHintBefore': 'Si lo dejas vacío se usa',
  'exact.dinoNameHintAfter': '.',
  'exact.colors': 'Colores',
  'exact.colorsHint': 'ARK usa 6 regiones de color (0 a 5)',
  'exact.advanced': 'Opciones avanzadas',
  'exact.saddle': 'Silla',
  'exact.noSaddle': 'Sin silla',
  'exact.saddleQuality': 'Calidad de la silla',
  'exact.baseStats': 'Stats base (niveles salvajes)',
  'exact.adjustLevel': 'Ajustar nivel a {level}',
  'exact.addedStats': 'Stats añadidos (niveles domesticados)',
  'exact.extraLevels': 'Niveles extra',
  'exact.imprint': 'Imprint (0 - 1)',
  'exact.imprinterId': 'ID del jugador imprinter',
  'exact.imprinterName': 'Nombre del imprinter',
  'exact.tamedOn': 'Domesticada en',
  'exact.uploadedFrom': 'Subida desde',
  'exact.dinoId': 'ID del dino',
  'exact.exp': 'Experiencia',
  'exact.spawnDistance': 'Distancia de spawn',
  'exact.yOffset': 'Offset Y',
  'exact.zOffset': 'Offset Z',
  'exact.cloned': 'Clonada',
  'exact.neutered': 'Castrada',

  /* --- Items ------------------------------------------------------------ */
  'items.title': 'Generar item',
  'items.subtitle':
    'Busca un item y genera GiveItem o GiveItemNum con cantidad, calidad y modo blueprint.',
  'items.unverified': '⚠ Ruta sin verificar contra el wiki oficial: compruébala en el juego.',
  'items.commandType': 'Tipo de comando',
  'items.noNum':
    'Este item no tiene un ID numérico confirmado, así que solo se ofrece GiveItem.',
  'items.giveBlueprint': 'Dar blueprint',
  'items.noBlueprint': '(este item no tiene blueprint)',
  'items.database': 'Base de items ({count})',
  'items.search': 'Buscar items...',
  'items.showing': 'Mostrando {shown} de {total} items. Usa la búsqueda para acotar.',
  'items.none': 'Ningún item coincide con tu búsqueda.',

  /* --- Criaturas -------------------------------------------------------- */
  'creatures.title': 'Base de criaturas',
  'creatures.subtitle':
    '{count} criaturas de ARK: Survival Evolved con su class name y blueprint path.',
  'creatures.search': 'Buscar criaturas...',
  'creatures.showing': 'Mostrando {shown} de {total} criaturas. Usa la búsqueda para acotar.',
  'creatures.none': 'Ninguna criatura coincide con tu búsqueda.',

  /* --- Comandos --------------------------------------------------------- */
  'commands.title': 'Comandos de ARK',
  'commands.subtitle':
    'Referencia de comandos administrativos, con sintaxis, parámetros y ejemplo listo para copiar.',
  'commands.builder': 'Constructor de comandos',
  'commands.reference': 'Referencia de comandos',
  'commands.search': 'Buscar comandos...',
  'commands.none': 'Ningún comando coincide con tu búsqueda.',
  'card.syntax': 'Sintaxis',
  'card.params': 'Parámetros',
  'card.example': 'Ejemplo',

  /* --- Búsqueda global -------------------------------------------------- */
  'search.title': 'Buscar',
  'search.subtitle': 'Busca en criaturas, items, armas, estructuras y comandos.',
  'search.placeholder': 'Buscar criaturas, items o comandos...',
  'search.prompt': 'Empieza a escribir para buscar en toda la base de datos.',
  'search.noResults': 'No se encontraron resultados para "{query}".',
  'search.creatures': 'Criaturas ({count})',
  'search.items': 'Items ({count})',
  'search.commands': 'Comandos ({count})',
  'search.openInCommands': 'Abrir en Comandos',

  /* --- Historial -------------------------------------------------------- */
  'history.title': 'Historial',
  'history.subtitle': 'Tus comandos favoritos y los generados recientemente.',
  'history.favorites': 'Favoritos',
  'history.noFavorites': 'Aún no tienes comandos favoritos.',
  'history.recent': 'Comandos recientes',
  'history.clear': 'Borrar historial',
  'history.empty':
    'Todavía no has generado ningún comando. Ve a Spawn, Items o Comandos para empezar.',
  'history.today': 'Hoy {time}',

  /* --- Custom Caves ------------------------------------------------------- */
  'nav.customCaves': 'Custom Caves',
  'cave.title': 'Custom Caves',
  'cave.subtitle':
    'Genera el comando para colocar un Tribute Terminal, un Loadout Mannequin o un Water Well en tu Custom Cave.',
  'cave.type.tributeTerminal.name': 'Tribute Terminal',
  'cave.type.tributeTerminal.desc':
    'Terminal de obelisco (Rojo, Azul o Verde) para subir y bajar tributos entre mapas.',
  'cave.type.loadoutMannequin.name': 'Loadout Mannequin',
  'cave.type.loadoutMannequin.desc':
    'Maniquí de Genesis: Part 2 que guarda un set de armadura e inventario y lo equipa al usarlo.',
  'cave.type.waterWell.name': 'Water Well',
  'cave.type.waterWell.desc':
    'Pozo de agua de Scorched Earth: se coloca sobre una Veta de Agua para almacenar agua.',
  'cave.variant': 'Color de terminal',
  'cave.variant.base': 'Base (genérico)',
  'cave.variant.red': 'Rojo',
  'cave.variant.blue': 'Azul',
  'cave.variant.green': 'Verde',
  'cave.mode': 'Modo',
  'cave.mode.single': 'Un objeto',
  'cave.mode.grid': 'Cuadrícula',
  'cave.mode.text': 'Texto (letras)',
  'cave.text.label': 'Texto a escribir',
  'cave.text.hint':
    'Se admite A-Z, 0-9, espacios y . , ! ? -. Cada letra se arma con una fuente de puntos de 5×7: se coloca el objeto elegido arriba solo en los "píxeles" encendidos.',
  'cave.text.letterGap': 'Espacio entre letras (columnas)',
  'cave.text.unsupported':
    'Estos caracteres no tienen letra disponible y se omitieron: {chars}',
  'cave.text.total': 'Se generará(n) {count} comando(s) de SpawnActor para este texto.',
  'cave.text.empty': 'Escribe un texto para generar el comando.',
  'cave.customName': 'Nombre personalizado',
  'cave.customNameHint':
    'Solo identifica esta entrada en tu Historial y Favoritos: ni SpawnActor ni GiveItem aceptan un nombre.',
  'cave.position': 'Posición',
  'cave.positionHint':
    'SpawnActor coloca el objeto relativo a tu personaje: ARK no tiene un comando verificado para coordenadas absolutas del mundo.',
  'cave.spawnDistance': 'X · Distancia de spawn (delante de ti)',
  'cave.yOffset': 'Y · Offset lateral',
  'cave.zOffset': 'Z · Offset de altura',
  'cave.preset.low': 'Cerca',
  'cave.preset.medium': 'Media distancia',
  'cave.preset.high': 'Lejos',
  'cave.preset.custom': 'Personalizado',
  'cave.grid.title': 'Cuadrícula (varias copias)',
  'cave.grid.hint':
    'Genera varias copias formando una pared/sala: Width = copias en X, Length = copias en Y, Height = copias en Z. Con 1×1×1 se genera un solo objeto.',
  'cave.grid.width': 'Width (copias en X)',
  'cave.grid.length': 'Length (copias en Y)',
  'cave.grid.height': 'Height (copias en Z)',
  'cave.grid.spacingX': 'Espaciado X',
  'cave.grid.spacingY': 'Espaciado Y',
  'cave.grid.spacingZ': 'Espaciado Z',
  'cave.grid.total': 'Se generará(n) {count} comando(s) de SpawnActor, encadenado(s) con "|".',
  'cave.grid.totalWarning':
    'Vas a generar {count} copias en un único comando: puede quedar muy largo y algunas consolas/RCON tienen un límite de caracteres. Si falla, pruébalo en tandas más pequeñas.',
  'cave.rotation': 'Rotación (Pitch / Yaw / Roll)',
  'cave.rotationNote':
    'ARK: Survival Evolved no tiene un comando verificado para fijar la rotación de un objeto al generarlo. Estos valores se guardan solo como referencia en tu Historial/Favoritos y no forman parte del comando generado.',
  'cave.pitch': 'Pitch',
  'cave.yaw': 'Yaw',
  'cave.roll': 'Roll',
  'cave.giveItemNote':
    'ARK no tiene un comando verificado de SpawnActor para colocar este objeto ya construido en el mundo: el comando real es GiveItem, que te lo entrega para que lo coloques tú mismo (el juego usa tu posición y tu mira al colocarlo).',
  'cave.giveItemOptions': 'Opciones de GiveItem',
  'cave.reset': 'Restablecer a 0',
  'cave.pending': '⚠ Dato pendiente de verificar contra el wiki oficial.',
  'cave.val.nameRequired': 'Ponle un nombre para identificarlo en tu Historial/Favoritos.',
  'cave.val.nameTooLong': 'El nombre no debería superar los {max} caracteres.',
  'cave.val.positionInvalid': 'Los valores de posición deben ser números válidos.',
  'cave.val.gridInvalid': 'Width, Length y Height deben ser números enteros de al menos 1.',
  'cave.val.spacingInvalid': 'Los valores de espaciado deben ser números válidos.',
  'cave.val.rotationInvalid': 'Los valores de rotación deben ser números válidos.',
} as const

export type TKey = keyof typeof es

export const en: Record<TKey, string> = {
  /* --- Meta ------------------------------------------------------------- */
  'meta.description':
    'Command generator for ARK: Survival Evolved — search creatures and items, build the command and copy it.',

  /* --- Navigation / layout ---------------------------------------------- */
  'nav.home': 'Home',
  'nav.spawnExact': 'Spawn Exact',
  'nav.spawn': 'Spawn',
  'nav.items': 'Items',
  'nav.creatures': 'Creatures',
  'nav.commands': 'Commands',
  'nav.search': 'Search',
  'nav.history': 'History',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'lang.label': 'Language',
  'lang.switchToEs': 'Switch to Spanish',
  'lang.switchToEn': 'Switch to English',
  'footer.text':
    'ARK Command Center — unofficial command generator for ARK: Survival Evolved. Not affiliated with Studio Wildcard.',

  /* --- Common ----------------------------------------------------------- */
  'common.copy': 'Copy',
  'common.copyCommand': 'Copy Command',
  'common.copyAll': 'Copy All',
  'common.copied': 'Copied!',
  'common.copiedCheck': '✓ Copied!',
  'common.copyLevel': 'Copy Lv.{level}',
  'common.favorite': 'Favorite',
  'common.favorited': 'Favorited',
  'common.reset': 'Reset',
  'common.configure': 'Configure',
  'common.filter': 'Filter',
  'common.level': 'Level',
  'common.quantity': 'Quantity',
  'common.quality': 'Quality',
  'common.tamed': 'Tamed',
  'common.creature': 'Creature',
  'common.item': 'Item',
  'common.command': 'Command',
  'common.commandPrefix': 'Command prefix',
  'common.generated': 'Generated Command',
  'common.fillFields': 'Fill in the fields to generate the command…',
  'common.commandsCount': '{count} commands',
  'common.delete': 'Delete',
  'common.spawnExact': 'Spawn Exact',

  /* --- Filters and categories ------------------------------------------- */
  'filter.All': 'All',
  'filter.Land': 'Land',
  'filter.Flying': 'Flying',
  'filter.Aquatic': 'Aquatic',
  'filter.Boss': 'Boss',
  'filter.DLC': 'DLC',
  'movement.Land': 'Land',
  'movement.Flying': 'Flying',
  'movement.Aquatic': 'Aquatic',
  'cat.All': 'All',
  'cat.Spawning': 'Spawning',
  'cat.Player': 'Player',
  'cat.World': 'World',
  'cat.Cheats': 'Cheats',
  'cat.Server': 'Server',
  'itemcat.All': 'All',
  'itemcat.Resources': 'Resources',
  'itemcat.Weapons': 'Weapons',
  'itemcat.Armor': 'Armor',
  'itemcat.Saddles': 'Saddles',
  'itemcat.Structures': 'Structures',
  'itemcat.Consumables': 'Consumables',
  'itemcat.Ammo': 'Ammo',
  'itemcat.Tools': 'Tools',
  'itemcat.Artifacts': 'Artifacts',
  'itemcat.Tributes': 'Tributes',
  'itemcat.Cosmetics': 'Cosmetics',
  'itemcat.Other': 'Other',

  /* --- Stats ------------------------------------------------------------ */
  'stat.Health': 'Health',
  'stat.Stamina': 'Stamina',
  'stat.Oxygen': 'Oxygen',
  'stat.Food': 'Food',
  'stat.Weight': 'Weight',
  'stat.Melee Damage': 'Melee Damage',
  'stat.Movement Speed': 'Movement Speed',
  'stat.Crafting Skill': 'Crafting Skill',

  /* --- Presets (spawnPresets.json) -------------------------------------- */
  'preset.level.flex-254.label': 'Flex 254',
  'preset.level.flex-254.desc': '254 points in every wild stat (7 stats) → level 1779',
  'preset.level.flex-200.label': 'Flex 200',
  'preset.level.flex-200.desc': '200 points in every wild stat (7 stats) → level 1401',
  'preset.level.flex-100.label': 'Flex 100',
  'preset.level.flex-100.desc': '100 points in every wild stat (7 stats) → level 701',
  'preset.level.custom.label': 'Custom',
  'preset.level.custom.desc': 'Fully manual level and stat points',
  'preset.color.default.label': 'Default',
  'preset.color.all-black.label': 'All Black',
  'preset.color.all-white.label': 'All White',
  'preset.color.rainbow.label': 'Rainbow',
  'preset.color.custom.label': 'Custom',

  /* --- Validation ------------------------------------------------------- */
  'val.levelMin': 'Level must be a number greater than or equal to 1.',
  'val.levelMax': 'That level is too high to be valid.',
  'val.quantityMin': 'Quantity must be greater than 0.',
  'val.quantityMax': 'Recommended maximum quantity: 500 per batch.',
  'val.qualityMin': 'Quality cannot be negative.',
  'val.qualityMax': 'The maximum quality supported by the game is 100.',
  'val.baseLevelMin': 'Base level must be 1 or greater.',
  'val.statsNegative': 'Stat points cannot be negative.',
  'val.colorRange': 'Color IDs must be between 0 and 255.',
  'val.warnBaseLevel':
    'The wiki recommends BaseLevel = sum of BaseStats + 1 (here it would be {expected}). With any other value the stats may end up wrong.',
  'val.warnExtraLevels': 'ExtraLevels should be the sum of AddedStats (here it would be {expected}).',

  /* --- Selectors -------------------------------------------------------- */
  'sel.showing': 'Showing {shown} of {total}. Refine your search to see more.',
  'creatureSel.placeholder': 'Search creature…',
  'creatureSel.query': 'rhynio, rex, tek, wyvern, aberrant…',
  'creatureSel.none': 'No matching creatures.',
  'itemSel.placeholder': 'Search item…',
  'itemSel.query': 'metal, saddle, arrow, element…',
  'itemSel.none': 'No matching items.',
  'color.region': 'Color Region {n}',
  'color.regionShort': 'region {n}',
  'color.search': 'Search color…',
  'color.query': 'black, blue, red, 254…',
  'color.none': 'No matching colors.',
  'color.unset': 'Unset (no color)',
  'color.showing': 'Showing {shown} of {total}.',

  /* --- Home ------------------------------------------------------------- */
  'home.titleBefore': 'Build',
  'home.titleAfter': 'commands in seconds.',
  'home.intro':
    'Search for a creature or an item, tweak level, quantity and variant, then copy the exact command to paste into your server console. No RCON, no direct connection — just generating and copying.',
  'home.cta.exact': 'Spawn Exact Dino',
  'home.cta.spawn': 'Spawn a Creature',
  'home.cta.item': 'Spawn an Item',
  'home.quick.exact.title': 'Spawn Exact Dino',
  'home.quick.exact.desc': 'Exact level, stats, name and colors with SpawnExactDino.',
  'home.quick.spawn.title': 'Spawn Creature',
  'home.quick.spawn.desc': 'Generate SpawnDino or GMSummon with level, quantity and variant.',
  'home.quick.items.title': 'Spawn Item',
  'home.quick.items.desc': 'Find an item and get its GiveItem command ready to copy.',
  'home.quick.commands.title': 'Command Builder',
  'home.quick.commands.desc': 'Browse all admin commands and build the one you need.',
  'home.quick.creatures.title': 'Creature Database',
  'home.quick.creatures.desc': 'Browse variants: Normal, Aberrant, Tek, Alpha and more.',
  'home.recent': 'Recent Commands',
  'home.viewHistory': 'View full history →',
  'home.favorites': 'Favorites',
  'home.favCount.one': 'You have {count} saved command.',
  'home.favCount.other': 'You have {count} saved commands.',
  'home.viewFavorites': 'View favorites →',

  /* --- Spawn ------------------------------------------------------------ */
  'spawn.title': 'Spawn Creature',
  'spawn.subtitle':
    'Pick a creature and generate SpawnDino, GMSummon or Summon. For exact colors and stats use Spawn Exact.',
  'spawn.note':
    "Note: GMSummon and Summon don't take the tamed state as a parameter; the creature spawns according to the command's standard behavior.",

  /* --- Spawn Exact ------------------------------------------------------ */
  'exact.title': 'Spawn Exact Dino',
  'exact.subtitleBefore': 'Generate the full',
  'exact.subtitleAfter':
    'command with exact level, stats, name and colors for ARK: Survival Evolved.',
  'exact.warning':
    'The official wiki warns that SpawnExactDino is unstable: the creature must be put into and taken out of a cryopod for stats and colors to apply properly, and a mistake in a blueprint path can crash the game.',
  'exact.levelPreset': 'Level Preset',
  'exact.statsToMax': 'Stats to max',
  'exact.statsHint': 'Choose which stats get the preset value ({points})',
  'exact.statsHelp':
    "Tick a stat to make it follow the preset value, or type any number in its field. Crafting Skill isn't offered here because it doesn't apply to wild creatures; you can set it by hand in Advanced Options.",
  'exact.dinoName': 'Dino Name',
  'exact.dinoNameHintBefore': 'If left empty,',
  'exact.dinoNameHintAfter': 'is used.',
  'exact.colors': 'Colors',
  'exact.colorsHint': 'ARK uses 6 color regions (0 to 5)',
  'exact.advanced': 'Advanced Options',
  'exact.saddle': 'Saddle',
  'exact.noSaddle': 'No saddle',
  'exact.saddleQuality': 'Saddle Quality',
  'exact.baseStats': 'Base Stats (wild levels)',
  'exact.adjustLevel': 'Set Level to {level}',
  'exact.addedStats': 'Added Stats (tamed levels)',
  'exact.extraLevels': 'Extra Levels',
  'exact.imprint': 'Imprint (0 - 1)',
  'exact.imprinterId': 'Imprinter Player ID',
  'exact.imprinterName': 'Imprinter Name',
  'exact.tamedOn': 'Tamed On',
  'exact.uploadedFrom': 'Uploaded From',
  'exact.dinoId': 'Dino ID',
  'exact.exp': 'Experience',
  'exact.spawnDistance': 'Spawn Distance',
  'exact.yOffset': 'Y Offset',
  'exact.zOffset': 'Z Offset',
  'exact.cloned': 'Cloned',
  'exact.neutered': 'Neutered',

  /* --- Items ------------------------------------------------------------ */
  'items.title': 'Spawn Item',
  'items.subtitle':
    'Search for an item and generate GiveItem or GiveItemNum with quantity, quality and blueprint mode.',
  'items.unverified': '⚠ Path not verified against the official wiki: check it in-game.',
  'items.commandType': 'Command Type',
  'items.noNum':
    'This item has no confirmed numeric ID, so only GiveItem is offered.',
  'items.giveBlueprint': 'Give Blueprint',
  'items.noBlueprint': '(this item has no blueprint)',
  'items.database': 'Item Database ({count})',
  'items.search': 'Search items...',
  'items.showing': 'Showing {shown} of {total} items. Use search to narrow down.',
  'items.none': 'No items match your search.',

  /* --- Creatures -------------------------------------------------------- */
  'creatures.title': 'Creature Database',
  'creatures.subtitle':
    '{count} creatures from ARK: Survival Evolved with their class name and blueprint path.',
  'creatures.search': 'Search creatures...',
  'creatures.showing': 'Showing {shown} of {total} creatures. Use search to narrow down.',
  'creatures.none': 'No creatures match your search.',

  /* --- Commands --------------------------------------------------------- */
  'commands.title': 'ARK Commands',
  'commands.subtitle':
    'Admin command reference, with syntax, parameters and a ready-to-copy example.',
  'commands.builder': 'Command Builder',
  'commands.reference': 'Command Reference',
  'commands.search': 'Search commands...',
  'commands.none': 'No commands match your search.',
  'card.syntax': 'Syntax',
  'card.params': 'Parameters',
  'card.example': 'Example',

  /* --- Global search ---------------------------------------------------- */
  'search.title': 'Search',
  'search.subtitle': 'Search creatures, items, weapons, structures and commands.',
  'search.placeholder': 'Search creatures, items or commands...',
  'search.prompt': 'Start typing to search the whole database.',
  'search.noResults': 'No results found for "{query}".',
  'search.creatures': 'Creatures ({count})',
  'search.items': 'Items ({count})',
  'search.commands': 'Commands ({count})',
  'search.openInCommands': 'Open in Commands',

  /* --- History ---------------------------------------------------------- */
  'history.title': 'History',
  'history.subtitle': 'Your favorite commands and the ones you generated recently.',
  'history.favorites': 'Favorites',
  'history.noFavorites': "You don't have any favorite commands yet.",
  'history.recent': 'Recent Commands',
  'history.clear': 'Clear history',
  'history.empty':
    "You haven't generated any commands yet. Head to Spawn, Items or Commands to get started.",
  'history.today': 'Today {time}',

  /* --- Custom Caves ------------------------------------------------------- */
  'nav.customCaves': 'Custom Caves',
  'cave.title': 'Custom Caves',
  'cave.subtitle':
    'Generate the command to place a Tribute Terminal, a Loadout Mannequin or a Water Well for your Custom Cave.',
  'cave.type.tributeTerminal.name': 'Tribute Terminal',
  'cave.type.tributeTerminal.desc':
    'Obelisk terminal (Red, Blue or Green) for uploading and downloading tributes between maps.',
  'cave.type.loadoutMannequin.name': 'Loadout Mannequin',
  'cave.type.loadoutMannequin.desc':
    'Genesis: Part 2 mannequin that stores an armor set and inventory and equips it on use.',
  'cave.type.waterWell.name': 'Water Well',
  'cave.type.waterWell.desc':
    'Scorched Earth water well: placed on top of a Water Vein to store water.',
  'cave.variant': 'Terminal color',
  'cave.variant.base': 'Base (generic)',
  'cave.variant.red': 'Red',
  'cave.variant.blue': 'Blue',
  'cave.variant.green': 'Green',
  'cave.mode': 'Mode',
  'cave.mode.single': 'Single object',
  'cave.mode.grid': 'Grid',
  'cave.mode.text': 'Text (letters)',
  'cave.text.label': 'Text to write',
  'cave.text.hint':
    'Supports A-Z, 0-9, spaces and . , ! ? -. Each letter is built with a 5×7 dot font: the object chosen above is placed only on the "lit" pixels.',
  'cave.text.letterGap': 'Gap between letters (columns)',
  'cave.text.unsupported': "These characters have no glyph and were skipped: {chars}",
  'cave.text.total': 'Will generate {count} SpawnActor command(s) for this text.',
  'cave.text.empty': 'Type some text to generate the command.',
  'cave.customName': 'Custom Name',
  'cave.customNameHint':
    "Only identifies this entry in your History and Favorites: neither SpawnActor nor GiveItem accept a name.",
  'cave.position': 'Position',
  'cave.positionHint':
    "SpawnActor places the object relative to your character: ARK has no verified command for absolute world coordinates.",
  'cave.spawnDistance': 'X · Spawn Distance (in front of you)',
  'cave.yOffset': 'Y · Side Offset',
  'cave.zOffset': 'Z · Height Offset',
  'cave.preset.low': 'Close',
  'cave.preset.medium': 'Mid-range',
  'cave.preset.high': 'Far',
  'cave.preset.custom': 'Custom',
  'cave.grid.title': 'Grid (multiple copies)',
  'cave.grid.hint':
    'Generate several copies forming a wall/room: Width = copies along X, Length = copies along Y, Height = copies along Z. 1×1×1 generates a single object.',
  'cave.grid.width': 'Width (copies along X)',
  'cave.grid.length': 'Length (copies along Y)',
  'cave.grid.height': 'Height (copies along Z)',
  'cave.grid.spacingX': 'X Spacing',
  'cave.grid.spacingY': 'Y Spacing',
  'cave.grid.spacingZ': 'Z Spacing',
  'cave.grid.total': 'Will generate {count} SpawnActor command(s), chained with "|".',
  'cave.grid.totalWarning':
    "You're generating {count} copies in a single command: it can get very long and some consoles/RCON tools have a character limit. If it fails, try smaller batches.",
  'cave.rotation': 'Rotation (Pitch / Yaw / Roll)',
  'cave.rotationNote':
    "ARK: Survival Evolved has no verified command for setting an object's rotation on spawn. These values are saved only as a reference in your History/Favorites and are not part of the generated command.",
  'cave.pitch': 'Pitch',
  'cave.yaw': 'Yaw',
  'cave.roll': 'Roll',
  'cave.giveItemNote':
    "ARK has no verified SpawnActor command to place this already-built object in the world: the real command is GiveItem, which hands it to you to place yourself (the game uses your position and aim when you place it).",
  'cave.giveItemOptions': 'GiveItem Options',
  'cave.reset': 'Reset to 0',
  'cave.pending': '⚠ Data pending verification against the official wiki.',
  'cave.val.nameRequired': 'Give it a name to identify it in your History/Favorites.',
  'cave.val.nameTooLong': 'The name should not exceed {max} characters.',
  'cave.val.positionInvalid': 'Position values must be valid numbers.',
  'cave.val.gridInvalid': 'Width, Length and Height must be whole numbers of at least 1.',
  'cave.val.spacingInvalid': 'Spacing values must be valid numbers.',
  'cave.val.rotationInvalid': 'Rotation values must be valid numbers.',
}

export const dictionaries: Record<Lang, Record<TKey, string>> = { es, en }
