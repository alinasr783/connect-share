import {useState, useRef, useEffect} from "react";

function ImagesSlider({images, className = ""}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isDragging]);

  // Handle touch/mouse events
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const threshold = 50;

    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < images.length - 1) {
        // Swipe left - go to next
        setCurrentIndex(currentIndex + 1);
      }
    }

    setTranslateX(0);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <i className="ri-image-line text-4xl mb-2"></i>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Main Slider */}
      <div
        ref={sliderRef}
        className="relative h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${
            -currentIndex * 100 +
            (translateX / sliderRef.current?.offsetWidth) * 100
          }%)`,
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
        }}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous image">
            <i className="ri-arrow-left-line text-xl"></i>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next image">
            <i className="ri-arrow-right-line text-xl"></i>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Loading Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default ImagesSlider;
