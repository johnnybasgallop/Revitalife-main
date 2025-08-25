"use client";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Button } from "../components/Button";
import ScrollReveal from "../components/ScrollReveal";
import { useBasket } from "../contexts/BasketContext";
import { useNotification } from "../contexts/NotificationContext";

export function BuySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFlyingProduct, setShowFlyingProduct] = useState(false);
  const { addItem } = useBasket();
  const { addNotification } = useNotification();

  const productImages = [
    "/prod/prod1.png",
    "/prod/prod2.jpg",
    "/prod/prod3.jpg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Add item to basket
    addItem({
      id: "revitalife-superfood-mix",
      name: "Revitalife Superfood Mix",
      price: 59.99,
      quantity: quantity,
      image: productImages[currentImageIndex],
      description: "Mango Flavor • 30 Servings",
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
      } to your basket`,
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
    <section
      id="buy"
      ref={sectionRef}
      className="relative min-h-[95vh] flex items-center pb-10 md:py-15 lg:py-32 bg-[#7F9F4B]/14 overflow-hidden"
    >
      {/* Decorative elements with parallax motion
      <motion.div
        className="absolute top-1/4 right-10 w-80 h-80 bg-green-100 rounded-full opacity-50 blur-3xl"
        style={{ y: decorationY1, x: decorationX1 }}
      />
      <motion.div
        className="absolute top-1/3 left-10 w-96 h-96 bg-amber-100 rounded-full opacity-60 blur-3xl"
        style={{ y: decorationY2, x: decorationX2 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-100 rounded-full opacity-70 blur-3xl"
        style={{ y: decorationY3 }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-50 rounded-full opacity-50 blur-3xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -30]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 15]),
        }}
      />
      <motion.div
        className="absolute top-20 left-1/4 w-32 h-32 bg-yellow-100 rounded-full opacity-60 blur-2xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-20, 40]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1]),
        }}
      /> */}
      <div className="w-full px-4 md:px-10 lg:px-20">
        <ScrollReveal variant="fadeIn" duration={1}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl flex items-center shadow-2xl p-10 lg:p-16 min-h-[650px] border border-gray-100 relative overflow-hidden">
            {/* Subtle gradient accents */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-30 2xl:gap-40 pb-15 items-center h-full w-full">
              <div
                ref={productRef}
                className="relative flex justify-center items-center"
              >
                {/* Decorative background elements */}
                <div className="absolute inset-0 -z-10">
                  {/* Floating orbs */}
                  <motion.div
                    className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full opacity-60 blur-xl"
                    animate={{
                      y: [0, -20, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-20 right-8 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-50 blur-xl"
                    animate={{
                      y: [0, 15, 0],
                      scale: [1, 0.9, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 -left-4 w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-40 blur-lg"
                    animate={{
                      x: [0, 10, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Product showcase container */}
                <div className="relative bg-gradient-to-br from-white/80 to-emerald-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                  {/* Subtle grid pattern background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl" />

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
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full"
                      >
                        <img
                          src={productImages[currentImageIndex]}
                          alt={`Revitalife Greens Powder - Image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full rounded-2xl max-w-[400px] h-auto shadow-xl"
                        />
                      </motion.div>

                      {/* Enhanced Navigation Arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border border-gray-100"
                        aria-label="Previous image"
                      >
                        <IoChevronBack className="w-6 h-6" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border border-gray-100"
                        aria-label="Next image"
                      >
                        <IoChevronForward className="w-6 h-6" />
                      </button>

                      {/* Enhanced Image Indicators */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        {productImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentImageIndex
                                ? "bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50"
                                : "bg-gray-300 hover:bg-emerald-300 hover:scale-110"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Product badges */}
                  <div className="absolute -top-4 -right-4 flex flex-col space-y-2">
                    <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ORGANIC
                    </div>
                    <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      PREMIUM
                    </div>
                  </div>

                  {/* Floating ingredient icons */}
                  <div className="absolute -bottom-6 -left-6">
                    <motion.div
                      className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center border border-emerald-100"
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src="/icons/spirulina.svg"
                        alt="Spirulina"
                        className="w-6 h-6"
                      />
                    </motion.div>
                  </div>

                  <div className="absolute -top-6 -left-6">
                    <motion.div
                      className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center border border-amber-100"
                      animate={{
                        y: [0, 6, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      <img
                        src="/icons/mango.svg"
                        alt="Mango"
                        className="w-5 h-5"
                      />
                    </motion.div>
                  </div>

                  {/* Additional floating elements */}
                  <div className="absolute top-1/2 -right-8">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-80"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.4, 0.8],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                      }}
                    />
                  </div>

                  {/* Connection lines between elements */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.line
                      x1="20%"
                      y1="30%"
                      x2="80%"
                      y2="70%"
                      stroke="url(#gradient1)"
                      strokeWidth="1"
                      opacity="0.3"
                      animate={{
                        pathLength: [0, 1, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#f59e0b"
                          stopOpacity="0.3"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div>
                <ScrollReveal variant="fadeInRight" duration={0.8}>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Revitalife Superfood Mix
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.1} duration={0.8}>
                  <p className="text-xl text-amber-500 font-medium mb-4">
                    Mango Flavor • 30 Servings
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.2} duration={0.8}>
                  <div className="flex items-end mb-6">
                    <p className="text-4xl font-bold text-gray-900">$59.99</p>
                    <p className="text-xl text-gray-500 line-through ml-2">
                      $69.99
                    </p>
                    <p className="text-sm text-emerald-600 font-semibold ml-3 px-2 py-1 bg-emerald-50 rounded">
                      Save 15%
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.3} duration={0.8}>
                  <p className="text-gray-600 mb-8">
                    One-time purchase. Free shipping on orders over $50.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.4} duration={0.8}>
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

                <ScrollReveal variant="fadeInRight" delay={0.5} duration={0.8}>
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
  );
}
