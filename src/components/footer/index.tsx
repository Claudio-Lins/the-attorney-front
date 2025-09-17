'use client';

import React from 'react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`relative flex w-full pb-[100px] text-[#d6dfed] min-h-[400px] pt-40 ${className}`}>
      {/* Background com ondas animadas */}
      <div className="absolute -bottom-20 left-0 w-full h-[750px] overflow-hidden z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          width="100%"
          height="100%"
          viewBox="0 0 1600 900"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'scaleY(2) scaleX(1.5)', transformOrigin: 'bottom' }}
        >
          {/* Primeira onda */}
          <path
            fill="rgba(4, 54, 160, 0.4)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              dur="48s"
              values="270 130; -334 80; 270 130"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Segunda onda */}
          <path
            fill="rgba(4, 54, 160, 0.6)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              dur="36s"
              values="-270 130;243 120;-270 130"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Terceira onda */}
          <path
            fill="rgba(4, 54, 160, 0.8)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              dur="24s"
              values="0 130;-140 100;0 130"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    
      
      {/* Conteúdo do footer */}
      <section className="relative z-10 flex flex-col items-center gap-[30px] w-full">
        {/* Links sociais */}
        <ul className="flex list-none p-0 m-0 gap-[10px]">
          <li>
            <a
              href="#"
              className="text-2xl bg-white/[0.06] backdrop-blur-[10px] grid place-items-center w-10 h-10 rounded-full transition-colors hover:bg-white/[0.12]"
            >
              <i className="fa-brands fa-github"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-2xl bg-white/[0.06] backdrop-blur-[10px] grid place-items-center w-10 h-10 rounded-full transition-colors hover:bg-white/[0.12]"
            >
              <i className="fa-brands fa-codepen"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-2xl bg-white/[0.06] backdrop-blur-[10px] grid place-items-center w-10 h-10 rounded-full transition-colors hover:bg-white/[0.12]"
            >
              <i className="fa-brands fa-dribbble"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-2xl bg-white/[0.06] backdrop-blur-[10px] grid place-items-center w-10 h-10 rounded-full transition-colors hover:bg-white/[0.12]"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
        </ul>
        
        {/* Links de navegação */}
        <ul className="flex list-none p-0 m-0 gap-[14px]">
          <li>
            <a href="#" className="text-[#d6dfed] hover:text-white transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-[#d6dfed] hover:text-white transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-[#d6dfed] hover:text-white transition-colors">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#" className="text-[#d6dfed] hover:text-white transition-colors">
              Skills
            </a>
          </li>
          <li>
            <a href="#" className="text-[#d6dfed] hover:text-white transition-colors">
              Contact
            </a>
          </li>
        </ul>
        
        {/* Copyright */}
        <p className="text-xs m-0 text-[#a2b6e1]">© 2025 All rights reserved</p>
      </section>
    </footer>
  );
}
