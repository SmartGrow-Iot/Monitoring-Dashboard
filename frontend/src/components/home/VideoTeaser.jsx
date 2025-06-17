import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const VideoTeaser = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-b from-primary-light/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            See SmartGrow in Action
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Watch how SmartGrow transforms your gardening experience with intelligent automation
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto rounded-xl overflow-hidden shadow-xl bg-black">
          {showVideo ? (
            <div className="relative w-full">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
              <video
                controls
                autoPlay
                className="w-full h-auto max-h-[60vh] mx-auto"
                style={{ aspectRatio: '9/16' }}
                src="/resources/smartgrow-teaser.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="relative" style={{ aspectRatio: '9/16', maxHeight: '60vh' }}>
              <div className="absolute inset-0 bg-neutral-900/10 flex items-center justify-center">
                <button 
                  className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
                  onClick={() => setShowVideo(true)}
                >
                  <Play className="text-white" size={32} />
                </button>
              </div>
              <img
                src="/resources/video-thumbnail.jpg"
                alt="SmartGrow Teaser Video"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoTeaser; 