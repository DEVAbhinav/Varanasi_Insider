// components/Pink/SafetyBlock.jsx
export default function SafetyBlock() {
  return (
    <div className="py-20 px-4 bg-pink-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Your Safety is Our Priority</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* Replace with actual logos */}
          <div className="flex items-center gap-2">
            <img src="/images/up-police-logo.png" alt="UP Police 112" className="h-12"/>
            <p>UP Police 112</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/images/mission-shakti-logo.png" alt="Mission Shakti" className="h-12"/>
            <p>Mission Shakti</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/images/ministry-of-tourism-logo.png" alt="Ministry of Tourism" className="h-12"/>
          <p className="font-semibold">Ministry of Tourism</p>
        </div>
        </div>
      </div>
    </div>
  );
}
