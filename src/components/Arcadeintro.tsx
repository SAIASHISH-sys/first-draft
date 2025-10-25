// src/components/ArcadeIntro.tsx

import { useState } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';

// --- UPDATE THIS PATH ---
// Place your yellowish arcade image in the `public` folder
// and update the path here.

// --- Arrow SVG ---
// A simple down-arrow to point at the joystick
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-18 h-17 text-gray-200 drop-shadow-lg"
  >
    <path
      fillRule="evenodd"
      d="M10 15.5a.75.75 0 01-.75-.75V6.56l-1.72 1.72a.75.75 0 01-1.06-1.06l3-3a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06L10.75 6.56V14.75a.75.75 0 01-.75.75z"
      clipRule="evenodd"
    />
    {/* Whoops, that's an up arrow. Let's fix it. */}
    <path
      fillRule="evenodd"
      d="M10 4.5a.75.75 0 01.75.75v8.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V5.25A.75.75 0 0110 4.5z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Animation Variants ---
const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.3, // Time between each letter appearing (typing speed)
    },
  },
};

const letter = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 3,
    }
  },
};

// --- Component Props ---
interface ArcadeIntroProps {
  onIntroComplete: () => void;
}

export const ArcadeIntro = ({ onIntroComplete }: ArcadeIntroProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const lines = ["LET'S", "PLAY A", "GAME"]; // Multi-line pixelated text

  const handleJoystickClick = () => {
    if (isClicked) return; // Prevent multiple clicks

    setIsClicked(true);

    // Wait for the joystick "down" animation to play
    setTimeout(() => {
      setIsZooming(true);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isZooming && ( // This component will unmount itself when zooming starts
        <motion.div
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          style={{
            backgroundImage: 'url(/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Main container for the arcade and its interactive parts */}
          {/* We animate this container to "zoom" */}
          <motion.div
            className="relative"
            // The zoom-in animation
            animate={{ scale: isClicked ? 10 : 1 }}
            // This is CRUCIAL: it sets the *origin* of the zoom.
            // You MUST adjust "50% 38%" to be the center of your arcade screen.
            style={{ transformOrigin: '50% 38%' }}
            transition={{ duration: 3, ease: 'easeIn' }}
            onAnimationComplete={() => {
              // When the zoom animation is done, call the prop
              if (isZooming) {
                onIntroComplete();
              }
            }}
          >
            {/* 1. The Arcade Machine Image */}
            {/* We fade this out as we zoom */}
            <motion.img
              src='/arcade.png'
              alt="Arcade machine"
              className="w-screen h-screen overflow-hidden"
              animate={{ opacity: isClicked ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* 2. The Text on the Screen */}
            {/* Positioned absolutely over the screen area */}
            <motion.div
              className="absolute flex flex-col items-start justify-center gap-1"
              // !!! YOU MUST TWEAK THESE VALUES !!!
              style={{
                top: '49%',
                left: '65%',
                transform: 'translateX(-50%)',
                width: '45%',
              }}
              animate={{ opacity: isClicked ? 0 : 1 }}
              transition={{ duration: 0.1 }}
            >
              {lines.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  className="font-pixel text-2xl md:text-2xl lg:text-4xl uppercase w-full text-left font-bold
                  "
                  // Glowing text effect
                  style={{
                    color: "white",
                    letterSpacing: '0.2em',
                  }}
                  variants={sentence}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Maps over the text to animate each letter with typing effect */}
                  {line.split('').map((char, charIndex) => (
                    <motion.span 
                      key={lineIndex + '-' + charIndex} 
                      variants={letter}
                      style={{ display: 'inline-block' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* 3. The Bouncing Arrow */}
            <motion.div
              className="absolute"
              // !!! YOU MUST TWEAK THESE VALUES !!!
              // Position this right above the joystick
              style={{
                top: '56%',
                left: '53%',
                transform: 'translateX(-50%)',
              }}
              // Bouncing animation
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowIcon />
            </motion.div>

            {/* 4. The Clickable Joystick Hotspot */}
            {/* This is an invisible div layered on top of the joystick */}
            <motion.div
              className="absolute w-16 h-20 cursor-pointer"
              // !!! YOU MUST TWEAK THESE VALUES !!!
              // Position this perfectly over the joystick
              style={{
                top: '58%',
                left: '53%',
                transform: 'translateX(-50%)',
              }}
              onClick={handleJoystickClick}
              // This animates the "joystick pull down" effect
              animate={isClicked ? { y: 8, scaleY: 0.9 } : { y: 0, scaleY: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};