import type { GeoRegionCollection } from '../types'

// Simplified DF boundary — UF level, public domain (IBGE).
// Coordinates are approximate for visualization purposes.
// Future: replace features[] with precise administrative-region polygons per RA.
export const dfBoundary: GeoRegionCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'df',
        name: 'Distrito Federal',
        uf: 'DF',
        ibge_code: '53',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-48.2776, -15.5000],
            [-48.2270, -15.4987],
            [-48.1027, -15.5081],
            [-47.9559, -15.4997],
            [-47.8517, -15.5490],
            [-47.7404, -15.5494],
            [-47.6299, -15.5499],
            [-47.5193, -15.5499],
            [-47.3094, -15.5501],
            [-47.3086, -15.7202],
            [-47.3086, -15.8903],
            [-47.3086, -16.0524],
            [-47.5193, -16.0528],
            [-47.7299, -16.0530],
            [-47.9404, -16.0530],
            [-48.1510, -16.0530],
            [-48.2778, -16.0528],
            [-48.2777, -15.8202],
            [-48.2776, -15.6601],
            [-48.2776, -15.5000],
          ],
        ],
      },
    },
  ],
}
