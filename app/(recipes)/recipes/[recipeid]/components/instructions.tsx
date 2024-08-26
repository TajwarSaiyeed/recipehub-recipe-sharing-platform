"use client";
import React, { FC } from "react";

interface InstructionsProps {
  instructions: string[] | null;
}

const Instructions: FC<InstructionsProps> = ({ instructions }) => {
  if (!instructions) {
    return <p>No instructions available.</p>;
  }

  return (
    <div className={"space-y-2"}>
      <h2 className="text-lg font-medium">Instructions</h2>
      <ul className="space-y-4 text-muted-foreground">
        {instructions.map((instruction, index) => (
          <li key={index}>
            <div className="flex items-start gap-2">
              <p className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                {index + 1}
              </p>
              <p>{instruction}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instructions;
