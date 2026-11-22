"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";
import { X, ZoomIn, Camera, Filter } from "lucide-react";

export default function GalleryClient() {
  const { gallery: cmsGallery } = useCms();
  const galleryList = cmsGallery && cmsGallery.length > 0 ? cmsGallery : GALLERY_ITEMS;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeImage, setActiveImage] = useState<any | null>(null);

  const categories = [
    "All",
    "Infrastructure",
    "Critical Care",
    "Operating Theatres",
    "Diagnostics",
    "Super-Specialist OPD",
  ];

  const filteredItems = galleryList.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Tour & Speciality Camps</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Photo Gallery & Facilities Tour
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the hospital building, adult ICU, neonatal ICU, operating theaters, and visiting specialist clinical camps in Mundra.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-14 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Filter by Category:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    selectedCategory === cat
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-800">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Icon Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="p-3 rounded-full bg-white/90 text-sky-700 shadow-lg">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-96 sm:h-[30rem] w-full bg-slate-950">
              <Image
                src={activeImage.image}
                alt={activeImage.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-white space-y-1">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                {activeImage.category}
              </span>
              <h3 className="text-xl font-black text-slate-900">{activeImage.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
