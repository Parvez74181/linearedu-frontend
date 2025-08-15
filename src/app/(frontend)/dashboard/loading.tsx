import React from "react";

const loading = () => {
  return (
    <>
      <div className="!z-[9999999999999999999999999999999999999999999999999999999] w-full h-full flex items-center justify-center fixed">
        <div className="chaotic-orbit"></div>
      </div>
    </>
  );
};

export default loading;
