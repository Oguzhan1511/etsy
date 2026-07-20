const fs = require('fs');
const path = './src/app/producer-dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace state and add handleSearch
const oldState = `  const [selectedCategory, setSelectedCategory] = useState<string>("T-Shirts");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Search Volume"]);

  const activeCat = categoryDetails[selectedCategory];`;

const newState = `  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeCat, setActiveCat] = useState<CategoryDetail>(categoryDetails["T-Shirts"]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Search Volume"]);

  const handleSearch = (kw: string) => {
    if (!kw.trim()) return;
    const lowerKw = kw.trim().toLowerCase();
    
    // Predefined lookup
    const existingKey = Object.keys(categoryDetails).find(k => k.toLowerCase() === lowerKw);
    if (existingKey) {
       setActiveCat(categoryDetails[existingKey]);
       return;
    }

    // Dynamic mock generation based on hash
    const hash = lowerKw.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const searchVol = 10 + (hash % 150); // 10k to 160k
    const activeSellers = 1 + (hash % 20); // 1k to 21k
    const favRate = (3 + (hash % 50) / 10).toFixed(1); // 3.0% to 8.0%
    const convRate = (1 + (hash % 30) / 10).toFixed(1); // 1.0% to 4.0%
    
    const baseWeekly = (base: number, volatility: number) => {
      return Array.from({length: 7}, (_, i) => {
        const variation = (Math.sin(hash + i) * volatility);
        return Math.max(1, base + variation);
      });
    };

    const searchVolWeekly = baseWeekly(searchVol, searchVol * 0.2).map(v => Math.round(v) + "k");
    const activeSellersWeekly = baseWeekly(activeSellers, activeSellers * 0.05).map(v => v.toFixed(1) + "k");
    const favRateWeekly = baseWeekly(parseFloat(favRate), 0.5).map(v => v.toFixed(1) + "%");
    const convRateWeekly = baseWeekly(parseFloat(convRate), 0.3).map(v => v.toFixed(1) + "%");

    const newMock: CategoryDetail = {
      name: kw.trim(),
      sub: "Custom Merch",
      color: "#7c6af7",
      change: "+12.4% Up",
      trend: "up",
      monthlySales: "~" + (Math.round((searchVol * parseFloat(convRate)) * 10)).toLocaleString() + " orders",
      avgPrice: "$15.00 - $35.00",
      competition: searchVol > 100 ? "High" : (searchVol > 50 ? "Medium" : "Low"),
      hotStyle: "Trendy, Custom Design",
      keywords: [lowerKw, lowerKw + " gift", "custom " + lowerKw],
      recommendedModel: "Premium " + kw.trim(),
      recommendedModelId: "3",
      insight: \`\${kw.trim()} is showing steady activity. Focus on unique designs and high-quality mockups to stand out in this niche.\`,
      lines: [
        {
          name: "Search Volume",
          label: "Search Volume",
          color: "#7c6af7",
          path: "", areaPath: "", points: [], gradientId: "purple-fade",
          value: searchVol + "k queries/mo",
          weeklyValues: searchVolWeekly,
        },
        {
          name: "Active Sellers",
          label: "Active Sellers",
          color: "#3b82f6",
          path: "", areaPath: "", points: [], gradientId: "blue-fade",
          value: activeSellers.toFixed(1) + "k shops",
          weeklyValues: activeSellersWeekly,
        },
        {
          name: "Favorites Rate",
          label: "Favorites Rate",
          color: "#f43f5e",
          path: "", areaPath: "", points: [], gradientId: "red-fade",
          value: favRate + "% fav rate",
          weeklyValues: favRateWeekly,
        },
        {
          name: "Conversion Rate",
          label: "Conversion Rate",
          color: "#22c55e",
          path: "", areaPath: "", points: [], gradientId: "green-fade",
          value: convRate + "% conversion",
          weeklyValues: convRateWeekly,
        }
      ]
    };
    
    setActiveCat(newMock);
  };`;

content = content.replace(oldState, newState);

// 2. Replace all remaining categoryDetails[selectedCategory] with activeCat
content = content.replace(/categoryDetails\[selectedCategory\]/g, 'activeCat');

// 3. Replace the UI tabs with Search input
const oldTabsRegex = /\{\/\* Interactive Navigation Tabs \*\/\}\s*<div className="flex flex-wrap gap-2">\s*\{Object\.keys\(categoryDetails\)\.map\(\(catName\) => \{[\s\S]*?\}\)\}\s*<\/div>/;
const newTabs = `{/* Keyword Search Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(searchKeyword); }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e5a72]" />
              <input 
                type="text" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search niche, product, keyword..."
                className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 w-64 transition-colors placeholder:text-[#5e5a72]"
              />
            </div>
            <button 
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Analyze
            </button>
          </form>`;

content = content.replace(oldTabsRegex, newTabs);

fs.writeFileSync(path, content);
