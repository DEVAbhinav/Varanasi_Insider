const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '../content/en');
const HI_DIR = path.join(__dirname, '../content/hi');

// Function to recursively get all .md files in a directory
function getAllMdFiles(dir, baseDir = dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, baseDir, fileList);
    } else if (file.endsWith('.md')) {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, filePath);
      fileList.push(relativePath);
    }
  });
  
  return fileList;
}

// Get all English and Hindi markdown files
const enFiles = getAllMdFiles(EN_DIR);
const hiFiles = getAllMdFiles(HI_DIR);

// Convert arrays to sets for easier comparison
const enFilesSet = new Set(enFiles);
const hiFilesSet = new Set(hiFiles);

// Find files without Hindi translation
const missingHindiFiles = enFiles.filter(file => !hiFilesSet.has(file));

// Find Hindi files without English counterpart (orphaned translations)
const orphanedHindiFiles = hiFiles.filter(file => !enFilesSet.has(file));

// Categorize files by type
function categorizeFiles(files) {
  const categories = {
    guides: [],
    services: [],
    packages: [],
    landing: [],
    json: [],
    tempoTraveller: [],
    tours: [],
    ghats: [],
    events: [],
    seasonal: [],
    root: []
  };
  
  files.forEach(file => {
    if (file.startsWith('guides/')) {
      categories.guides.push(file);
    } else if (file.startsWith('services/')) {
      categories.services.push(file);
    } else if (file.startsWith('packages/')) {
      categories.packages.push(file);
    } else if (file.startsWith('landing/')) {
      categories.landing.push(file);
    } else if (file.startsWith('json/')) {
      categories.json.push(file);
    } else if (file.includes('tempo-traveller')) {
      categories.tempoTraveller.push(file);
    } else if (file.includes('tour') || file.includes('package')) {
      categories.tours.push(file);
    } else if (file.includes('ghat')) {
      categories.ghats.push(file);
    } else if (file.includes('deepawali') || file.includes('navratri') || file.includes('shivaratri') || 
               file.includes('ramlila') || file.includes('dussehra') || file.includes('makar-sankranti')) {
      categories.events.push(file);
    } else if (file.includes('october') || file.includes('november') || file.includes('december') || 
               file.includes('january') || file.includes('february') || file.includes('monsoon')) {
      categories.seasonal.push(file);
    } else {
      categories.root.push(file);
    }
  });
  
  return categories;
}

// Generate statistics
const stats = {
  totalEnFiles: enFiles.length,
  totalHiFiles: hiFiles.length,
  missingHindiCount: missingHindiFiles.length,
  orphanedHindiCount: orphanedHindiFiles.length,
  translationCoverage: ((hiFiles.length / enFiles.length) * 100).toFixed(2)
};

// Categorize missing files
const categorizedMissing = categorizeFiles(missingHindiFiles);

// Generate HTML Report
function generateHTMLReport() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Translation Audit - Varanasi Insider</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .glassmorphism {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .category-card {
            transition: all 0.3s ease;
        }
        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        .progress-ring {
            transition: stroke-dashoffset 0.5s ease;
        }
    </style>
</head>
<body class="antialiased min-h-screen py-12 px-4">
    <div class="container mx-auto max-w-7xl">
        <!-- Header -->
        <div class="glassmorphism rounded-2xl shadow-2xl p-8 mb-8">
            <div class="text-center">
                <h1 class="text-5xl font-bold text-gray-900 mb-3">Content Translation Audit</h1>
                <p class="text-xl text-gray-600 mb-4">Varanasi Insider - English to Hindi Coverage Analysis</p>
                <p class="text-sm text-gray-500">Generated on ${new Date().toLocaleString()}</p>
            </div>
        </div>

        <!-- Key Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm font-medium">Total EN Pages</p>
                        <p class="text-4xl font-bold text-blue-600 mt-2">${stats.totalEnFiles}</p>
                    </div>
                    <div class="bg-blue-100 rounded-full p-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm font-medium">Total HI Pages</p>
                        <p class="text-4xl font-bold text-green-600 mt-2">${stats.totalHiFiles}</p>
                    </div>
                    <div class="bg-green-100 rounded-full p-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm font-medium">Missing Hindi</p>
                        <p class="text-4xl font-bold text-red-600 mt-2">${stats.missingHindiCount}</p>
                    </div>
                    <div class="bg-red-100 rounded-full p-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm font-medium">Coverage</p>
                        <p class="text-4xl font-bold text-purple-600 mt-2">${stats.translationCoverage}%</p>
                    </div>
                    <div class="bg-purple-100 rounded-full p-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Visualization Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Translation Coverage</h2>
                <div class="flex items-center justify-center" style="height: 300px;">
                    <canvas id="coverageChart"></canvas>
                </div>
            </div>

            <div class="glassmorphism rounded-xl p-6 shadow-lg">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Missing by Category</h2>
                <div style="height: 300px;">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Missing Files by Category -->
        <div class="glassmorphism rounded-2xl shadow-2xl p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Missing Hindi Translations by Category</h2>
            
            ${Object.entries(categorizedMissing)
              .filter(([_, files]) => files.length > 0)
              .map(([category, files]) => `
                <div class="category-card bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-gray-800 capitalize">${category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">${files.length} missing</span>
                    </div>
                    <ul class="space-y-2">
                        ${files.map(file => `
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                <span class="text-gray-700 font-mono text-sm">${file}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        ${orphanedHindiFiles.length > 0 ? `
        <!-- Orphaned Hindi Files -->
        <div class="glassmorphism rounded-2xl shadow-2xl p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Orphaned Hindi Files</h2>
            <p class="text-gray-600 mb-6">These Hindi files don't have English counterparts. They might be Hindi-specific content or need cleanup.</p>
            <div class="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <ul class="space-y-2">
                    ${orphanedHindiFiles.map(file => `
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <span class="text-gray-700 font-mono text-sm">${file}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        ` : ''}

        <!-- Priority Recommendations -->
        <div class="glassmorphism rounded-2xl shadow-2xl p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Translation Priority Recommendations</h2>
            
            <div class="space-y-4">
                <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <h3 class="text-lg font-bold text-red-800 mb-2">🔴 High Priority</h3>
                    <p class="text-red-700 mb-3">Core service pages and landing pages - these drive conversions</p>
                    <ul class="list-disc list-inside text-red-600 space-y-1">
                        <li>Services directory pages (${categorizedMissing.services.length} missing)</li>
                        <li>Landing pages (${categorizedMissing.landing.length} missing)</li>
                        <li>Packages directory pages (${categorizedMissing.packages.length} missing)</li>
                    </ul>
                </div>

                <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                    <h3 class="text-lg font-bold text-orange-800 mb-2">🟠 Medium Priority</h3>
                    <p class="text-orange-700 mb-3">Popular content and tempo traveller pages - high traffic generators</p>
                    <ul class="list-disc list-inside text-orange-600 space-y-1">
                        <li>Tempo Traveller pages (${categorizedMissing.tempoTraveller.length} missing)</li>
                        <li>Event/Festival guides (${categorizedMissing.events.length} missing)</li>
                        <li>Ghat guides (${categorizedMissing.ghats.length} missing)</li>
                    </ul>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <h3 class="text-lg font-bold text-yellow-800 mb-2">🟡 Normal Priority</h3>
                    <p class="text-yellow-700 mb-3">Seasonal and guide content - good for SEO but time-sensitive</p>
                    <ul class="list-disc list-inside text-yellow-600 space-y-1">
                        <li>Seasonal guides (${categorizedMissing.seasonal.length} missing)</li>
                        <li>General guides (${categorizedMissing.guides.length} missing)</li>
                        <li>Tour packages (${categorizedMissing.tours.length} missing)</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Action Items -->
        <div class="glassmorphism rounded-2xl shadow-2xl p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Recommended Actions</h2>
            
            <div class="space-y-4">
                <div class="flex items-start bg-blue-50 p-4 rounded-lg">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                    <div>
                        <h4 class="font-bold text-gray-900 mb-1">Prioritize High-Value Pages</h4>
                        <p class="text-gray-700">Focus on translating service pages, landing pages, and core tempo traveller content first as these drive the most conversions.</p>
                    </div>
                </div>

                <div class="flex items-start bg-blue-50 p-4 rounded-lg">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                    <div>
                        <h4 class="font-bold text-gray-900 mb-1">Review Orphaned Files</h4>
                        <p class="text-gray-700">Check the ${orphanedHindiFiles.length} orphaned Hindi files to determine if they need English versions or should be removed.</p>
                    </div>
                </div>

                <div class="flex items-start bg-blue-50 p-4 rounded-lg">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                    <div>
                        <h4 class="font-bold text-gray-900 mb-1">Maintain Directory Structure</h4>
                        <p class="text-gray-700">When translating, ensure the Hindi content maintains the same directory structure as English for consistency.</p>
                    </div>
                </div>

                <div class="flex items-start bg-blue-50 p-4 rounded-lg">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                    <div>
                        <h4 class="font-bold text-gray-900 mb-1">Set Up Translation Workflow</h4>
                        <p class="text-gray-700">Establish a process where new English content automatically triggers a Hindi translation task.</p>
                    </div>
                </div>

                <div class="flex items-start bg-blue-50 p-4 rounded-lg">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">5</span>
                    <div>
                        <h4 class="font-bold text-gray-900 mb-1">Monitor Coverage Metrics</h4>
                        <p class="text-gray-700">Run this audit regularly to track translation progress. Aim for at least 80% coverage across all categories.</p>
                    </div>
                </div>
            </div>
        </div>

        <footer class="text-center mt-12 text-white">
            <p class="text-sm opacity-75">Content Translation Audit Tool v1.0 | Varanasi Insider</p>
        </footer>
    </div>

    <script>
        // Coverage Doughnut Chart
        const coverageCtx = document.getElementById('coverageChart').getContext('2d');
        new Chart(coverageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Translated', 'Missing Translation'],
                datasets: [{
                    data: [${stats.totalHiFiles}, ${stats.missingHindiCount}],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 14, weight: 'bold' },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = ${stats.totalEnFiles};
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });

        // Category Bar Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        const categoryData = ${JSON.stringify(
          Object.entries(categorizedMissing)
            .filter(([_, files]) => files.length > 0)
            .map(([category, files]) => ({ category, count: files.length }))
        )};
        
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: categoryData.map(d => d.category.replace(/([A-Z])/g, ' $1').trim()),
                datasets: [{
                    label: 'Missing Translations',
                    data: categoryData.map(d => d.count),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: { size: 12 }
                        }
                    },
                    y: {
                        ticks: {
                            font: { size: 12, weight: 'bold' }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>`;

  return html;
}

// Generate JSON report for programmatic use
function generateJSONReport() {
  return JSON.stringify({
    generatedAt: new Date().toISOString(),
    statistics: stats,
    missingTranslations: {
      total: missingHindiFiles.length,
      byCategory: categorizedMissing,
      files: missingHindiFiles
    },
    orphanedHindiFiles: {
      total: orphanedHindiFiles.length,
      files: orphanedHindiFiles
    },
    allEnglishFiles: enFiles,
    allHindiFiles: hiFiles
  }, null, 2);
}

// Write reports
const htmlReport = generateHTMLReport();
const jsonReport = generateJSONReport();

fs.writeFileSync(path.join(__dirname, '../docs/CONTENT-TRANSLATION-AUDIT.html'), htmlReport);
fs.writeFileSync(path.join(__dirname, '../docs/CONTENT-TRANSLATION-AUDIT.json'), jsonReport);

// Console output
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     CONTENT TRANSLATION AUDIT - VARANASI INSIDER           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📊 STATISTICS:');
console.log(`   Total English Pages:      ${stats.totalEnFiles}`);
console.log(`   Total Hindi Pages:        ${stats.totalHiFiles}`);
console.log(`   Missing Hindi:            ${stats.missingHindiCount}`);
console.log(`   Translation Coverage:     ${stats.translationCoverage}%`);
console.log(`   Orphaned Hindi Files:     ${stats.orphanedHindiCount}\n`);

console.log('📁 MISSING BY CATEGORY:');
Object.entries(categorizedMissing)
  .filter(([_, files]) => files.length > 0)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([category, files]) => {
    console.log(`   ${category.padEnd(20)} ${files.length} missing`);
  });

console.log('\n✅ Reports Generated:');
console.log('   - docs/CONTENT-TRANSLATION-AUDIT.html (Interactive Dashboard)');
console.log('   - docs/CONTENT-TRANSLATION-AUDIT.json (Data Export)');

console.log('\n🎯 PRIORITY ACTIONS:');
console.log(`   1. HIGH:   Translate ${categorizedMissing.services.length} service pages + ${categorizedMissing.landing.length} landing pages`);
console.log(`   2. MEDIUM: Translate ${categorizedMissing.tempoTraveller.length} tempo traveller pages`);
console.log(`   3. NORMAL: Translate ${categorizedMissing.guides.length} guides + ${categorizedMissing.seasonal.length} seasonal content`);
console.log('\n✨ Open docs/CONTENT-TRANSLATION-AUDIT.html in your browser for detailed analysis!\n');
