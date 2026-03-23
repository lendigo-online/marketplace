"use client";

import { useState, useEffect } from "react";

const words = ["Wypożycz", "Pożycz", "Zarabiaj", "Oszczędzaj"];
const TYPING_SPEED = 120;
const DELETING_SPEED = 60;
const PAUSE_DURATION = 2000;

export default function Typewriter() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        timeout = setTimeout(() => {}, 400); // small pause before typing next word
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, DELETING_SPEED);
      }
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_DURATION);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, TYPING_SPEED);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold leading-tight tracking-[-0.04em] text-[#1d1d1f] mb-6 min-h-[144px] md:min-h-[72px]">
      Rób co chcesz <br className="md:hidden" />
      <span className="bg-gradient-to-r from-[#0071e3] via-[#5856d6] to-[#34aadc] bg-clip-text text-transparent inline-flex items-center text-left">
        {text}
        <span className="inline-block w-[4px] h-[0.9em] bg-[#34aadc] ml-1 rounded-full animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
      </span>
    </h1>
  );
}
