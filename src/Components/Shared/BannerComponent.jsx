import React from "react";

function BannerComponent({
  title = "Products",
  subtitle = "Home / Products",
} = {}) {
  return (
    <div
      className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
      style={{
        backgroundImage: `url('/banner-image.jpg')`,
        backgroundColor: "rgba(255,255,255,0.4)",
        backgroundBlendMode: "lighten",
      }}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm mt-2">{subtitle}</p>
    </div>
  );
}

export default BannerComponent;
