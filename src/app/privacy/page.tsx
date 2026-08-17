import React from 'react';

export default function PrivacyAndTerms() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Terms of Service & Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          
          {/* PRIVACY POLICY SECTION (Must be first and prominent for Chrome Web Store) */}
          <section className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy (Chrome Extension & Web App)</h2>
            <div className="space-y-4">
              <p>
                This Privacy Policy applies to the PrintySell web application and the PrintySell Chrome Extension. We process your personal data in accordance with international privacy standards and applicable data protection laws.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Data Collection:</strong> When you use our Chrome Extension, we only temporarily process public data from the Etsy listing you are viewing (e.g., title, tags, views) for analysis purposes. We DO NOT collect your browsing history or personal data.</li>
                <li><strong>Data Usage:</strong> The collected data is strictly used for the core functionalities of the extension ("SEO Analysis" and "Generate Similar AI Design"). We do not sell, rent, or share this data with third parties.</li>
                <li><strong>Data Storage and Security:</strong> AI prompts and image links generated via the extension are temporarily stored in your browser's local storage (`chrome.storage.local`) and securely transferred to the PrintySell AI Studio. User passwords and authentication cookies are protected with industry-standard encryption.</li>
                <li><strong>Contact:</strong> For all inquiries regarding our privacy policy and data processing, you can contact us at printysell@gmail.com.</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-700 my-8" />

          {/* TERMS OF SERVICE SECTION */}
          <h2 className="text-2xl font-bold text-white mb-4">Terms of Service and Subscription Agreement</h2>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Parties & Eligibility</h3>
            <p>
              This Agreement is entered into between PrintySell ("Company") and the person or entity ("User") registering on the Platform. By accepting this Agreement, the User declares they are at least 18 years old or authorized to represent their legal entity.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Scope of Service</h3>
            <p>
              PrintySell provides a Software as a Service (SaaS) platform facilitating e-commerce and design processes, including AI-supported image generation, mockup creation, and marketplace integrations (e.g., Etsy).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. Subscriptions & Auto-Renewal</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users are responsible for their account security.</li>
              <li>Subscriptions auto-renew at the end of the billing cycle unless canceled.</li>
              <li>Users can cancel their subscription at any time via account settings, effective at the end of the current billing cycle.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">4. Token (Credit) System</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI generation costs "Tokens" allocated monthly based on the active subscription.</li>
              <li>Unused tokens do not roll over to the next month.</li>
              <li>If a subscription is canceled or fails to renew, the account reverts to "Demo" status and all unused tokens are permanently deleted.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">5. Pricing & Billing Failure</h3>
            <p>
              The Company reserves the right to change prices with a 15-day notice. If auto-renewal payment fails, the system will retry for 3 days before downgrading the account to Demo status and clearing tokens.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">6. No Refund Policy</h3>
            <p>
              Due to the immediate digital fulfillment of our services (AI model consumption, server usage), consumers do not have the right of withdrawal once tokens are allocated. Subscriptions and tokens are non-refundable.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">7. AI Outputs & Intellectual Property</h3>
            <p>
              The Company grants Users a commercial license for images generated via PrintySell. However, the absolute copyright status of AI-generated images depends on international laws and 3rd party AI provider terms. The Company does not guarantee commercial success or immunity from copyright claims by third parties.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">8. User Content & Indemnification</h3>
            <p>
              Users guarantee that their prompts and reference images do not violate third-party trademarks, copyrights, or privacy rights. Users agree to indemnify the Company against any legal claims or damages arising from the content they generate or upload.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">9. Etsy and Third-Party Integrations</h3>
            <p>
              PrintySell is not an official partner of Etsy, Inc. The Company is not responsible for Etsy API changes, Etsy account suspensions, or errors in listing data transferred via PrintySell.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">10. Third-Party AI Services</h3>
            <p>
              We utilize independent AI providers (OpenAI, Fal AI, Google). We are not liable for their API outages, filter changes (e.g., NSFW blocking), or service interruptions.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">11. Prohibited Uses & Account Termination</h3>
            <p>
              Reverse engineering, cyber attacks, or unauthorized scraping are strictly prohibited. Violations will result in immediate account termination without refund.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">12. Limitation of Liability</h3>
            <p>
              We do not guarantee 100% uptime. Except for gross negligence, our maximum liability for any damages is limited to the total fees paid by the User in the preceding 12 months.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
