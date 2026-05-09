export interface GeoRegionFeatureProperties {
  id: string
  name: string
  uf?: string
  ibge_code?: string
  [key: string]: unknown
}

export interface GeoPolygonGeometry {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface GeoMultiPolygonGeometry {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

export interface GeoRegionFeature {
  type: 'Feature'
  properties: GeoRegionFeatureProperties
  geometry: GeoPolygonGeometry | GeoMultiPolygonGeometry
}

export interface GeoRegionCollection {
  type: 'FeatureCollection'
  features: GeoRegionFeature[]
}
