export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-pink-100">
          <h1 className="text-3xl font-light text-gray-800 mb-8">
            <span className="font-semibold text-pink-600">Terms</span> of Service
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using Monica's Bow Boutique website, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Products and Services</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All bows are handcrafted and may have slight variations</li>
                <li>Colors may vary slightly from photos due to screen settings</li>
                <li>Custom orders require 1-2 weeks production time</li>
                <li>We reserve the right to refuse service to anyone</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ordering and Payment</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All prices are in South African Rand (ZAR)</li>
                <li>Payment is required at time of order</li>
                <li>We accept payments through PayFast</li>
                <li>Orders are subject to availability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping and Delivery</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Free shipping on orders over R300</li>
                <li>Standard shipping takes 2-3 business days</li>
                <li>We ship nationwide within South Africa</li>
                <li>Risk of loss passes to customer upon delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Returns and Refunds</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>30-day return policy for standard items</li>
                <li>Custom orders are non-refundable unless defective</li>
                <li>Items must be returned in original condition</li>
                <li>Customer pays return shipping costs</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                All content on this website, including designs, text, graphics, and images, is the property of Monica's
                Bow Boutique and is protected by copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                Monica's Bow Boutique shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of our products or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600">For questions about these Terms of Service, please contact us:</p>
              <div className="mt-4 text-gray-600">
                <p>Email: hello@monicasbows.co.za</p>
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
