import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://samorzad.ue.wroc.pl'
  const routes = [
    '/',
    '/dla-studenta', '/prawa-studenta', '/infopacki', '/rzecznik-praw-studenta',
    '/stypendia', '/mapa-kampusu', '/wladze-rektorskie', '/dziekan-i-prodziekani',
    '/prawo-dla-studenta', '/pomoc-psychologiczna', '/ankiety-dydaktyczne',
    '/nasza-dzialalnosc', '/struktura-samorzadu', '/zarzad',
    '/przewodniczacy-i-wiceprzewodniczacy', '/rada-uczelniana',
    '/komisja-rewizyjna', '/studencka-komisja-wyborcza', '/filia-jelenia-gora',
    '/nasze-projekty', '/regulacje-wewnetrzne', '/wspolprace',
    '/nasi-partnerzy', '/formularz',
  ]
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))
}
