import { forwardRef, useRef } from 'react';
import { motion, useAnimationFrame, motionValue, useTransform } from 'motion/react';
import { useMousePositionRef } from '../hooks/use-mouse-position-ref';

const MotionLetter = forwardRef(({ letter, proximity, styles }, ref) => {
  const transformedStyles = {};
  for (const [key, value] of Object.entries(styles)) {
    transformedStyles[key] = useTransform(proximity, [0, 1], [value.from, value.to]);
  }

  return (
    <motion.span ref={ref} className="inline-block" aria-hidden="true" style={transformedStyles}>
      {letter}
    </motion.span>
  );
});

MotionLetter.displayName = 'MotionLetter';

const TextCursorProximity = forwardRef(
  ({ label, styles, containerRef, radius = 50, falloff = 'linear', className, onClick, ...props }, ref) => {
    const letterRefs = useRef([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const letters = label.replace(/\s/g, '');
    const numLetters = letters.length;

    const letterProximities = useRef([]);
    if (letterProximities.current.length !== numLetters) {
      letterProximities.current = Array.from({ length: numLetters }, () => motionValue(0));
    }

    const calculateDistance = (x1, y1, x2, y2) =>
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const calculateFalloff = (distance) => {
      const normalizedDistance = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return Math.pow(normalizedDistance, 2);
        case 'gaussian':
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
        case 'linear':
        default:
          return normalizedDistance;
      }
    };

    useAnimationFrame(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;
        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;
        const distance = calculateDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          letterCenterX,
          letterCenterY
        );
        const proximity = calculateFalloff(distance);
        letterProximities.current[index].set(proximity);
      });
    });

    const words = label.split(' ');
    let letterIndex = 0;

    return (
      <span ref={ref} className={`${className} inline`} onClick={onClick} {...props}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((letter) => {
              const currentLetterIndex = letterIndex++;
              return (
                <MotionLetter
                  key={currentLetterIndex}
                  letter={letter}
                  proximity={letterProximities.current[currentLetterIndex]}
                  styles={styles}
                  ref={(el) => { letterRefs.current[currentLetterIndex] = el; }}
                />
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

TextCursorProximity.displayName = 'TextCursorProximity';
export default TextCursorProximity;
