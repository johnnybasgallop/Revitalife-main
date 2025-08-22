"use client";

import { FAQAccordion } from "../components/FAQAccordion";
import { faqs } from "../data/siteData";

export function FAQSection() {
  return (
    <section
      id="faq"
      className="py-15 min-h-[80vh] lg:pt-30 bg-[#7F9F4B]/20 overflow-hidden relative snap-start snap-always"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about Revitalife.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
