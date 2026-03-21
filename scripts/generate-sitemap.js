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
//   { url: '/contact', priority: '0.4', changefreq: 'yearly'  },
];

// Artist pages — skip inactive artists
const artistPages = artistsData.artists
  .filter(a => !a.inactive && a.artistRoute)
  .map(a => ({
    url: `/artists/${a.artistRoute}`,
    priority: a.featured ? '0.9' : '0.7',
    changefreq: 'monthly',
  }));

// Release pages
const releasePages = releasesData.releases
  .filter(r => r.releaseRoute)
  .map(r => ({
    url: `/releases/${r.releaseRoute}`,
    priority: r.isNew ? '1.0' : r.isHero ? '0.9' : '0.7',
    changefreq: 'yearly',
    lastmod: (() => {
      try {
        const d = new Date(r.releaseDate);
        return isNaN(d) ? today : d.toISOString().split('T')[0];
      } catch {
        return today;
      }
    })(),
  }));

const allPages = [...staticPages, ...artistPages, ...releasePages];

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
console.log(`   Artist pages  : ${artistPages.length} (active only)`);
console.log(`   Release pages : ${releasePages.length}`);
console.log(`   Total URLs    : ${allPages.length}`);