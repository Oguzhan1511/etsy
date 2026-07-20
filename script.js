const fs = require('fs');
const path = './src/app/producer-dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Chart hooks and data generation
content = content.replace(
  /const \[selectedMetric, setSelectedMetric\] = useState<string>\("Search Volume"\);\s+const activeCat = categoryDetails\[selectedCategory\];\s+const activeLine = activeCat\.lines\.find\(l => l\.name === selectedMetric\) \|\| activeCat\.lines\[0\];\s+const days = \["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"\];\s+const chartData = days\.map\(\(day, i\) => \{\s+const rawValue = activeLine\.weeklyValues\[i\];\s+const numVal = parseFloat\(rawValue\.replace\(\/\[\^0-9\.\]\/g, ''\)\);\s+return \{\s+name: day,\s+\[activeLine\.name\]: numVal,\s+originalString: rawValue\s+\};\s+\}\);/,
  `const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Search Volume"]);

  const activeCat = categoryDetails[selectedCategory];
  const activeLines = activeCat.lines.filter(l => selectedMetrics.includes(l.name));
  if (activeLines.length === 0) activeLines.push(activeCat.lines[0]);
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day, i) => {
    const dataObj: any = { name: day };
    const originalString: any = {};
    activeLines.forEach(line => {
       const rawValue = line.weeklyValues[i];
       const numVal = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
       dataObj[line.name] = numVal;
       originalString[line.name] = rawValue;
    });
    dataObj.originalString = originalString;
    return dataObj;
  });`
);

// 2. Metric Cards typography
content = content.replace(/text-2xl font-bold/g, 'text-3xl font-extrabold');
content = content.replace(/bg-purple-500\/10 px-2 py-0\.5 rounded-full border border-purple-500\/15/g, 'bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 text-xs');
content = content.replace(/bg-blue-500\/10 px-2 py-0\.5 rounded-full border border-blue-500\/15/g, 'bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 text-xs');
content = content.replace(/bg-amber-500\/10 px-2 py-0\.5 rounded-full border border-amber-500\/15/g, 'bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 text-xs');
content = content.replace(/bg-emerald-500\/10 px-2 py-0\.5 rounded-full border border-emerald-500\/15/g, 'bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 text-xs');

// Draft translations
content = content.replace(/Draft Ürünler/g, 'Draft Blueprints');

// Button string
content = content.replace(/<span>\{categoryDetails\[selectedCategory\]\.recommendedModel\} Design<\/span>/g, '<span>Design {categoryDetails[selectedCategory].recommendedModel}</span>');

fs.writeFileSync(path, content);
