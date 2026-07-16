'use client';

import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { CivicReport } from '@/lib/types';

const severityMeta: Record<string, { color: string; icon: string }> = {
  Critical: { color: '#ef4444', icon: '!' },
  High: { color: '#f97316', icon: '↯' },
  Medium: { color: '#eab308', icon: '•' },
  Low: { color: '#22c55e', icon: '✓' },
};

function markerIcon(severity: string) {
  const meta = severityMeta[severity] ?? severityMeta.Low;
  return L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:999px;background:${meta.color};color:white;border:3px solid white;box-shadow:0 12px 35px rgba(15,23,42,.35);display:grid;place-items:center;font-weight:900">${meta.icon}</div>`,
  });
}

function LocateUser() {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: false, maxZoom: 14 });
    map.on('locationfound', (event) => {
      L.circleMarker(event.latlng, { radius: 9, color: '#0ea5e9', fillOpacity: 0.8 }).addTo(map).bindPopup('Your current location');
    });
  }, [map]);
  return null;
}

export default function ReportMap({ reports }: { reports: CivicReport[] }) {
  const tileUrl = process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  return (
    <MapContainer center={[40.7138, -74.006]} zoom={14} scrollWheelZoom={false} className="h-[460px] w-full rounded-3xl">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url={tileUrl} />
      <LocateUser />
      {reports.map((report) => {
        const meta = severityMeta[report.severity] ?? severityMeta.Low;
        return (
          <div key={report.id}>
            <Circle center={[report.latitude, report.longitude]} radius={report.impactScore * 4} pathOptions={{ color: meta.color, fillOpacity: 0.08, weight: 1 }} />
            <Marker position={[report.latitude, report.longitude]} icon={markerIcon(report.severity)}>
              <Popup className="civic-popup">
                <div className="w-72 overflow-hidden rounded-2xl">
                  <img src={report.imageUrl} alt="Civic issue" className="mb-3 h-32 w-full rounded-xl object-cover" />
                  <div className="mb-2 flex items-center justify-between"><b>{report.title}</b><span>{report.impactScore}/100</span></div>
                  <p className="text-sm">{report.aiExplanation ?? report.description}</p>
                  <p className="mt-2 text-xs"><b>Status:</b> {report.status} · <b>Confidence:</b> {report.communityConfidence}%</p>
                  <p className="text-xs"><b>Community:</b> {report.confirmations ?? 0} confirmations · {report.evidenceCount ?? 0} evidence uploads</p>
                </div>
              </Popup>
            </Marker>
          </div>
        );
      })}
    </MapContainer>
  );
}
