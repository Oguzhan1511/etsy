import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
            <p>
              Welcome to PrintySell. We are committed to protecting your personal information and your right to privacy. 
              This privacy policy applies to the PrintySell Chrome Extension and the PrintySell web application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
            <p className="mb-2">When you use our Chrome Extension, we collect and process the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Etsy Listing Data:</strong> When you click "Analyze", we fetch public data from the Etsy listing you are currently viewing (e.g., tags, views, favorites).</li>
              <li><strong>Authentication Data:</strong> We use cookies to verify your logged-in status on PrintySell.com to grant access to the extension features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
            <p>
              The data we collect is strictly used to provide the core functionality of the extension: 
              displaying SEO insights and generating AI design prompts based on the product you are viewing. 
              We do not sell, rent, or share your personal data or browsing history with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Data Storage and Security</h2>
            <p>
              The extension temporarily stores the generated AI prompt and product image URL in your browser's local storage (`chrome.storage.local`) 
              to transfer them securely to our AI Design Studio. This data is kept locally on your device and is not used for tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may contact us at printysell@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
