import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { SliderType } from "@/types";

interface ImageSliderProps {
  images: string[];
  onDelete?: (index: number) => void;
  type: SliderType;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  onDelete,
  type,
}) => {
  return (
    <div className="relative">
      {images.length > 1 && (
        <div
          id="slide-count"
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md z-10"
        >
          1/{images.length}
        </div>
      )}

      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={images.length > 1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        onSlideChange={(swiper) => {
          const currentSlide = swiper.realIndex + 1;
          const totalSlides = images.length;
          const slideCountElement = document.querySelector("#slide-count");
          if (slideCountElement) {
            slideCountElement.textContent = `${currentSlide}/${totalSlides}`;
          }
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-64">
              <img
                src={image}
                alt={`image-${index}`}
                className="w-full h-full object-contain rounded-md"
              />
              {type === SliderType.Preview && onDelete && (
                <button
                  onClick={() => onDelete(index)}
                  className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full"
                >
                  Delete
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
