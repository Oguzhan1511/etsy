const fs = require('fs');
const path = './src/app/producer-dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Cloud to lucide-react imports
if (!content.includes('Cloud,')) {
  content = content.replace(/Users/, 'Users,\n  Cloud');
}

// 2. Draft Queue: Replace image with fallback logic
// Let's create an inline component at the top or just replace the img tag directly.
// The easiest is replacing the img tag with an inline React component or just an img with onError that sets state. But we can't easily set state per item without a component. 
// A simple inline fallback is just showing the Package icon if the image is broken.
// We can do this with inline state in a new component, but it's simpler to just make a FallbackImage component inside the file.
if (!content.includes('const FallbackImage')) {
  const fallbackComponent = `
const FallbackImage = ({ src, alt }: { src: string, alt: string }) => {
  const [error, setError] = React.useState(false);
  return error ? (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-[#5e5a72]">
      <Package size={16} className="mb-0.5 opacity-50"/>
    </div>
  ) : (
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />
  );
};

export default function ProducerDashboardPage`;
  content = content.replace(/export default function ProducerDashboardPage/, fallbackComponent);
}

// Replace the img tag in the table
content = content.replace(
  /<img src=\{p.image\} alt=\{p.name\} className="w-full h-full object-cover" \/>/g,
  '<FallbackImage src={p.image} alt={p.name} />'
);

// 3. Draft Queue: Publish button Add Cloud icon and Publishing... text
content = content.replace(
  /<button\s+onClick=\{\(\) => handlePublishDraft\(p\.id\)\}\s+className="px-3\.5 py-1\.5 rounded-lg text-xs font-bold text-white bg-purple-500\/20 border border-purple-500\/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"\s+>\s+Publish to Etsy\s+<\/button>/,
  `<button
                        onClick={() => handlePublishDraft(p.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Cloud size={14} />
                        <span>Publish to Etsy</span>
                      </button>`
);

content = content.replace(/Syncing\.\.\./g, 'Publishing...');

// 4. Metric toggle buttons (make them toggle an array)
content = content.replace(
  /onClick=\{\(\) => setSelectedMetric\(l\.name\)\}/,
  `onClick={() => {
                          if (selectedMetrics.includes(l.name)) {
                            if (selectedMetrics.length > 1) {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== l.name));
                            }
                          } else {
                            setSelectedMetrics([...selectedMetrics, l.name]);
                          }
                        }}`
);

// Remove the onMouseEnter so it doesn't accidentally change state heavily while moving cursor
content = content.replace(/onMouseEnter=\{\(\) => setSelectedMetric\(l\.name\)\}/g, '');

// 5. Chart Multi-line rendering & Remove static labels
const oldArea = `<Area 
                    type="monotone" 
                    dataKey={activeLine.name} 
                    stroke={activeLine.color} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={\`url(#grad-\${activeLine.name.replace(/\\s+/g, '-')})\`}
                    activeDot={{ r: 7, strokeWidth: 2, stroke: '#16161e' }}
                    animationDuration={600}
                  >
                    <LabelList 
                      dataKey="originalString" 
                      position="top" 
                      offset={12}
                      fill="#ffffff"
                      fontSize={10}
                      fontWeight="bold"
                    />
                  </Area>`;

const newArea = `{activeLines.map(line => (
                    <Area 
                      key={line.name}
                      type="monotone" 
                      dataKey={line.name} 
                      stroke={line.color} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill={\`url(#grad-\${line.name.replace(/\\s+/g, '-')})\`}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#16161e' }}
                      animationDuration={600}
                    />
                  ))}`;

content = content.replace(oldArea, newArea);

// Also need to fix Tooltip formatter for multiple tooltips at once
const oldTooltipFormatter = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any, props: any) => {
                      return [props.payload.originalString, name];
                    }}`;
const newTooltipFormatter = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any, props: any) => {
                      return [props.payload.originalString[name], name];
                    }}`;
content = content.replace(oldTooltipFormatter, newTooltipFormatter);

// Add multiple defs
const oldDefs = `<defs>
                    <linearGradient id={\`grad-\${activeLine.name.replace(/\\s+/g, '-')}\`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeLine.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={activeLine.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>`;
const newDefs = `<defs>
                    {activeLines.map(line => (
                      <linearGradient key={line.name} id={\`grad-\${line.name.replace(/\\s+/g, '-')}\`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={line.color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={line.color} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>`;
content = content.replace(oldDefs, newDefs);


// Clean up remaining translations
content = content.replace(/Etsy Draft Publishing Queue \(Yayınlanmamış Ürünler\)/g, 'Etsy Draft Publishing Queue');

fs.writeFileSync(path, content);
