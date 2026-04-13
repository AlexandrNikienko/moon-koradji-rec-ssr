const fs = require('fs');
const path = require('path');

const base = 'https://www.moonkoradji.com';
const today = new Date().toISOString().split('T')[0];

// Load data
const artistsData = JSON.parse(fs.readFileSync('./src/assets/mocks/artists.json', 'utf8'));
const releasesData = JSON.parse(fs.readFileSync('./src/assets/mocks/releases.json', 'utf8'));

// Static pages
const staticPages = [
  { url: '/',        priority: '1.0', changefreq: 'monthly' },
  { url: '/artists', priority: '0.8', changefreq: 'monthly' },
  { url: '/releases',priority: '0.8', changefreq: 'monthly' },
  { url: '/podcasts', priority: '0.5', changefreq: 'yearly'  },
  { url: '/about',   priority: '0.4', changefreq: 'yearly'  },
  { url: '/legal', priority: '0.3', changefreq: 'yearly' }
];

// Artist pages
const artistPages = artistsData.artists
  .filter(a => a.artistRoute)
  .map(a => ({
    url: `/artists/${a.artistRoute}`,
    priority: a.featured ? '0.9' : a.inactive ? '0.3' : '0.7',
    changefreq: 'monthly',
  }));

// Release pages
const releasePages = releasesData.releases
  .filter(r => r.releaseRoute)
  .map(r => ({
    url: `/releases/${r.releaseRoute}`,
    priority: r.isHero ? '1.0' : (r.isNew && !r.isHero) ? '0.9' : '0.7',
    changefreq: 'monthly',
    lastmod: (() => {
      try {
        const d = new Date(r.releaseDate);
        return isNaN(d) ? today : d.toISOString().split('T')[0];
      } catch {
        return today;
      }
    })(),
  }));

const stylesPages = stylesData.styles
  .filter(s => s.styleRoute)
  .map(s => ({
    url: `/styles/${s.styleRoute}`,
    priority: '0.6',
    changefreq: 'monthly',
  }));

const allPages = [...staticPages, ...artistPages, ...releasePages, ...stylesPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = './public/sitemap.xml';
fs.writeFileSync(outputPath, xml, 'utf8');

console.log(`✅ Sitemap generated → ${outputPath}`);
console.log(`   Static pages  : ${staticPages.length}`);
console.log(`   Artist pages  : ${artistPages.length}`);
console.log(`   Release pages : ${releasePages.length}`);
console.log(`   Total URLs    : ${allPages.length}`);