import Image from "next/image";
import { BiGlobe, BiPhoneCall } from "react-icons/bi";
import { TfiEmail } from "react-icons/tfi";

export function NutritionistPage() {
  const specialties = [
    "Hormonal weight loss",
    "Women's health (perimenopause)",
    "Sleep/insomnia",
    "Stress and fatigue",
    "General health and wellness",
  ];

  const testimonials = [
    {
      rating: 5,
      text: "I'm scared to every go back to eating the same as before. My energy is up and my brain is focused. I'm loving this program, Tatiana.",
      name: "Capucine N.",
      location: "Normandie",
    },
    {
      rating: 5,
      text: "I have been suffering with stress and fatigue and a foggy head for 10 years. Tatiana had a long session with me running through in detail all my symptoms and pinpointing a gut issue. I had a microbiome gut health test and have now been put on a tailored diet to re-balance my gut - already feeling so much better!",
      name: "James A.",
      location: "London",
    },
    {
      rating: 5,
      text: "Third week now and I thought I should message you to let you know that last night I slept 7 hours for the first time in years!",
      name: "Christina P.",
      location: "London",
    },
    {
      rating: 5,
      text: "My acid reflux has disappeared at last. I have felt much more energized and mainly, the anxiety is so mild that I'm not even noticing it.",
      name: "Jessica B.",
      location: "Guildford",
    },
    {
      rating: 5,
      text: "I'm not used to eating much as my parents always taught me to eat less, so this new diet feels weird, but I can't deny that your diet is making my weight melt like snow. I won't complain!",
      name: "Sophia C.",
      location: "Esher",
    },
    {
      rating: 5,
      text: "I've been enjoying the beef steaks and the seafood. I honestly never knew coming off my meds would ever be possible by just changing my meals!",
      name: "Stacey F.",
      location: "Edimbourgh",
    },
    {
      rating: 5,
      text: "I no longer feel bloated. Also, my sleep is very good. Last week I slept I woke up only thanks to the alarm which had never happened before!",
      name: "Kevin M.",
      location: "Woking",
    },
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 mb-3">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-0 pb-15 lg:pt-15 lg:pb-30">
      <div className="text-center mb-4 mb:12 xl:mb-16 px-4 md:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our exclusive functional practitioner and nutritionist
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revitalife has partnered with Tatiana as our exclusive functional
          medicine practioner and nutritional therapist. Tatiana specialises in
          general health and wellness, nutritional support, stress and fatigue,
          sleep/ insomnia, hormonal weight loss and women’s health. Get in
          contact with her below!
        </p>
      </div>
      {/* Testimonials at top on mobile only */}
      <div className="hidden bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                <StarRating rating={testimonial.rating} />
                <p className="text-gray-700 mb-3 text-sm leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full px-8 lg:px-16 xl:px-20 py-8 lg:py-16">
        <div className="grid lg:grid-cols-[420px_1fr] xl:grid-cols-[450px_1fr] gap-8 lg:gap-12 xl:gap-16 items-stretch max-w-[1500px] mx-auto">
          {/* Left Column - Image */}
          <div className="w-full flex items-stretch">
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-lg max-h-[800px]"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="/Nutritionist_Headshot.JPG"
                alt="Tatiana Mercier"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3">
                  Tatiana Mercier
                </h1>
                <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 mb-4 ml-1">
                  Functional Medicine Practitioner / Nutritional Therapist
                </p>
                <p className="text-orange-600 font-semibold text-base lg:text-lg xl:text-xl ml-1">
                  Dip.CNM; Dip.FMU; Dip.BWY; mCNHC
                </p>
              </div>

              <div className="space-y-2 text-gray-700 text-base lg:text-lg ml-1">
                <a
                  href="tel:+447872022009"
                  aria-label="Call Tatiana Mercier"
                  className="flex items-start gap-2 hover:text-blue-600 hover:underline"
                >
                  <span className="font-semibold">Phone:</span>
                  <span>+44 787 202 2009</span>
                  <span className="mt-1 ml-2 lg:ml-3">
                    <BiPhoneCall />
                  </span>
                </a>
                <a
                  href="mailto:Tatianamercier@vitalityexpression.co.uk"
                  aria-label="Email Tatiana Mercier"
                  className="flex items-start gap-2 hover:text-blue-600 hover:underline"
                >
                  <span className="font-semibold">Email:</span>
                  <span className="break-all">
                    Tatianamercier@vitalityexpression.co.uk
                  </span>
                  <span className="mt-[5px] ml-2 lg:ml-3">
                    <TfiEmail />
                  </span>
                </a>
                <a
                  href="https://www.vitalityexpression.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit vitalityexpression.co.uk"
                  className="flex items-start gap-2 hover:text-blue-600 hover:underline"
                >
                  <span className="font-semibold">Website:</span>
                  <span>www.vitalityexpression.co.uk</span>
                  <span className="mt-[5px] ml-2 lg:ml-3">
                    <BiGlobe />
                  </span>
                </a>
              </div>

              {/* Specialties */}
              <p className="pt-4 text-lg md:text-2xl font-semibold">
                Tatiana's Services
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3 items-center">
                <div className="col-span-1 bg-[#edf1e6] px-6 py-5 rounded-xl text-gray-800 text-base lg:text-lg font-medium text-center">
                  Hormonal weight loss
                </div>
                <div className="col-span-1 bg-[#edf1e6] px-6 py-5 rounded-xl text-gray-800 text-base lg:text-lg font-medium text-center">
                  Women's health (perimenopause)
                </div>
                <div className="col-span-1 bg-[#edf1e6] px-6 py-5 rounded-xl text-gray-800 text-base lg:text-lg font-medium text-center">
                  Sleep/Insomnia
                </div>
                <div className="col-span-1 bg-[#edf1e6] px-6 py-5 rounded-xl text-gray-800 text-base lg:text-lg font-medium text-center">
                  Stress and fatigue
                </div>
                <div className="col-span-1 md:col-span-2 bg-[#edf1e6] px-6 py-5 rounded-xl text-gray-800 text-base lg:text-lg font-medium text-center">
                  General health and wellness
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Hidden on mobile, shown on desktop */}
      <div className="lg:block py-12 lg:py-16">
        <div className="w-full px-8 lg:px-16 xl:px-20">
          <div className="max-w-[1500px] mx-auto">
            <p className=" text-lg md:text-2xl font-semibold pb-8">
              What Tatiana's customers say{" "}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <StarRating rating={testimonial.rating} />
                  <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
