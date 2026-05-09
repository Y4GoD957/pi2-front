import { useEffect, useState } from 'react'

import { fetchDfGeojson } from '@/services/educenso/dfHeatmapService'
import type { GeoRegionCollection } from '../maps/types'

let _cache: GeoRegionCollection | null = null

export function useDfGeojson() {
  const [data, setData] = useState<GeoRegionCollection | null>(_cache)
  const [isLoading, setIsLoading] = useState(_cache === null)

  useEffect(() => {
    if (_cache) return

    let isMounted = true

    void fetchDfGeojson()
      .then((response) => {
        _cache = response
        if (isMounted) setData(response)
      })
      .catch(() => {
        // Silently fall back — DfHeatMap usa o polígono embutido
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { data, isLoading }
}
