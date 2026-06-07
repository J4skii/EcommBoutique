export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-pink-400"></div>
            <span className="text-pink-600 font-medium text-sm tracking-wide uppercase">Legal</span>
            <div className="w-12 h-0.5 bg-pink-400"></div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Privacy <span className="font-semibold text-pink-600">Policy</span>
          </h1>
          <p className="text-gray-500 text-sm">Last updated: June 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p>When you place an order or interact with Paitons Boutique, we may collect:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {["Name, email address, and phone number", "Shipping and billing address", "Order history and purchase information", "Device and browser information for website improvement"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <ul className="space-y-2 ml-4">
              {["Process and fulfil your orders", "Send order confirmations and shipping updates", "Respond to your inquiries", "Send promotional emails if you have opted in (unsubscribe any time)"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Payment Security</h2>
            <p>All payments are processed securely through <strong>PayFast</strong>. We do not store your card details. All payment data is encrypted and processed in accordance with PCI DSS standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Sharing Your Information</h2>
            <p>We do not sell or trade your personal information to third parties, except as necessary to fulfil your order (e.g., sharing your address with our courier) or as required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Cookies</h2>
            <p>Our website uses cookies to improve your browsing experience and maintain your shopping cart. You can disable cookies in your browser settings, though this may affect website functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights (POPIA)</h2>
            <p>Under the Protection of Personal Information Act (POPIA), you have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:hello@paitonsboutique.co.za" className="text-pink-600 hover:underline">hello@paitonsboutique.co.za</a> to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact</h2>
            <div className="text-sm space-y-1">
              <p>Email: hello@paitonsboutique.co.za</p>
              <p>Phone/WhatsApp: +27 123 456 789</p>
              <p>Location: Durban, KwaZulu-Natal, South Africa</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
