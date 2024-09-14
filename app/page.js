import Image from "next/image";
import QuranVerse from "../components/QuranVerse"

export default function Home() {
  return (
   <div className="bg-gradient-to-br from-gray-100 to-gray-200">
      <p className="text-center text-2xl text-yellow-600 font-bold pt-5">
      اللهم صل على سيدنا ونبينا ومولانا محمد وعلى آله وصحبه أجمعين

      </p>

      <QuranVerse />

      <p className="text-center text-gray-800 pb-4">
        Created by <a href="https://x.com/mogheess_" target="_blank"> <span className="text-pink-600 font-semibold">Zuno</span> </a>
        <br/>
        Send Salawat to the Prophet (صلى الله عليه وسلم) 
        <br/>
      </p>
    </div>
  );
}
