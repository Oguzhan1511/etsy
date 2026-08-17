import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          User Agreement & Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Parties</h2>
            <p className="mb-2">
              This User and Subscription Agreement ("Agreement") is entered into between [Company Name / Registration No / Address] ("Company"), operating the PrintySell platform ("Platform"), and the natural or legal person ("User") who registers on or uses the Platform, effective immediately upon the User's registration and electronic acceptance of this Agreement.
            </p>
            <p>
              <strong>1.1 Capacity and Age Limit:</strong> By accepting this Agreement, the User declares and warrants that they are at least eighteen (18) years old and/or authorized to represent the legal entity if using the Platform on its behalf. Use of the Platform by minors is prohibited; the Company may suspend the account if such use is detected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Scope and Description of Service</h2>
            <p>
              PrintySell provides its Users with a Software as a Service (SaaS) that facilitates e-commerce and design processes, such as AI-supported visual design generation, mockup production, integration with marketplaces like Etsy, and product listing. Third-party APIs and services may be used during the performance of these services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Membership, Subscriptions, and Auto-Renewal</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The User is personally responsible for account security, password confidentiality, and all actions taken under their account. The Company cannot be held liable for damages resulting from unauthorized use of the account.</li>
              <li>Services on the Platform are offered in the form of monthly or annual subscription packages ("Packages") with varying features.</li>
              <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew at the end of the selected billing cycle under the same package unless canceled by the User.</li>
              <li><strong>Cancellation Process:</strong> The User may cancel their subscription at any time via account settings. The cancellation will take effect at the beginning of the next billing cycle.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Token (Credit) System and Terms of Use</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI image generation and similar processes within the Platform are performed by consuming "Tokens" (Credits). Token allocation is defined monthly based on the selected subscription package.</li>
              <li><strong>Lifespan and Rollover:</strong> Unused tokens do not roll over to the next billing month and will be deleted.</li>
              <li><strong>Subscription Cancellation and Token Status:</strong> If a User cancels or fails to renew their subscription, their account downgrades to "Demo" status. <strong>The moment a subscription becomes inactive (Demo), any remaining unused tokens in the User's account are permanently deleted and cannot be used.</strong> Token usage is only valid for Users with an active paid subscription.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Pricing, Billing, and Payment Failure</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The Company reserves the right to make changes to package contents and prices. Price increases will be applied at the end of the current subscription period, and the User will be notified at least 15 days in advance. If the User does not accept the updated price, they may terminate their subscription without penalty at the end of the period.</li>
              <li><strong>Payment Failure:</strong> In the event that payment cannot be collected from the credit card during auto-renewal, the system will retry collection periodically for [e.g., 3 days]. If payment still cannot be collected after this period, the subscription will be canceled, the account will be downgraded to Demo status, and existing tokens will be reset to zero.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Right of Withdrawal and Refund Policy</h2>
            <p className="mb-2">
              Due to the immediate digital fulfillment of services (AI model consumption, server resource usage, and token allocation), in accordance with Article 15(g) of the Distance Contracts Regulation, the consumer cannot exercise the right of withdrawal for services performed instantly in an electronic environment.
            </p>
            <p>
              The User accepts, declares, and warrants that the right of withdrawal is forfeited from the moment a subscription is purchased and tokens are allocated to their account. No refunds are provided for purchased packages, subscriptions, or partially/fully used tokens. In the event of a duplicate charge due to a system error, a refund will be issued within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. AI Outputs, Intellectual Property, and Commercial Use</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Usage License and Limits:</strong> The Company grants the User a commercial use right (license) for images generated by the User via PrintySell. However, whether AI-generated images legally constitute an absolute and exclusive "copyright" is subject to international law and the terms of 3rd party AI service providers.</li>
              <li>The User may sell the content they produce on platforms like Etsy. However, the Company does not guarantee that these images will not cause copyright infringement, nor does it guarantee their originality or commercial success.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. User Content, Responsibility, and Indemnification</h2>
            <p className="mb-2">
              The User guarantees that the reference images they upload, the commands (prompts) they write, and the products they create do not violate third-party trademarks (e.g., logos), copyrights, patents, trade secrets, or personal data rights in any way.
            </p>
            <p>
              <strong>Indemnification:</strong> In the event of any legal claim, lawsuit, or administrative fine directed against the Company due to content uploaded or produced by the User, the User is obligated to immediately and in cash indemnify the Company for all material and moral damages, as well as attorney fees, upon first demand.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Etsy and Third-Party Integrations</h2>
            <p className="mb-2">
              The Etsy integration at the core of the PrintySell platform is provided "as is". The Company is not an official partner of Etsy, Inc. or its affiliates.
            </p>
            <p>
              The Company cannot be held responsible in the following situations:
              <br/>- Etsy changing its API structure or cutting access,
              <br/>- The User's Etsy shop being warned, suspended, or closed due to Etsy policy violations,
              <br/>- Errors in product descriptions or images transferred by the User via PrintySell.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Third-Party AI Services</h2>
            <p>
              PrintySell utilizes the infrastructures of independent 3rd party AI providers such as OpenAI, Fal AI, Google, etc., for image generation, analysis, and similar processes. The Company cannot be held responsible if these service providers experience API outages, change content filtering (e.g., NSFW) policies, reject specific prompts, or halt services. These interruptions do not constitute a reason for a refund or compensation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Prohibited Uses and Account Termination</h2>
            <p className="mb-2">
              The User may not use the Platform to reverse engineer, launch cyber attacks, perform unauthorized data scraping, or harm other users.
            </p>
            <p>
              If the Company determines that the Platform is being abused or that this Agreement is severely violated, it reserves the right to immediately suspend or terminate the User's account. No fee or token refunds will be made for terminated accounts, without prejudice to legal refund obligations arising from legislation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">12. Limitation of Liability and Uptime</h2>
            <p>
              The Platform is SaaS-based, and short-term access interruptions may occur due to maintenance, updates, or unplanned technical failures. The Company does not guarantee 100% uninterrupted service (uptime). The Company's liability for compensation arising from any performance degradation or indirect damages, except in cases of intent or gross negligence, is limited to the total service fee paid by the User to the Company in the last 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">13. Force Majeure</h2>
            <p>
              Natural disasters, war, cyber attacks, general infrastructure and internet collapses, pandemics, administrative or legal restrictions are considered force majeure. The Company's performance obligations are suspended during the force majeure event.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">14. Privacy Policy and Personal Data Protection</h2>
            <div className="space-y-4">
              <p>
                The Company processes personal data belonging to the User in accordance with applicable personal data protection laws and international privacy standards. This Privacy Policy covers all our services, including the PrintySell web application and Chrome Extension.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Data Collection:</strong> When using our Chrome extension, only public data from the Etsy product page you are viewing (title, tags, view count, etc.) is temporarily processed for analysis purposes. Your browsing history or personal data is never collected.</li>
                <li><strong>Data Usage:</strong> This collected data is solely used to operate the extension's core features, namely "SEO Analysis" and "Generate Similar AI Design". This data is not sold, rented, or shared with third parties.</li>
                <li><strong>Data Storage and Security:</strong> AI prompts and image links generated via the extension are stored in your browser's local memory (local storage) and securely transferred to the PrintySell AI Studio. User passwords and sensitive authentication cookies are protected with industry-standard encryption.</li>
                <li><strong>Contact:</strong> For all your questions regarding our privacy policy and data processing operations, you can contact us at printysell@gmail.com.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">15. Amendments to the Agreement</h2>
            <p>
              The Company may change the terms of the Agreement, provided that it complies with relevant legislation and notifies adverse changes via email at least 15 days in advance. A User who does not accept the updated agreement has the right to terminate their subscription.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">16. Dispute Resolution</h2>
            <p>
              The laws of the Republic of Turkey shall apply to disputes arising from this Agreement. For Users who have consumer status, the Consumer Arbitration Committees and Consumer Courts in the User's or the Company's place of residence are authorized within monetary limits. For disputes with non-consumer Users, the Istanbul (Central) Courts are exclusively authorized.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
