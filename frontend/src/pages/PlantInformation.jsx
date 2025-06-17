import React, { useState } from 'react';
import { Thermometer, Droplets, Sun, Wind, Scissors, Calendar, AlertTriangle, Sprout } from 'lucide-react';

const PlantInformation = () => {
  const [selectedPlant, setSelectedPlant] = useState('red-chili');

  // Mock plant data - in real app this would come from API/database
  const plantData = {
    'red-chili': {
      name: 'Red Chili',
      image: 'https://images.pexels.com/photos/127078/pexels-photo-127078.jpeg',
      title: 'Chili Growing Guide',
      stages: {
        germination: { duration: '5-10 days', progress: 100 },
        seedling: { duration: '60-90 days', progress: 85 },
        maturity: { duration: '70-85 days', progress: 45 }
      },
      soilRequirements: {
        description: 'Well-draining, fertile soil with pH 6.0-6.8. Add organic matter for better results.',
        ph: '6.0-6.8',
        type: 'Well-draining, fertile'
      },
      wateringSchedule: {
        description: 'Regular watering, keep soil moist but not waterlogged. Reduce watering during fruiting stage.',
        frequency: 'Daily',
        amount: 'Moderate'
      },
      lightRequirements: {
        description: 'Full sun (6-8 hours daily). Minimum: 6 hours. Maximum: 14 hours. Protect from intense afternoon sun.',
        daily: '6-8 hours',
        minimum: '6 hours',
        maximum: '14 hours'
      },
      careInstructions: {
        temperature: {
          ideal: '20°C - 30°C',
          minimum: '18°C',
          maximum: '35°C',
          note: 'Protect from frost'
        },
        humidity: {
          range: '40% - 60%',
          note: 'Good air circulation essential. Use humidity tray if needed.'
        },
        diseases: {
          common: ['Aphids', 'Whiteflies', 'Spider mites'],
          prevention: 'Maintain good ventilation and avoid overcrowding'
        }
      },
      advancedCare: {
        pruning: {
          when: 'Remove lower leaves and suckers. Prune to maintain 2-3 main stems for stronger growth.',
          frequency: 'Weekly during growing season'
        },
        harvesting: {
          timing: 'Harvest when chilies are fully colored. Use scissors to cut. Regular harvesting encourages more fruit.',
          method: 'Cut with clean scissors'
        }
      }
    },
    'eggplant': {
      name: 'Eggplant',
      image: 'https://images.pexels.com/photos/29337075/pexels-photo-29337075/free-photo-of-vibrant-eggplant-plant-in-home-garden-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Eggplant Growing Guide',
      stages: {
        germination: { duration: '7-14 days', progress: 100 },
        seedling: { duration: '70-100 days', progress: 70 },
        maturity: { duration: '80-100 days', progress: 30 }
      },
      soilRequirements: {
        description: 'Rich, well-draining soil with pH 6.0-7.0. Requires good organic content.',
        ph: '6.0-7.0',
        type: 'Rich, well-draining'
      },
      wateringSchedule: {
        description: 'Consistent moisture needed. Deep watering 2-3 times per week.',
        frequency: 'Daily',
        amount: 'Deep watering'
      },
      lightRequirements: {
        description: 'Full sun (6-8 hours daily). Minimum: 6 hours. Protect from strong winds.',
        daily: '6-8 hours',
        minimum: '6 hours',
        maximum: '12 hours'
      },
      careInstructions: {
        temperature: {
          ideal: '22°C - 28°C',
          minimum: '20°C',
          maximum: '32°C',
          note: 'Sensitive to cold'
        },
        humidity: {
          range: '50% - 75%',
          note: 'Higher humidity preferred. Mulch around base.'
        },
        diseases: {
          common: ['Flea beetles', 'Spider mites', 'Verticillium wilt'],
          prevention: 'Proper spacing and crop rotation'
        }
      },
      advancedCare: {
        pruning: {
          when: 'Remove suckers and lower leaves. Support heavy branches.',
          frequency: 'Bi-weekly maintenance'
        },
        harvesting: {
          timing: 'Harvest when skin is glossy and firm. Cut with pruning shears.',
          method: 'Cut stem with sharp shears'
        }
      }
    }
  };

  const currentPlant = plantData[selectedPlant];

  const ProgressBar = ({ progress, duration, stage }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-neutral-700 capitalize">{stage}</span>
        <span className="text-sm text-neutral-500">{duration}</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Plant Information</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPlant('red-chili')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedPlant === 'red-chili'
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Red Chili
            </button>
            <button
              onClick={() => setSelectedPlant('eggplant')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedPlant === 'eggplant'
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Eggplant
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Plant Header */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex gap-6">
            <div className="w-80 h-52 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={currentPlant.image} 
                alt={currentPlant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">{currentPlant.title}</h2>
              
              {/* Growth Progress */}
              <div className="space-y-1">
                <ProgressBar 
                  progress={currentPlant.stages.germination.progress} 
                  duration={currentPlant.stages.germination.duration}
                  stage="germination"
                />
                <ProgressBar 
                  progress={currentPlant.stages.seedling.progress} 
                  duration={currentPlant.stages.seedling.duration}
                  stage="seedling period"
                />
                <ProgressBar 
                  progress={currentPlant.stages.maturity.progress} 
                  duration={currentPlant.stages.maturity.duration}
                  stage="maturity"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Growth Stage</span>
                <span className="text-sm font-semibold text-green-600">Seedling</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Days to Harvest</span>
                <span className="text-sm font-semibold text-blue-600">45-60 days</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Difficulty</span>
                <span className="text-sm font-semibold text-amber-600">Medium</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Yield</span>
                <span className="text-sm font-semibold text-purple-600">High</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <h4 className="font-medium text-neutral-900 mb-3">Seasonal Calendar</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-green-100 rounded text-center">
                  <div className="font-medium text-green-800">Best Planting</div>
                  <div className="text-green-600">Spring</div>
                </div>
                <div className="p-2 bg-orange-100 rounded text-center">
                  <div className="font-medium text-orange-800">Harvest</div>
                  <div className="text-orange-600">Summer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Growing Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Growing Requirements</h3>
            
            <div className="space-y-4">
              {/* Soil Requirements */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Soil Requirements</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.soilRequirements.description}</p>
                  <div className="text-xs text-neutral-500">
                    pH: {currentPlant.soilRequirements.ph} • Type: {currentPlant.soilRequirements.type}
                  </div>
                </div>
              </div>

              {/* Watering Schedule */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Watering Schedule</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.wateringSchedule.description}</p>
                  <div className="text-xs text-neutral-500">
                    Frequency: {currentPlant.wateringSchedule.frequency} • Amount: {currentPlant.wateringSchedule.amount}
                  </div>
                </div>
              </div>

              {/* Light Requirements */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Light Requirements</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.lightRequirements.description}</p>
                  <div className="text-xs text-neutral-500">
                    Daily: {currentPlant.lightRequirements.daily} • Min: {currentPlant.lightRequirements.minimum} • Max: {currentPlant.lightRequirements.maximum}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Care Instructions</h3>
            
            <div className="space-y-4">
              {/* Temperature */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Temperature</h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    Ideal: {currentPlant.careInstructions.temperature.ideal}. 
                    Min: {currentPlant.careInstructions.temperature.minimum}. 
                    Max: {currentPlant.careInstructions.temperature.maximum}. 
                    {currentPlant.careInstructions.temperature.note}
                  </p>
                </div>
              </div>

              {/* Humidity */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wind className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Humidity</h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    Range: {currentPlant.careInstructions.humidity.range}. {currentPlant.careInstructions.humidity.note}
                  </p>
                </div>
              </div>

              {/* Disease Prevention */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Disease Prevention</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.careInstructions.diseases.prevention}</p>
                  <div className="text-xs text-neutral-500">
                    Common issues: {currentPlant.careInstructions.diseases.common.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Common Problems & Solutions */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Common Problems & Solutions</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-medium text-red-800 mb-1">Yellowing Leaves</h4>
                <p className="text-sm text-neutral-600 mb-2">Usually caused by overwatering or nutrient deficiency.</p>
                <p className="text-xs text-red-600">Solution: Check soil drainage and reduce watering frequency.</p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-medium text-yellow-800 mb-1">Slow Growth</h4>
                <p className="text-sm text-neutral-600 mb-2">May indicate insufficient light or nutrients.</p>
                <p className="text-xs text-yellow-600">Solution: Move to brighter location and fertilize monthly.</p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-medium text-orange-800 mb-1">Pest Infestation</h4>
                <p className="text-sm text-neutral-600 mb-2">Aphids and whiteflies are common issues.</p>
                <p className="text-xs text-orange-600">Solution: Use insecticidal soap or neem oil spray.</p>
              </div>
            </div>
          </div>

          {/* Nutrition & Fertilizing */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Nutrition & Fertilizing</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">N</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Nitrogen (N)</h4>
                  <p className="text-sm text-neutral-600">Essential for leaf growth. Use during vegetative stage.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">P</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Phosphorus (P)</h4>
                  <p className="text-sm text-neutral-600">Promotes root development and flowering.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">K</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Potassium (K)</h4>
                  <p className="text-sm text-neutral-600">Improves fruit quality and disease resistance.</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <strong>Fertilizing Schedule:</strong> Apply balanced fertilizer (10-10-10) every 2-3 weeks during growing season.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Care Guide & Fun Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Advanced Care Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Advanced Care Guide</h3>
            
            <div className="space-y-4">
              {/* Pruning Guidelines */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Pruning Guidelines</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.advancedCare.pruning.when}</p>
                  <div className="text-xs text-neutral-500">
                    Frequency: {currentPlant.advancedCare.pruning.frequency}
                  </div>
                </div>
              </div>

              {/* Harvesting Tips */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Harvesting Tips</h4>
                  <p className="text-sm text-neutral-600 mb-2">{currentPlant.advancedCare.harvesting.timing}</p>
                  <div className="text-xs text-neutral-500">
                    Method: {currentPlant.advancedCare.harvesting.method}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-orange-200 p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">🎉 Fun Facts</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-lg">🌶️</span>
                <p className="text-sm text-neutral-700">
                  {selectedPlant === 'red-chili' 
                    ? "Chilies contain capsaicin, which triggers the release of endorphins - natural mood boosters!"
                    : "Eggplants are technically berries and are related to tomatoes and potatoes!"
                  }
                </p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="text-lg">🔥</span>
                <p className="text-sm text-neutral-700">
                  {selectedPlant === 'red-chili'
                    ? "The heat level of chilies is measured in Scoville Heat Units (SHU). Bell peppers are 0 SHU!"
                    : "The name 'eggplant' comes from early varieties that were white and shaped like eggs!"
                  }
                </p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="text-lg">🌍</span>
                <p className="text-sm text-neutral-700">
                  {selectedPlant === 'red-chili'
                    ? "Chilies originated in Central America over 6,000 years ago and spread worldwide!"
                    : "Eggplants were first cultivated in India over 4,000 years ago!"
                  }
                </p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="text-lg">💪</span>
                <p className="text-sm text-neutral-700">
                  {selectedPlant === 'red-chili'
                    ? "Red chilies are packed with Vitamin C - more than oranges!"
                    : "Eggplants are rich in antioxidants and may help improve heart health!"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Schedule Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-6">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">📋 Care Schedule Checklist</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Tasks */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">D</span>
                Daily Tasks
              </h4>
              <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Water plant in the morning</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Check soil moisture</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Inspect for pests</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Remove dead/yellow leaves</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Monitor growth progress</span>
                </li>
              </ul>
            </div>

            {/* Weekly Tasks */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">W</span>
                Every 2 Weeks
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Deep watering session</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Check soil pH levels</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Prune unnecessary growth</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Clean plant leaves</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Rotate plant position</span>
                </li>
              </ul>
            </div>

            {/* Monthly Tasks */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">M</span>
                Monthly Tasks
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Apply fertilizer</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Check for root bound</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Repot if necessary</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Deep soil inspection</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span>Review growth metrics</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              💡 <strong>Pro Tip:</strong> Create a routine and stick to it! Consistent care leads to healthier, more productive plants.
            </p>
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-neutral-200 p-6 mt-6">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">💡 Pro Tips & Best Practices</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-green-800 mb-2">🌱 Companion Planting</h4>
              <p className="text-sm text-neutral-600">Plant with basil, tomatoes, or marigolds to deter pests naturally.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-blue-800 mb-2">💧 Water Quality</h4>
              <p className="text-sm text-neutral-600">Use room temperature water. Avoid chlorinated water when possible.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-purple-800 mb-2">🌡️ Temperature Control</h4>
              <p className="text-sm text-neutral-600">Maintain consistent temperature. Avoid sudden temperature changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantInformation;