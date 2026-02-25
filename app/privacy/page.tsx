export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-pink-100">
          <h1 className="text-3xl font-light text-gray-800 mb-8">
            <span className="font-semibold text-pink-600">Privacy</span> Policy
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                When you visit Paitons Boutique, we collect information to provide you with the best possible
                service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personal information (name, email, phone number, address) when you place an order</li>
                <li>Payment information (processed securely through PayFast)</li>
                <li>Order history and preferences</li>
                <li>Website usage data to improve our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information
                with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Payment processors (PayFast) to process transactions</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Email service providers to send communications</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. All payment information is processed through secure,
                encrypted connections.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="mt-4 text-gray-600">
                <p>Email: hello@paitonsboutique.co.za</p>
                <p>Phone: +27 123 456 789</p>
                <p>Address: Durban, KwaZulu-Natal, South Africa</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
