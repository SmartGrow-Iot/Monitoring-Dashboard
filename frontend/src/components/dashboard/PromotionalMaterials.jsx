import React, { useState } from 'react';
import { FileText, Video, Rocket, Code, Search, Download, Presentation } from 'lucide-react';

const PromotionalMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('manual');

  const tabs = [
    { id: 'manual', label: 'User Manual', icon: <FileText size={20} /> },
    { id: 'slides', label: 'Training Slides', icon: <Presentation size={20} /> },
    { id: 'training', label: ' Training Video', icon: <Video size={20} /> },
  ];

  const resources = {
    manual: {
      title: 'User Manual',
      description: 'Complete guide to using SmartGrow system',
      content: '/resources/user-manual.html',
      downloadUrl: '/resources/user-manual.pdf',
      lastUpdated: '08-06-2025',
      keywords: ['manual', 'guide', 'documentation', 'user', 'help']
    },
    training: {
      title: 'Training Video',
      description: 'Step-by-step video tutorials and guides',
      content: '/resources/SmartGrow Training Video.mp4',
      downloadUrl: '/resources/SmartGrow Training Video.mp4',
      duration: '15 min',
      lastUpdated: '08-06-2025',
      keywords: ['training', 'tutorial', 'video', 'guide', 'learn']
    },
    slides: {
      title: 'Training Slides',
      description: 'Presentation slides for SmartGrow training sessions',
      content: '/resources/SmartGrow Training Slides.pdf',
      downloadUrl: '/resources/SmartGrow Training Slides.pdf',
      lastUpdated: '08-06-2025',
      keywords: ['slides', 'training', 'presentation', 'pdf']
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedQuery = query.toLowerCase();
    const matchingTab = tabs.find(tab =>
      tab.label.toLowerCase().includes(normalizedQuery) ||
      resources[tab.id].keywords.some(keyword => keyword.includes(normalizedQuery))
    );
    if (matchingTab) {
      setActiveTab(matchingTab.id);
    }
  };

  const handleDownload = () => {
    const resource = resources[activeTab];
    const link = document.createElement('a');
    link.href = resource.downloadUrl;
    link.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.${resource.downloadUrl.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Search Bar */}
      <div className="p-6 border-b border-neutral-200">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <Search className="absolute left-3 top-2.5 text-neutral-400" size={20} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex space-x-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              {resources[activeTab].title}
            </h2>
            <p className="text-neutral-600">{resources[activeTab].description}</p>
            <div className="mt-2 text-sm text-neutral-500">
              {resources[activeTab].duration && (
                <p className="mb-1">Duration: {resources[activeTab].duration}</p>
              )}
              <p>Last updated: {resources[activeTab].lastUpdated}</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {/* Preview Area */}
        <div className="bg-neutral-50 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
          {activeTab === 'training' ? (
            <div className="flex justify-center items-center h-full bg-black">
              <video
                controls
                className="w-full h-full object-contain"
                src={resources[activeTab].content}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : activeTab === 'slides' ? (
            <iframe
              src={resources[activeTab].content}
              className="w-full h-full rounded-lg"
              style={{ height: '100%' }}
              title={resources[activeTab].title}
            />
          ) : (
            <iframe
              src={resources[activeTab].content}
              className="w-full h-full rounded-lg"
              style={{ height: '100%' }}
              title={resources[activeTab].title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalMaterials;

