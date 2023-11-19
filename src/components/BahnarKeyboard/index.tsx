import React, { useState, useEffect } from 'react';

import characters from './characters';

type BahnarSymbolModalProps = {
  leftposition: number;
  topposition: number;
  inputCharacter: (character: string) => void;
};

const BahnarSymbolModal = ({
  leftposition,
  topposition,
  inputCharacter,
}: BahnarSymbolModalProps) => {
  const [capitalized, setCapitalized] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.getModifierState('CapsLock') === !capitalized)
        setCapitalized(event.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [capitalized]);

  return (
    <div
      className={`absolute z-[3] w-fit bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]`}
      style={{
        left: leftposition,
        top: topposition,
      }}
    >
      <div className='flex flex-col'>
        <div className='flex'>
          {characters.slice(0, 5).map((character) => (
            <div
              key={character.id}
              onClick={() =>
                inputCharacter(capitalized ? character.capitalized : character.uncapitalized)
              }
              className='flex h-6 w-6 cursor-pointer items-center justify-center border-0 hover:border-[1px] hover:border-[#BDBCCC] focus:border-[1px] focus:border-[#BDBCCC] md:h-7 md:w-7'
            >
              <p className='text-[12px] font-bold md:text-base'>
                {capitalized ? character.capitalized : character.uncapitalized}
              </p>
            </div>
          ))}
        </div>
        <div className='flex'>
          {characters.slice(5, 10).map((character) => (
            <div
              key={character.id}
              onClick={() =>
                inputCharacter(capitalized ? character.capitalized : character.uncapitalized)
              }
              className='flex h-6 w-6 cursor-pointer items-center justify-center border-0 hover:border-[1px] hover:border-[#BDBCCC] focus:border-[1px] focus:border-[#BDBCCC] md:h-7 md:w-7'
            >
              <p className='text-[12px] font-bold md:text-base'>
                {capitalized ? character.capitalized : character.uncapitalized}
              </p>
            </div>
          ))}
        </div>
        <div className='flex w-full justify-between'>
          <div className='flex'>
            {characters.slice(10).map((character) => (
              <div
                key={character.id}
                onClick={() =>
                  inputCharacter(capitalized ? character.capitalized : character.uncapitalized)
                }
                className='flex h-6 w-6 cursor-pointer items-center justify-center border-0 hover:border-[1px] hover:border-[#BDBCCC] focus:border-[1px] focus:border-[#BDBCCC] md:h-7 md:w-7'
              >
                <p className='text-[12px] font-bold md:text-base'>
                  {capitalized ? character.capitalized : character.uncapitalized}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCapitalized(!capitalized)}
            className={`flex items-center space-x-1 ${
              capitalized
                ? 'bg-[#f2f5ff]'
                : 'border-l-[0.5px] border-t-[0.5px] border-[#262664]/[.5] bg-white'
            } px-2`}
          >
            <div
              className={`h-1 w-1 rounded-full ${
                capitalized ? 'bg-[#262664]' : 'border-[0.5px] border-[#262664] bg-white'
              }`}
            />
            <p
              className={`text-[12px] font-medium md:text-base ${
                capitalized ? 'text-[#262664]' : 'text-[#BDBCCC]/[.85]'
              }`}
            >
              AB
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BahnarSymbolModal;
