export default function TermsPage() {
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
            Terms of <span className="font-semibold text-pink-600">Service</span>
          </h1>
          <p className="text-gray-500 text-sm">Last updated: June 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using the Paitons Boutique website and placing orders, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Products &amp; Orders</h2>
            <ul className="space-y-3 ml-4">
              {[
                "All products are handcrafted and may have slight variations from product photos — this is the nature of handmade goods.",
                "Prices are displayed in South African Rand (ZAR).",
                "We reserve the right to cancel any order if the product is out of stock or if there is a pricing error, in which case a full refund will be issued.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Payment</h2>
            <p>Payment is processed securely through PayFast. By placing an order, you confirm that the payment details provided are valid. Paitons Boutique does not store payment card information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Custom Orders</h2>
            <ul className="space-y-3 ml-4">
              {[
                "Custom orders are non-refundable once production has begun.",
                "The final product may vary slightly from the description provided.",
                "Custom order prices are estimates. The final price will be confirmed by Paiton before production begins.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Shipping &amp; Delivery</h2>
            <p>Delivery times are estimates and we are not responsible for courier delays. See our <a href="/shipping" className="text-pink-600 hover:underline">Shipping Policy</a> for full details.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Returns &amp; Refunds</h2>
            <p>Returns and refunds are subject to our <a href="/returns" className="text-pink-600 hover:underline">Returns Policy</a>. Custom and personalised items are non-returnable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Intellectual Property</h2>
            <p>All content on this website, including product images, descriptions, logos, and designs, are the property of Paitons Boutique. You may not reproduce or use our content without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the Republic of South Africa. Disputes shall be resolved in the courts of KwaZulu-Natal.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact</h2>
            <p>For questions about these terms: <a href="mailto:hello@paitonsboutique.co.za" className="text-pink-600 hover:underline">hello@paitonsboutique.co.za</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
