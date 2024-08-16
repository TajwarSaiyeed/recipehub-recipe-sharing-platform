"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const TopLoader = () => {
  return (
    <ProgressBar
      height="4px"
      color="#2c6eff"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default TopLoader;
