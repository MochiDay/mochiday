import { useState } from "react";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState([]);

  console.log(files);

  return (
    <div className="flex h-[100dvh] bg-base-100 p-2">
      <div className="w-full h-full rounded-xl border-4 border-black bg-[#FDF6E5] justify-center items-center flex flex-col">
        <div className="w-full max-w-2xl h-full flex flex-col justify-center">
          <h1 className="text-4xl font-black">Let&#39;s get started!</h1>
          <div className="mt-10"></div>
        </div>
      </div>
    </div>
  );
}
