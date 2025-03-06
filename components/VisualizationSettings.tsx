"use client";

import { useState } from "react";

// Update this type to match EnhancedBreathingCircle
export type VisualizationType = "circle" | "mandala" | "3d";

interface VisualizationSettingsProps {
  onVisualizationChange: (type: VisualizationType) => void;
  onColorChange: (color: string) => void;
}

export function VisualizationSettings({
  onVisualizationChange,
  onColorChange,
}: VisualizationSettingsProps) {
  const [selectedType, setSelectedType] = useState<VisualizationType>("circle");
  const [selectedColor, setSelectedColor] = useState("#3674B5");

  const handleTypeChange = (type: VisualizationType) => {
    setSelectedType(type);
    onVisualizationChange(type);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    onColorChange(e.target.value);
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-medium mb-2">Visualization Settings</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Style</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`p-2 rounded-md border ${
              selectedType === "circle" 
                ? "border-pink-500 bg-pink-500/10" 
                : "border-gray-300 dark:border-gray-700"
            }`}
            onClick={() => handleTypeChange("circle")}
          >
            Circle
          </button>
          <button
            className={`p-2 rounded-md border ${
              selectedType === "mandala" 
                ? "border-pink-500 bg-pink-500/10" 
                : "border-gray-300 dark:border-gray-700"
            }`}
            onClick={() => handleTypeChange("mandala")}
          >
            Mandala
          </button>
          <button
            className={`p-2 rounded-md border ${
              selectedType === "3d" 
                ? "border-pink-500 bg-pink-500/10" 
                : "border-gray-300 dark:border-gray-700"
            }`}
            onClick={() => handleTypeChange("3d")}
          >
            3D
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="w-full h-10 rounded-md cursor-pointer"
        />
      </div>
    </div>
  );
} 