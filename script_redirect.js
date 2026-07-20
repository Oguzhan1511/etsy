const fs = require('fs');
const path1 = './src/app/producer-dashboard/page.tsx';
const path2 = './src/app/product-research/page.tsx';

// --- File 1: producer-dashboard/page.tsx ---
let content1 = fs.readFileSync(path1, 'utf8');

// Replace button href and text
content1 = content1.replace(
  /href=\{`\/mockup-publish\?blueprintId=\$\{activeCat\.recommendedModelId\}`\}/,
  'href={`/product-research?q=${encodeURIComponent(activeCat.name)}`}'
);
content1 = content1.replace(
  /<span>Design \{activeCat\.recommendedModel\}<\/span>/,
  '<span>Research {activeCat.name} Products</span>'
);

fs.writeFileSync(path1, content1);

// --- File 2: product-research/page.tsx ---
let content2 = fs.readFileSync(path2, 'utf8');

// Refactor handleSearchSubmit to performSearch and handle auto-search
const oldSearchFunc = `  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Clear previous interval if running
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    setIsLoading(true);
    setError(null);
    setSelectedProduct(null);
    setLoadingStatus("Initializing Apify search...");

    try {
      // 1. Trigger the scraper asynchronously via POST
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchTerm }),
      });`;

const newSearchFunc = `  const performSearch = async (kw: string) => {
    if (!kw.trim()) return;

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    setIsLoading(true);
    setError(null);
    setSelectedProduct(null);
    setLoadingStatus("Initializing Apify search...");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: kw }),
      });`;

content2 = content2.replace(oldSearchFunc, newSearchFunc);

// Add useEffect for window.location.search below pollIntervalRef useEffect
const pollEffect = `  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);`;

const autoSearchEffect = `  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setSearchTerm(q);
        performSearch(q);
      }
    }
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };`;

content2 = content2.replace(pollEffect, autoSearchEffect);

// Wait, the body: JSON.stringify({ keyword: searchTerm }) might be used twice now. No, the oldSearchFunc replaced the top part.
// But we need to make sure the rest of performSearch uses \`kw\` instead of \`searchTerm\`.
// Wait, in performSearch:
content2 = content2.replace(/setActiveQuery\(searchTerm\);/g, 'setActiveQuery(kw);');

fs.writeFileSync(path2, content2);
