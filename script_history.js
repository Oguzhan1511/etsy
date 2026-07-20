const fs = require('fs');

// --- File 1: product-research/page.tsx ---
const prPath = './src/app/product-research/page.tsx';
let prContent = fs.readFileSync(prPath, 'utf8');

// Insert saveToHistory function and update handleCardClick
const oldCardClick = `  const handleCardClick = (product: Product) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };`;

const newCardClick = `  const saveToHistory = (product: Product) => {
    if (typeof window === "undefined") return;
    try {
      const hist = JSON.parse(localStorage.getItem("researched_products_history") || "[]");
      const newHist = [product, ...hist.filter((p: any) => p.id !== product.id)].slice(0, 10);
      localStorage.setItem("researched_products_history", JSON.stringify(newHist));
    } catch (e) {}
  };

  const handleCardClick = (product: Product) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
      saveToHistory(product);
    }
  };`;

prContent = prContent.replace(oldCardClick, newCardClick);
fs.writeFileSync(prPath, prContent);

// --- File 2: producer-dashboard/page.tsx ---
const pdPath = './src/app/producer-dashboard/page.tsx';
let pdContent = fs.readFileSync(pdPath, 'utf8');

// 1. Add state and effect for history
const oldStateEnd = `  const [designedCount] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("produced_mockups_count") || "0";
    }
    return "0";
  });`;

const newStateEnd = `  const [designedCount] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("produced_mockups_count") || "0";
    }
    return "0";
  });

  const [researchHistory, setResearchHistory] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const hist = JSON.parse(localStorage.getItem("researched_products_history") || "[]");
        setResearchHistory(hist);
      } catch (e) {}
    }
  }, []);`;

pdContent = pdContent.replace(oldStateEnd, newStateEnd);

// 2. Replace Draft Table with History Table
const oldTableBlockRegex = /\{\/\* Interactive Draft Publishing Queue \(Yayınlanmamış Mockup Listesi\) \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/ClientShell>/;

const newTableBlock = `{/* Recent Product Analysis History */}
      <div
        className="rounded-xl overflow-hidden border border-white/[0.07] mt-6"
        style={{ background: "var(--bg-card)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-purple-400" />
            <span className="text-sm font-bold text-white">
              Recent Product Analysis History
            </span>
          </div>
          
          <Link
            href="/product-research"
            className="flex items-center gap-1 text-xs font-bold transition-colors text-purple-400 hover:text-purple-300"
          >
            <span>Open Product Research</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)" }}>
                {["Analyzed Product", "Shop Name", "Price", "Opportunity Score", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#5e5a72]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {researchHistory.length > 0 ? researchHistory.map((p) => (
                <tr
                  key={p.id}
                  className="transition-all hover:bg-white/[0.01]"
                >
                  <td className="px-5 py-4 font-semibold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      <FallbackImage src={p.imageUrl} alt={p.title} />
                    </div>
                    <span className="truncate max-w-[280px]">{p.title}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] font-semibold text-[#a09cb0]">
                      {p.shopName}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">
                    \${p.price}
                  </td>
                  <td className="px-5 py-4 font-bold text-purple-300">
                    {p.opportunityScore}/100
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 w-max rounded-lg text-xs font-bold text-white bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowRight size={14} />
                      <span>View on Etsy</span>
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#5e5a72] text-xs">
                    No recent analysis history. Go to Product Research to analyze listings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </div>
  </ClientShell>
`;

pdContent = pdContent.replace(oldTableBlockRegex, newTableBlock);

// Remove the hardcoded drafts list since it's no longer used
pdContent = pdContent.replace(/const draftsList = \[\s*\{[\s\S]*?\}\s*\];/m, '');

fs.writeFileSync(pdPath, pdContent);
