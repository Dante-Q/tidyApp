import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./BeachCarousel.css";

const BEACHES = [
  {
    id: "muizenberg",
    name: "Muizenberg",
    description:
      "Famous for its long sandy beach and consistent surf, perfect for beginners.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Beginner Friendly", "Consistent Waves"],
  },
  {
    id: "bloubergstrand",
    name: "Bloubergstrand",
    description:
      "Spectacular Table Mountain views, ideal for kitesurfing and windsurfing.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Kitesurfing", "Table Mountain Views"],
  },
  {
    id: "strand",
    name: "Strand",
    description:
      "Long stretch of beach in False Bay, popular with families and surfers.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Family Friendly", "Warm Water"],
  },
  {
    id: "clifton",
    name: "Clifton",
    description: "Four pristine beaches with clear blue water and white sand.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Sheltered", "Clear Water"],
  },
  {
    id: "kalkbay",
    name: "Kalk Bay",
    description: "Charming harbor town with tidal pool and unique surf breaks.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Tidal Pool", "Harbor Views"],
  },
  {
    id: "milnerton",
    name: "Milnerton",
    description:
      "Wide open beach with consistent waves and stunning sunset views.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    features: ["Consistent Waves", "Sunset Views"],
  },
];

export default function BeachCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const gridRef = useRef(null);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(1); // 1 card on mobile
      } else if (window.innerWidth <= 1024) {
        setItemsPerPage(2); // 2 cards on tablet
      } else {
        setItemsPerPage(3); // 3 cards on desktop
      }
    };

    // Set initial value
    updateItemsPerPage();

    // Add resize listener
    window.addEventListener("resize", updateItemsPerPage);

    // Cleanup
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Handle scroll event for mobile pagination - only update dots, no snapping
  useEffect(() => {
    if (itemsPerPage !== 1) return;

    let scrollTimeout;

    const handleScroll = () => {
      if (!gridRef.current) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (!gridRef.current) return;

        const scrollLeft = gridRef.current.scrollLeft;
        const cardWidth = gridRef.current.scrollWidth / BEACHES.length;
        const newIndex = Math.round(scrollLeft / cardWidth);
        const clampedIndex = Math.max(
          0,
          Math.min(newIndex, BEACHES.length - 1)
        );

        // Only update pagination dots, don't snap
        setCurrentIndex(clampedIndex);
      }, 150);
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        grid.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [itemsPerPage]);

  const totalPages = Math.ceil(BEACHES.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : totalPages - 1;

      // On mobile, scroll to the new card
      if (itemsPerPage === 1 && gridRef.current) {
        const cardWidth = gridRef.current.scrollWidth / BEACHES.length;
        gridRef.current.scrollTo({
          left: cardWidth * newIndex,
          behavior: "smooth",
        });
      }

      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev < totalPages - 1 ? prev + 1 : 0;

      // On mobile, scroll to the new card
      if (itemsPerPage === 1 && gridRef.current) {
        const cardWidth = gridRef.current.scrollWidth / BEACHES.length;
        gridRef.current.scrollTo({
          left: cardWidth * newIndex,
          behavior: "smooth",
        });
      }

      return newIndex;
    });
  };

  const getCurrentBeaches = () => {
    const start = currentIndex * itemsPerPage;
    return BEACHES.slice(start, start + itemsPerPage);
  };

  // Touch handlers for swipe gestures on mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="beach-carousel">
      <div className="beach-carousel-header">
        <h2>Explore Cape Town Beaches</h2>
        <p>Discover the best surf spots along the coast</p>
      </div>

      <div
        className="beach-carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        <button
          className="carousel-nav carousel-nav-prev"
          onClick={handlePrevious}
          aria-label="Previous beaches"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Beach Cards Grid */}
        <div className="beach-grid" ref={gridRef}>
          {(itemsPerPage === 1 ? BEACHES : getCurrentBeaches()).map((beach) => (
            <Link
              key={beach.id}
              to={`/beach/${beach.id}`}
              className="beach-card"
            >
              <div
                className="beach-card-image"
                style={{ backgroundImage: `url(${beach.image})` }}
              >
                <div className="beach-card-overlay">
                  <h3 className="beach-card-title">{beach.name}</h3>
                </div>
              </div>
              <div className="beach-card-content">
                <p className="beach-card-description">{beach.description}</p>
                <div className="beach-card-features">
                  {beach.features.map((feature, index) => (
                    <span key={index} className="beach-feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="beach-card-action">
                  <span>View Details</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="carousel-nav carousel-nav-next"
          onClick={handleNext}
          aria-label="Next beaches"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="carousel-pagination">
        {Array.from({
          length: itemsPerPage === 1 ? BEACHES.length : totalPages,
        }).map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              // Scroll to the card on mobile
              if (itemsPerPage === 1 && gridRef.current) {
                const cardWidth = gridRef.current.scrollWidth / BEACHES.length;
                gridRef.current.scrollTo({
                  left: cardWidth * index,
                  behavior: "smooth",
                });
              }
            }}
            aria-label={`Go to ${itemsPerPage === 1 ? "beach" : "page"} ${
              index + 1
            }`}
          />
        ))}
      </div>
    </div>
  );
}
