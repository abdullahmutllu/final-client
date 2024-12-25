export interface PathInfo {
    id: string | null
    toll?: string | null
    surface?: string | null
    ref?: string | null
    oneway?: string | null
    name?: string | null
    maxSpeed?: string | null
    lanes?: string | null
    intRef?: string | null
    highway?: string | null
    description?: string | null
    destination?: string | null
    altName?: string | null
    coordinates: [number, number][] | null
    Centroid?: string
  }