import { FC } from 'react'
import Image from 'next/image'
import TypeAnimation from './TypeAnimation';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
interface InputAreaProps {
  promptValue: string;
    setPromptValue: React.Dispatch<React.SetStateAction<string>>;
    handleDisplayResult: () => void;
    disabled?: boolean;
    reset?: ()=> void;
}

const InputArea: FC<InputAreaProps> = ({ promptValue,
    setPromptValue,
    handleDisplayResult,
    disabled,
    reset,}) => {
  return(
    <form className='mx-auto flex h-[50px]  w-full items-center justify-between rounded-[30px]  bg-[#262626] px-3 '  
    onSubmit={(e) => {
        e.preventDefault();
        if(reset) reset();
        handleDisplayResult();
    }
    }
    >
        <input type="text"
            placeholder='Ask a question...'
            className=' focus-visible::outline-0  my-1 w-full pl-5 font-light not-italic leading-[normal] text-[#1B1B16]/30 bg-inherit text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm' 
            disabled={disabled}
            value={promptValue}
            required
            onChange={(e) => setPromptValue(e.target.value)}
            />
            
            <button
            disabled={disabled}
            type='submit'
            className='realtive flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[3px]'
            >
                {disabled && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <TypeAnimation />
                    </div>
                )}

                <Image
                unoptimized
                src={"/img/arrow-narrow-right.svg"}
          alt="search"
          width={24}
          height={24}
          className={disabled ? "invisible" : ""}
                />

            </button>

    </form>
  )

}

export default InputArea