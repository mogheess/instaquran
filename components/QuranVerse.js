"use client";

import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import { Download, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import html2canvas from "html2canvas";
import { chapterToVerseCount } from "./data";
import { debounce } from "lodash";

const QuranPostGenerator = () => {
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [dimension, setDimension] = useState("post");
  const [showArabic, setShowArabic] = useState(true);
  const [verseText, setVerseText] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState("");
  const postRef = useRef(null);
  const [backgroundType, setBackgroundType] = useState("gradient");
  const [imageTheme, setImageTheme] = useState("dark");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verseError, setVerseError] = useState("");
  const [chapterError, setChapterError] = useState("");

  const dimensionOptions = ["post", "story"];
  const yesNoOptions = ["Yes", "No"];

  const getThemedImages = (theme) => {
    const images = {
      dark: [
        // 'https://i.imgur.com/ldFbZ2v.jpeg',
        "https://i.imgur.com/pXxHxDX.jpeg",
        "https://i.imgur.com/cCf5Hqj.jpeg",
        "https://i.imgur.com/LUQkxCn.jpeg",
        "https://i.imgur.com/mRJqaLx.jpeg",
        "https://i.imgur.com/lrICBPd.jpeg",
        "https://i.imgur.com/Y6OBems.jpeg",
      ],
      light: [
        "https://i.imgur.com/WGkyHfd.jpeg",
        "https://i.imgur.com/DNpjHq9.jpeg",
        "https://i.imgur.com/VIPGlxB.jpeg",
        "https://i.imgur.com/vP1VUmx.jpeg",
        "https://i.imgur.com/pZVu7ff.jpeg",
        "https://i.imgur.com/ETdJ6VT.jpeg",
      ],
    };
    return images[theme];
  };

  const dimensionSizes = {
    post: "w-full max-w-[470px] h-[470px]",
    story: "w-full max-w-[315px] h-[560px]",
  };

  const gradients = [
    { name: "Blue to Purple", class: "from-blue-300 to-purple-300" },
    { name: "Green to Blue", class: "from-green-300 to-blue-300" },
    { name: "Yellow to Red", class: "from-yellow-300 to-red-300" },
    { name: "Pink to Purple", class: "from-pink-300 to-purple-300" },
    { name: "Indigo to Purple", class: "from-indigo-300 to-purple-300" },
    { name: "Teal to Lime", class: "from-teal-300 to-lime-300" },
    { name: "Orange to Rose", class: "from-orange-300 to-rose-300" },
    { name: "Sky to Emerald", class: "from-sky-300 to-emerald-300" },
    { name: "Fuchsia to Amber", class: "from-fuchsia-300 to-amber-300" },
    { name: "Cyan to Violet", class: "from-cyan-300 to-violet-300" },
  ];

  useEffect(() => {
    setGradient(gradients[0].class); // Set default gradient
    setSelectedImage(getThemedImages("dark")[0]);
  }, []);

  useEffect(() => {
    if (verseText) {
      generateAndSetImageUrl();
    }
  }, [
    verseText,
    showArabic,
    dimension,
    gradient,
    backgroundType,
    selectedImage,
  ]);

  const getArabicTextStyle = () => {
    let style = "font-amiri";
    if (backgroundType === "gradient") {
      style += " text-gray-800";
    } else if (imageTheme === "dark") {
      style += " text-yellow-300";
    } else {
      style += " text-gray-800 font-semibold";
    }
    return style;
  };

  const getEnglishTextStyle = () => {
    if (backgroundType === "gradient") {
      return "text-gray-800";
    } else if (imageTheme === "dark") {
      return "text-yellow-300 italic";
    } else {
      return "text-gray-800 font-semibold";
    }
  };

  const fetchVerse = async () => {
    if (chapter < 1 || chapter > 114 || verse < 1 || verse > 286) {
      alert("Please enter valid chapter (1-114) and verse (1-286) numbers.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.quran.com/api/v4/verses/by_key/${chapter}:${verse}?translations=85`,
        {
          headers: { Accept: "application/json" },
        },
      );
      setEnglishTranslation(response.data.verse.translations[0].text);
    } catch (error) {
      console.error("Error fetching verse:", error);
      setVerseText("Error fetching verse. Please try again.");
      setEnglishTranslation("");
    }

    try {
      const response = await axios.get(
        `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${chapter}:${verse}`,
        {
          headers: { Accept: "application/json" },
        },
      );
      setVerseText(response.data.verses[0].text_uthmani);
    } catch (error) {
      console.error("Error fetching verse:", error);
      setVerseText("Error fetching verse. Please try again.");
      setVerseText("");
    }

    setLoading(false);
  };

  const generateAndSetImageUrl = async () => {
    if (postRef.current) {
      const scale = 2;
      const canvas = await html2canvas(postRef.current, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png");
      setImageUrl(image);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `quran-verse-${chapter}-${verse}.png`;
      link.click();
    }
  };

  const copyImageToClipboard = async () => {
    if (imageUrl) {
      try {
        const blob = await fetch(imageUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Image copied to clipboard! You can now paste it on Instagram.");
      } catch (err) {
        console.error("Failed to copy image: ", err);
        alert(
          "Failed to copy image. Please try downloading and sharing manually.",
        );
      }
    }
  };

  const handleChapterChange = (e) => {
    const chapter = e.target.value;
    setChapter(chapter);
    debouncedValidateInput(chapter, verse);
  };

  const handleVerseChange = (e) => {
    const verse = e.target.value;
    setVerse(verse);
    debouncedValidateInput(chapter, verse);
  };

  // memoize the callback with useCallback
  // it is needed since it's a dependency in useMemo below
  const validateInput = useCallback((chapter, verse) => {
    if (chapterIsValid(chapter)) {
      setChapterError("");
    } else {
      setChapterError("Enter a chapter number between 1 and 114");
      setVerseError("");
      return;
    }
    if (verseIsValid(chapter, verse)) {
      setVerseError("");
    } else {
      const maxVerseNumber = chapterToVerseCount[chapter];
      setVerseError(`Enter a verse number between 1 and ${maxVerseNumber}`);
    }
  }, []);

  // use debounce to avoid validating input on every key press and only do it
  // after the user has stopped typing
  // useMemo is needed to retain the debounce function between renders
  // if useMemo is not used, validate would still run on every key press but on
  // a delay
  const debouncedValidateInput = useMemo(() => {
    return debounce(validateInput, 500);
  }, [validateInput]);

  function chapterIsValid(chapter) {
    return chapter in chapterToVerseCount;
  }

  function verseIsValid(chapter, verse) {
    // validate chapter
    if (chapter in chapterToVerseCount == false) {
      return false;
    }
    // validate verse
    if (verse <= 0 || verse > chapterToVerseCount[chapter]) {
      return false;
    }
    return true;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative flex flex-col items-center">
      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="mt-10 text-5xl font-bold mb-3 text-center text-pink-600">
            Insta Quran
          </h1>
          <h1 className="text-lg font-bold mb-6 text-center text-pink-500">
            Generate Qur&apos;anic Verses for Instagram
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Chapter
              </label>
              <Input
                type="number"
                value={chapter}
                onChange={handleChapterChange}
                className={`${chapterError && "border-2 border-red-600"} duration-0 text-gray-800`}
              />
              <div
                className={`${chapterError || "invisible"} min-h-6 text-sm font-medium text-red-600 -mb-3 mt-1 p-0.5`}
              >
                {chapterError}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Verse
              </label>
              <Input
                type="number"
                value={verse}
                onChange={handleVerseChange}
                className={`${verseError && "border-2 border-red-600"} duration-0 text-gray-800`}
              />
              <div
                className={`${verseError || "invisible"} min-h-6 text-sm font-medium text-red-600 -mb-3 mt-1 p-0.5`}
              >
                {verseError}
              </div>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Background Type
              </label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setBackgroundType("gradient")}
                  className={`flex-1 ${backgroundType === "gradient" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Gradient
                </Button>
                <Button
                  onClick={() => setBackgroundType("image")}
                  className={`flex-1 ${backgroundType === "image" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Image
                </Button>
              </div>
            </div>

            {backgroundType == "gradient" && (
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Select Gradient
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {gradients.map((g) => (
                      <button
                        key={g.name}
                        onClick={() => setGradient(g.class)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.class} border-2 ${
                          gradient === g.class
                            ? "border-pink-600"
                            : "border-transparent"
                        }`}
                        title={g.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {backgroundType === "image" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Image Theme
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setImageTheme("dark")}
                      className={`flex-1 ${imageTheme === "dark" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      Dark
                    </Button>
                    <Button
                      onClick={() => setImageTheme("light")}
                      className={`flex-1 ${imageTheme === "light" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      Light
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Select Image
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getThemedImages(imageTheme).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-md bg-cover bg-center border-2 ${
                          selectedImage === img
                            ? "border-pink-600"
                            : "border-transparent"
                        }`}
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Select Content Type
              </label>
              <div className="flex space-x-2">
                {dimensionOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setDimension(option)}
                    className={`flex-1 ${dimension === option ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Show Arabic Text
              </label>
              <div className="flex space-x-2">
                {yesNoOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setShowArabic(option === "Yes")}
                    className={`flex-1 ${showArabic === (option === "Yes") ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={fetchVerse} disabled={loading} className="w-full">
              {loading ? "Loading..." : "Generate Post"}
            </Button>
          </div>

          {/* OUTPUT */}
          {verseText && (
            <div className="mt-8 flex flex-col items-center">
              <div
                ref={postRef}
                className={`relative ${dimensionSizes[dimension]} bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 rounded-lg shadow-lg overflow-hidden`}
                style={{
                  backgroundImage:
                    backgroundType === "image" ? `url(${selectedImage})` : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {showArabic && (
                  <p
                    className={`${getArabicTextStyle()} text-center font-arabic text-lg leading-relaxed mb-4 whitespace-pre-wrap`}
                    dir="rtl"
                  >
                    {verseText}
                  </p>
                )}
                <p
                  className={`${getEnglishTextStyle()} text-center ${showArabic ? "text-sm" : "text-xl"} leading-relaxed`}
                  style={{ direction: "ltr", unicodeBidi: "isolate" }}
                >
                  &quot;{englishTranslation}&quot;
                </p>

                <br />
                <div className={`${getArabicTextStyle()} text-sm mb-2`}>
                  {chapter}:{verse}
                </div>
              </div>

              <div className="mt-4 flex space-x-2 w-full">
                <Button onClick={downloadImage} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button onClick={copyImageToClipboard} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy to clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranPostGenerator;
