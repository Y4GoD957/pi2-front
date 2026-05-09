import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { GeoRegionCollection } from '../maps/types'

export interface MapAreaData {
  id: string
  label: string
  normalizedValue: number
  metricValue: number
  metricLabel: string
  year?: number
}

interface DfLeafletMapProps {
  areas: MapAreaData[]
  geoData: GeoRegionCollection
}

const DF_CENTER: L.LatLngTuple = [-15.78, -47.93]
const DF_ZOOM = 9

function resolveColor(normalizedValue: number): string {
  if (normalizedValue >= 0.8) return '#dc2626'
  if (normalizedValue >= 0.6) return '#f97316'
  if (normalizedValue >= 0.4) return '#f59e0b'
  if (normalizedValue >= 0.2) return '#60a5fa'
  return '#dbeafe'
}

function buildTooltipHtml(area: MapAreaData): string {
  const year = area.year ? ` (${area.year})` : ''
  return `
    <div style="min-width:160px;font-family:inherit">
      <p style="font-weight:600;margin:0 0 4px">${area.label}</p>
      <p style="margin:0;font-size:12px;color:#475569">${area.metricLabel}${year}</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:700">${area.metricValue.toFixed(1)}</p>
    </div>
  `
}

export function DfLeafletMap({ areas, geoData }: DfLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.GeoJSON | null>(null)

  // Initialize map once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: DF_CENTER,
      zoom: DF_ZOOM,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 13,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  // Add or update GeoJSON layer when geoData changes (new region set)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (layerRef.current) {
      layerRef.current.remove()
      layerRef.current = null
    }

    const primaryArea = areas[0]
    const color = primaryArea ? resolveColor(primaryArea.normalizedValue) : '#dbeafe'

    const layer = L.geoJSON(geoData as Parameters<typeof L.geoJSON>[0], {
      style: (feature) => {
        const featureId = (feature?.properties as { id?: string } | null)?.id ?? ''
        const area = areas.find((a) => a.id === featureId) ?? primaryArea
        return {
          fillColor: area ? resolveColor(area.normalizedValue) : color,
          fillOpacity: 0.55,
          color: '#0891b2',
          weight: 2,
          opacity: 0.9,
        }
      },
      onEachFeature: (feature, featureLayer) => {
        const featureId = (feature.properties as { id?: string } | null)?.id ?? ''
        const area = areas.find((a) => a.id === featureId) ?? primaryArea
        if (area) {
          featureLayer.bindTooltip(buildTooltipHtml(area), {
            permanent: false,
            sticky: true,
            opacity: 0.97,
          })
        }
      },
    }).addTo(map)

    layerRef.current = layer
  }, [geoData, areas])

  // Update fill color when areas data changes without rebuilding geoData
  useEffect(() => {
    const layer = layerRef.current
    if (!layer || !areas.length) return

    layer.eachLayer((featureLayer) => {
      const fl = featureLayer as L.Path & { feature?: { properties?: { id?: string } } }
      const featureId = fl.feature?.properties?.id ?? ''
      const area = areas.find((a) => a.id === featureId) ?? areas[0]
      if (area) {
        fl.setStyle({
          fillColor: resolveColor(area.normalizedValue),
          fillOpacity: 0.55,
        })
        ;(fl as unknown as L.Layer & { setTooltipContent?: (c: string) => void })
          .setTooltipContent?.(buildTooltipHtml(area))
      }
    })
  }, [areas])

  return (
    <div
      ref={containerRef}
      className="h-[26rem] w-full rounded-3xl overflow-hidden"
      aria-label="Mapa do Distrito Federal"
    />
  )
}
