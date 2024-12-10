
import { FC } from "react";
import InputArea from "./InputArea";
import EyeTrackingSVG from "./Eye";


type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  
  return (
    <div className="flex flex-col items-center justify-center">
   
        <EyeTrackingSVG/>
      <h2 className="bg-custom-gradient bg-clip-text pb-1.5 pt-2 text-center text-3xl font-semibold leading-[normal] lg:text-[40px] text-white">
        Discover Smarter Search
      </h2>
      <p className=" text-zinc-500  text-sm pb-5 "> Unlock intelligent search with our AI-powered search engine</p>

      
      <div className="w-full max-w-[708px]  pb-6">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
        />
       
      </div>

    </div>
  );
};



export default Hero;
