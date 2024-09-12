'use client'

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import html2canvas from 'html2canvas';

const QuranPostGenerator = () => {
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [dimension, setDimension] = useState('post');
  const [showArabic, setShowArabic] = useState(true);
  const [verseText, setVerseText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState('');
  const postRef = useRef(null);

  const dimensionOptions = ['post', 'story'];
  const yesNoOptions = ['Yes', 'No'];

  const dimensionSizes = {
    post: 'w-[470px] h-[470px]',
    story: 'w-[315px] h-[560px]',
  };

  const generateRandomGradient = () => {
    const colors = [
      'from-blue-300 to-purple-300',
      'from-green-300 to-blue-300',
      'from-yellow-300 to-red-300',
      'from-pink-300 to-purple-300',
      'from-indigo-300 to-purple-300',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const fetchVerse = async () => {
    if (chapter < 0 || chapter > 114 || verse < 0 || verse > 286) {
      alert('Please enter valid chapter (1-114) and verse (1-286) numbers.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${chapter}:${verse}?translations=85`, {
        headers: { 'Accept': 'application/json' }
      });
      setEnglishTranslation(response.data.verse.translations[0].text);
    } catch (error) {
      console.error('Error fetching verse:', error);
      setVerseText('Error fetching verse. Please try again.');
      setEnglishTranslation('');
    }

    try {
      const response = await axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani_simple?verse_key=${chapter}:${verse}`, {
        headers: { 'Accept': 'application/json' }
      });
      setVerseText(response.data.verses[0].text_uthmani_simple);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching verse:', error);
      setVerseText('Error fetching verse. Please try again.');
      setVerseText('');
    }
    setGradient(generateRandomGradient());
    setLoading(false);
  };

  const downloadImage = async () => {
    if (postRef.current) {
      const scale = 2;
      const canvas = await html2canvas(postRef.current, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `quran-verse-${chapter}-${verse}.png`;
      link.click();
    }
  };

  const GraphicBackground = () => (
    <svg className="fixed inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="graph-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40 L40 0" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
          <path d="M0 0 L40 40" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#graph-pattern)" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative flex flex-col items-center">
      <GraphicBackground />

      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="mt-10 text-5xl font-bold mb-3 text-center text-pink-600">Insta Quran</h1>
          <h1 className="text-lg font-bold mb-6 text-center text-pink-500">Generate Qur&apos;anic Verses for Instagram</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Chapter (1-114)</label>
              <Input
                type="number"
                value={chapter}
                onChange={(e) => setChapter(Math.min(114, Math.max(1, e.target.value)))}
                min="1"
                max="114"
                className="text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Verse (1-286)</label>
              <Input
                type="number"
                value={verse}
                onChange={(e) => setVerse(Math.min(286, Math.max(1, e.target.value)))}
                min="1"
                max="286"
                className="text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Select Content Type</label>
              <div className="flex space-x-2">
                {dimensionOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setDimension(option)}
                    className={`flex-1 ${dimension === option ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Show Arabic Text</label>
              <div className="flex space-x-2">
                {yesNoOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setShowArabic(option === 'Yes')}
                    className={`flex-1 ${showArabic === (option === 'Yes') ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={fetchVerse} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Generate Post'}
            </Button>
          </div>
          {verseText && (
            <div className="mt-8 flex flex-col items-center">
              <div
                ref={postRef}
                className={`mt-8 relative ${dimensionSizes[dimension]} mx-auto bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 rounded-lg shadow-lg overflow-hidden`}
              >
                {showArabic && (
                  <p className="text-gray-800 text-center font-arabic text-2xl leading-relaxed mb-4 whitespace-pre-wrap" dir="rtl">
                    {verseText}
                  </p>
                )}
                <p className={`text-gray-800 text-center ${showArabic ? 'text-sm' : 'text-xl'} leading-relaxed`} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
                  &quot;{englishTranslation}&quot;
                </p>
                <br />
                <div className="text-gray-700 text-sm mb-2">
                  {chapter}:{verse}
                </div>
              </div>
              <Button onClick={downloadImage} className="mt-4 mx-auto w-full">
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranPostGenerator;




// const fetchVerse = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${chapter}:${verse}?translations=131`, {
//         headers: { 'Accept': 'application/json' }
//       });
//       console.log(response)
//       setVerseText(response.data.verse.translations[0].text);
//     } catch (error) {
//       console.error('Error fetching verse:', error);
//       setVerseText('Error fetching verse. Please try again.');
//     }
//     setLoading(false);
//     console.log(verseText)
    
//   };
