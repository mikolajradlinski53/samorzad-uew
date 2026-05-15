import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Samorząd Studentów UEW'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #EAF5FF 0%, #ffffff 50%, #EAF5FF 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#3BAEFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
          }}
        >
          S
        </div>
        <div style={{ fontSize: 52, fontWeight: 'bold', color: '#1A2340', textAlign: 'center', maxWidth: 900 }}>
          Samorząd Studentów UEW
        </div>
        <div style={{ fontSize: 26, color: '#6B7A99', textAlign: 'center', maxWidth: 700 }}>
          Uniwersytet Ekonomiczny we Wrocławiu
        </div>
        <div
          style={{
            marginTop: 16,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 40,
            background: '#3BAEFF',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          samorzad.ue.wroc.pl
        </div>
      </div>
    ),
    { ...size }
  )
}
