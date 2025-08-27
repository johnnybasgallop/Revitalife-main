"use client";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AuthModal from "../components/AuthModal";
import { Button } from "../components/Button";
import ScrollReveal from "../components/ScrollReveal";
import { useAuth } from "../contexts/AuthContext";
import { useBasket } from "../contexts/BasketContext";
import { useNotification } from "../contexts/NotificationContext";

interface PricingData {
  oneTime: {
    original: number;
    sale: number;
    savings: number;
    priceId: string;
  };
  subscription: {
    original: number;
    sale: number;
    savings: number;
    interval: string;
    priceId: string;
  };
}

export function BuySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFlyingProduct, setShowFlyingProduct] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  const { addItem } = useBasket();
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const productImages = [
    "/prod/prod1.png",
    "/prod/prod2.jpg",
    "/prod/prod3.jpg",
  ];

  // Fetch pricing from Stripe on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/get-product-prices");
        if (response.ok) {
          const data = await response.json();
          setPricing(data.pricing);
        } else {
          console.error("Failed to fetch pricing");
          // Fallback to default pricing (GBP)
          setPricing({
            oneTime: { original: 56.99, sale: 47.99, savings: 16, priceId: "" },
            subscription: {
              original: 56.99,
              sale: 39.99,
              savings: 30,
              interval: "monthly",
              priceId: "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
        // Fallback to default pricing (GBP)
        setPricing({
          oneTime: { original: 56.99, sale: 47.99, savings: 16, priceId: "" },
          subscription: {
            original: 56.99,
            sale: 39.99,
            savings: 30,
            interval: "monthly",
            priceId: "",
          },
        });
      } finally {
        setPricingLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const currentPricing =
    pricing && isSubscription ? pricing.subscription : pricing?.oneTime;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleSubscriptionToggle = () => {
    if (!user && !isSubscription) {
      setShowAuthModal(true);
      return;
    }
    setIsSubscription(!isSubscription);
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated for subscription
    if (isSubscription && !user) {
      setShowAuthModal(true);
      return;
    }

    if (!pricing) {
      addNotification({
        type: "error",
        title: "Pricing Error",
        message: "Unable to load product pricing. Please refresh the page.",
      });
      return;
    }

    // Validate that we have the required price IDs
    if (!pricing.oneTime.priceId || !pricing.subscription.priceId) {
      addNotification({
        type: "error",
        title: "Configuration Error",
        message:
          "Product pricing is not properly configured. Please contact support.",
      });
      return;
    }

    setIsAddingToCart(true);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Add item to basket with subscription info and Stripe Price ID
    addItem({
      id: `revitalife-superfood-mix-${
        isSubscription ? "subscription" : "one-time"
      }`,
      name: `Revitalife Superfood Mix ${
        isSubscription ? "(Monthly Subscription)" : "(One-time)"
      }`,
      price: currentPricing!.sale,
      quantity: quantity,
      image: productImages[currentImageIndex],
      description: `Mango Flavor • 30 Servings ${
        isSubscription ? "• Auto-renewal" : ""
      }`,
      isSubscription: isSubscription,
      subscriptionInterval: isSubscription ? "monthly" : undefined,
      stripePriceId: isSubscription
        ? pricing.subscription.priceId
        : pricing.oneTime.priceId,
    });

    // Show flying product animation
    setShowFlyingProduct(true);
    setIsAddingToCart(false);

    // Show notification
    addNotification({
      type: "success",
      title: "Added to Cart!",
      message: `Added ${quantity} ${
        quantity === 1 ? "item" : "items"
      } to your basket ${isSubscription ? "(subscription)" : ""}`,
      duration: 4000,
    });

    // Hide flying product after animation completes
    setTimeout(() => setShowFlyingProduct(false), 1500);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Creating parallax effects for product image and content
  const productScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1.05, 1.05, 0.9]
  );
  const decorationY1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const decorationY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const decorationY3 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const decorationX1 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const decorationX2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const tagTransform = (motionValue: MotionValue<number>) => {
    return {
      scale: useTransform(motionValue, [0, 0.5, 1], [0.8, 1.1, 1]),
      y: useTransform(motionValue, [0, 0.5, 1], [50, -10, 0]),
    };
  };

  return (
    <>
      <section
        id="buy"
        ref={sectionRef}
        className="relative min-h-[95vh] flex items-center pb-10 md:py-15 lg:py-32 bg-[#7F9F4B]/14 overflow-hidden"
      >
        <div className="w-full px-4 md:px-10 lg:px-20">
          <ScrollReveal variant="fadeIn" duration={1}>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl flex items-center shadow-2xl p-10 lg:p-16 min-h-[650px] border border-gray-100 relative overflow-hidden">
              {/* Subtle gradient accents */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-30 2xl:gap-40 pb-15 items-center h-full w-full">
                <div
                  ref={productRef}
                  className="relative flex justify-center items-center"
                >
                  {/* Product showcase container */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <motion.div
                      style={{
                        scale: productScale,
                      }}
                      className="relative"
                      animate={
                        isAddingToCart
                          ? {
                              scale: [1, 1.05, 1],
                              rotate: [0, 2, -2, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Product Image Carousel */}
                      <div className="relative w-full h-full">
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="w-full h-full"
                        >
                          <img
                            src={productImages[currentImageIndex]}
                            alt={`Revitalife Greens Powder - Image ${
                              currentImageIndex + 1
                            }`}
                            className="w-full h-full rounded-2xl max-w-[400px] h-auto"
                          />
                        </motion.div>

                        {/* Clean Navigation Arrows */}
                        <button
                          onClick={prevImage}
                          className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 hover:text-[#2d4a3e] rounded-full p-2.5 shadow-md transition-all duration-200 hover:scale-105 border border-gray-200"
                          aria-label="Previous image"
                        >
                          <IoChevronBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={nextImage}
                          className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 hover:text-[#2d4a3e] hover:scale-105 rounded-full p-2.5 shadow-md transition-all duration-200 border border-gray-200"
                          aria-label="Next image"
                        >
                          <IoChevronForward className="w-5 h-5" />
                        </button>

                        {/* Clean Image Indicators */}
                        <div className="absolute -bottom-15 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {productImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                index === currentImageIndex
                                  ? "bg-[#2d4a3e] scale-110"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Product badges */}
                    <div className="absolute -top-3 -right-3 flex flex-col space-y-2">
                      <div className="bg-[#2d4a3e] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        ORGANIC
                      </div>
                      <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        PREMIUM
                      </div>
                      {isSubscription && (
                        <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          SUBSCRIPTION
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <ScrollReveal variant="fadeInRight" duration={0.8}>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                      Revitalife Superfood Mix
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.1}
                    duration={0.8}
                  >
                    <p className="text-xl text-amber-500 font-medium mb-4">
                      Mango Flavor • 30 Servings
                    </p>
                  </ScrollReveal>

                  {/* Subscription Toggle */}
                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.15}
                    duration={0.8}
                  >
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Subscription Plan
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            One-time
                          </span>
                          <button
                            onClick={handleSubscriptionToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] focus:ring-offset-2 ${
                              isSubscription ? "bg-[#2d4a3e]" : "bg-gray-300"
                            }`}
                            aria-label="Toggle subscription"
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isSubscription
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className="text-xs text-gray-500">Monthly</span>
                        </div>
                      </div>

                      {isSubscription && (
                        <div className="flex items-center space-x-2 text-sm text-emerald-600">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Save 29% with monthly subscription</span>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.2}
                    duration={0.8}
                  >
                    <div className="flex items-end mb-6">
                      {pricingLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#2d4a3e] rounded-full animate-spin" />
                          <span className="text-gray-500">
                            Loading pricing...
                          </span>
                        </div>
                      ) : currentPricing ? (
                        <>
                          <p className="text-4xl font-bold text-gray-900">
                            ${currentPricing.sale}
                          </p>
                          <p className="text-xl text-gray-500 line-through ml-2">
                            ${currentPricing.original}
                          </p>
                          <p className="text-sm text-emerald-600 font-semibold ml-3 px-2 py-1 bg-emerald-50 rounded">
                            Save {currentPricing.savings}%
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500">Pricing unavailable</p>
                      )}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.3}
                    duration={0.8}
                  >
                    <p className="text-gray-600 mb-8">
                      {isSubscription
                        ? "Monthly subscription with free shipping. Cancel anytime."
                        : "One-time purchase. Free shipping on orders over $50."}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.4}
                    duration={0.8}
                  >
                    <div className="flex items-center mb-10">
                      <p className="text-gray-700 mr-4">Quantity:</p>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-5 py-2 border-l border-r border-gray-300">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fadeInRight"
                    delay={0.5}
                    duration={0.8}
                  >
                    <div className="relative">
                      <Button
                        size="lg"
                        className={`w-full md:w-auto text-lg py-3 px-8 transition-all duration-300 ${
                          isAddingToCart
                            ? "bg-emerald-600 scale-95 cursor-not-allowed"
                            : "hover:scale-105 hover:shadow-lg"
                        }`}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                      >
                        {isAddingToCart ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Adding to Cart...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <FaShoppingCart />
                            <span>Add to Cart</span>
                          </div>
                        )}
                      </Button>

                      {/* Flying Product Animation */}
                      {showFlyingProduct && (
                        <motion.div
                          initial={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                          }}
                          animate={{
                            opacity: [1, 1, 0],
                            scale: [1, 0.8, 0.3],
                            x: [0, -200, -400],
                            y: [0, -100, -200],
                            rotate: [0, 15, 30],
                          }}
                          transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            times: [0, 0.7, 1],
                          }}
                          className="absolute top-1/2 left-1/2 w-16 h-16 pointer-events-none z-50"
                          style={{
                            transformOrigin: "center",
                          }}
                        >
                          <img
                            src={productImages[currentImageIndex]}
                            alt="Flying product"
                            className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-white"
                          />
                        </motion.div>
                      )}
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
