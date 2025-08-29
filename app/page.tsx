import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <FeaturedProducts />
      </Suspense>
      <AboutSection />
      <ContactSection />
    </main>
  )
}
