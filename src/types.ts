/* ===========================================================================
   Tipos de datos de ARK Command Center.
   Todo el proyecto apunta a ARK: Survival Evolved (ASE). Las entradas
   exclusivas de ARK: Survival Ascended NO se incluyen en las bases de datos.
   =========================================================================== */

export type CreatureMovement = 'Land' | 'Flying' | 'Aquatic'

export type CreatureVariant =
  | 'Normal'
  | 'Alpha'
  | 'Tek'
  | 'Aberrant'
  | 'X'
  | 'R'
  | 'Corrupted'
  | 'Brute'
  | 'Boss'
  | 'Event'

export type CreatureDLC =
  | 'The Island'
  | 'Scorched Earth'
  | 'Aberration'
  | 'Extinction'
  | 'Genesis: Part 1'
  | 'Genesis: Part 2'
  | 'Crystal Isles'
  | 'Lost Island'
  | 'Fjordur'
  | 'Ragnarok'
  | 'Valguero'

export interface Creature {
  id: string
  name: string
  /** Entity ID / class name, p. ej. Rex_Character_BP_C (Summon / GMSummon). */
  className: string
  /** Ruta completa usada por SpawnDino y SpawnExactDino. */
  blueprintPath: string
  /** Grupo del wiki: Dinosaurs, Mammals, Bosses, ... */
  group: string
  dlc: CreatureDLC
  variant: CreatureVariant
  movement: CreatureMovement
  /** Terminos extra para la busqueda instantanea. */
  tags: string[]
}

export type ItemCategory =
  | 'Resources'
  | 'Weapons'
  | 'Armor'
  | 'Saddles'
  | 'Structures'
  | 'Consumables'
  | 'Ammo'
  | 'Tools'
  | 'Artifacts'
  | 'Tributes'
  | 'Cosmetics'
  | 'Other'

export interface Item {
  id: string
  name: string
  category: ItemCategory
  className: string
  blueprintPath: string
  /** ID numerico legacy para GiveItemNum. Ausente = el item no tiene uno confirmado. */
  itemNumId?: number
  stackSize?: number
  canBeBlueprint: boolean
  /** true = ruta confirmada contra el wiki oficial al generar el archivo. */
  verified: boolean
  tags: string[]
}

export interface ArkColor {
  id: string
  /** ID numerico real de ARK (0 = sin color, 1-100 base, 201-226 tintes ASE). */
  colorId: number
  name: string
  hex: string
  group: 'Base' | 'Dye' | 'Special'
  search: string
  note?: string
}

export interface LevelPreset {
  id: string
  label: string
  /** Puntos por stat. null = Custom (no toca los valores del usuario). */
  statPoints: number | null
  statSlots: number
  description: string
}

export interface ColorPreset {
  id: string
  label: string
  /** 6 IDs de color (regiones 0-5). null = Custom. */
  colors: number[] | null
  description: string
}

export interface SpawnPresets {
  _doc: { statOrder: string[]; notes: string[] }
  levelPresets: LevelPreset[]
  colorPresets: ColorPreset[]
}

export type CommandParamType = 'creature' | 'item' | 'number' | 'text' | 'boolean' | 'player'

export interface CommandParam {
  name: string
  type: CommandParamType
  description: string
  optional?: boolean
  default?: string | number | boolean
}

export interface CommandDef {
  id: string
  name: string
  description: string
  syntax: string
  example: string
  params: CommandParam[]
  category: 'Spawning' | 'Player' | 'World' | 'Cheats' | 'Server'
}

export interface HistoryEntry {
  id: string
  label: string
  command: string
  timestamp: number
}

export type GameVersion = 'ASE' | 'ASA'
export type SpawnCommandType = 'SpawnDino' | 'GMSummon' | 'Summon'
/** Prefijo de consola: `cheat` (single player) o `admincheat` (servidor). */
export type CheatPrefix = 'cheat' | 'admincheat'

/* ===========================================================================
   Custom Caves.

   IMPORTANTE (verificado contra el wiki oficial y ejemplos reales de
   servidores que usan SpawnActor para construir Custom Caves):
   - El Tribute Terminal (Obelisco) no es un item colocable: los admins lo
     regeneran con `SpawnActor "Blueprint'.../TributeTerminal_<Color>...'"`,
     que coloca el actor relativo a la posicion y mira del jugador
     (SpawnDistance/YOffset/ZOffset). Ese comando NO acepta un parametro de
     rotacion ni de nombre.
   - El Loadout Mannequin tiene un blueprint de actor YA COLOCADO, distinto
     de su item craftable: `Structure_LoadoutDummy_Hotbar`, verificado en el
     wiki de mods de Genesis: Part 2 y usado en listas de comandos de
     Custom Caves reales. Tambien se coloca con `SpawnActor` y las mismas
     reglas (sin rotacion, sin nombre).
   - El Water Well SI es un item colocable (PrimalItemStructure_WaterWell):
     su comando de spawn real y verificado es `GiveItem` (el jugador lo
     coloca a mano despues, sobre una Veta de Agua). No encontre un
     blueprint de "actor ya colocado" verificado para el Water Well
     (a diferencia del Loadout Mannequin), asi que no se inventa un
     SpawnActor para este.
   =========================================================================== */

export type CustomCaveType = 'tributeTerminal' | 'loadoutMannequin' | 'waterWell'

/** Metodo de comando real usado para cada tipo de objeto (ver nota arriba). */
export type CustomCaveCommandMethod = 'SpawnActor' | 'GiveItem'

/**
 * single = un solo objeto. grid = cuadricula 3D (Width/Length/Height, como
 * la usan las listas reales de "hallway" de mannequins). text = arma letras
 * con una fuente de puntos 5x7 propia del proyecto (ver src/data/pixelFont.ts),
 * colocando el objeto solo en los "pixeles" encendidos de cada letra.
 */
export type CustomCaveMode = 'single' | 'grid' | 'text'

export interface CustomCaveVariant {
  id: string
  /** Clave de traduccion corta, p. ej. "red" -> cave.variant.red */
  labelKey: string
  blueprintPath: string
}

export interface CustomCaveObjectDef {
  type: CustomCaveType
  /** Nombre del icono de lucide-react (ver ICONS en CustomCaveTypeSelector). */
  icon: string
  commandMethod: CustomCaveCommandMethod
  /** true solo para SpawnActor: GiveItem no coloca el objeto en el mundo. */
  supportsPosition: boolean
  /** Ningun comando real soporta rotacion todavia: siempre false por ahora. */
  supportsRotation: boolean
  /** Blueprint del item, usado cuando commandMethod es GiveItem. */
  itemBlueprintPath?: string
  /** Variantes (colores de terminal), usadas cuando commandMethod es SpawnActor. */
  variants?: CustomCaveVariant[]
  /** true = ruta confirmada contra el wiki oficial. */
  verified: boolean
}

export interface CustomCaveConfig {
  type: CustomCaveType
  variantId?: string
  /** Solo para identificar la entrada en Historial/Favoritos; no viaja en el comando. */
  name: string
  /** Solo aplica a SpawnActor. */
  mode: CustomCaveMode
  /** Posicion de la primera copia / origen del texto (relativa al jugador). */
  spawnDistance: number
  yOffset: number
  zOffset: number
  /**
   * Cuadricula de copias (modo "grid"): Width = columnas en X, Length =
   * columnas en Y, Height = columnas en Z. Cada copia se separa por
   * spacingX/Y/Z y todas se encadenan en un unico comando con " | ", igual
   * que las listas reales de "Custom Cave" de la comunidad (ver arriba).
   */
  width: number
  length: number
  height: number
  spacingX: number
  spacingY: number
  spacingZ: number
  /**
   * Modo "text": el texto a escribir (A-Z, 0-9, espacios y algo de
   * puntuacion) y las columnas de separacion entre letras. Reutiliza
   * spacingY (paso horizontal entre "pixeles") y spacingZ (paso vertical);
   * spawnDistance queda fijo como la distancia de la pared frente al
   * jugador, y yOffset/zOffset son la esquina inferior-izquierda del texto.
   */
  text: string
  letterGap: number
  /** Guardados solo como referencia (ver CustomCaveObjectDef.supportsRotation). */
  pitch: number
  yaw: number
  roll: number
  quantity: number
  quality: number
  blueprint: boolean
  prefix: CheatPrefix
}
