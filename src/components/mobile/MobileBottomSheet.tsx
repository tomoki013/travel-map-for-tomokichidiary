"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MobileBottomSheetProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  minHeight?: string;
  maxHeight?: string;
}

export function MobileBottomSheet({
  children,
  title,
  isOpen,
  onOpenChange,
  minHeight = "4rem", // Header height
  maxHeight = "50vh",
}: MobileBottomSheetProps) {
  const [currentHeight, setCurrentHeight] = useState(isOpen ? maxHeight : minHeight);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);

  useEffect(() => {
    setCurrentHeight(isOpen ? maxHeight : minHeight);
  }, [isOpen, maxHeight, minHeight]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    // Calculate current pixel height based on visual state roughly
    // Or just use logic relative to start
    const sheet = e.currentTarget.parentElement;
    if (sheet) {
      startHeight.current = sheet.getBoundingClientRect().height;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY; // Moving up is positive diff
    // Logic to update height dynamically could be added here for smoother drag
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    if (diff > 50) {
      // Swipe Up
      onOpenChange(true);
    } else if (diff < -50) {
      // Swipe Down
      onOpenChange(false);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/20 rounded-t-2xl transition-all duration-300 ease-in-out z-50 flex flex-col shadow-2xl pointer-events-auto`}
      style={{ height: currentHeight }}
    >
      {/* Handle / Header */}
      <div
        className="w-full flex flex-col items-center pt-2 pb-3 shrink-0 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onOpenChange(!isOpen)}
      >
        <div className="w-12 h-1.5 bg-white/30 rounded-full mb-2" />
        {title && (
          <div className="flex items-center gap-2 text-white font-serif text-sm">
            <span>{title}</span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
