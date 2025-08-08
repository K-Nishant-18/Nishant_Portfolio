import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]">
      <img
        src="/loader2.gif"
        alt="Loading..."
        className="w-1/2 h-1/2 sm:w-32 sm:h-32 md:w-80 md:h-80 object-contain"
      />
    </div>
  );
};

export default Loader;