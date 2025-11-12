import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import { DotButton, useDotButton } from './dot-button';

type PropType = {
  slides?: string[];
  options?: EmblaOptionsType;
  className?: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides = [], options, className = '' } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Fallback image if no slides provided
  const displaySlides =
    slides.length > 0
      ? slides
      : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className={`embla ${className}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {displaySlides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="embla__slide__img"
              />
            </div>
          ))}
        </div>
      </div>
      {displaySlides.length > 1 && (
        <div className="embla__controls">
          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={'embla__dot'.concat(
                  index === selectedIndex
                    ? ' embla__dot--selected'
                    : ''
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmblaCarousel;
