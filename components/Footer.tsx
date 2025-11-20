import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="footer mx-auto my-12 max-w-[90%] py-16 text-center lg:max-w-[50%]">
      <h2 className="mb-4 text-4xl">😊</h2>
      <h1 className="mb-4 font-serif text-4xl text-white md:text-6xl">thanks so much</h1>
      <p className="mb-12 text-lg text-white/90">
        And if you&apos;re in the market for design help, please don&apos;t hesitate to{' '}
        <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="font-bold text-[#39d5cb] hover:text-[#e4416f] transition-colors">
          hit me up!
        </a>
      </p>
      <ul className="contact mt-12 flex flex-wrap justify-center border-t-2 border-white/10 py-8">
        <li className="p-4">
          <a href="https://www.linkedin.com/in/dkells/" className="group flex flex-col items-center">
            <Image src="/imgs/contact/linkedin.svg" alt="linkedin" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">dkells</p>
          </a>
        </li>
        <li className="p-4">
          <a href="https://twitter.com/kid4stro" className="group flex flex-col items-center">
            <Image src="/imgs/contact/twitter.svg" alt="twitter" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">kid4stro</p>
          </a>
        </li>
        <li className="p-4">
          <a href="https://instagram.com/kid4stro" className="group flex flex-col items-center">
            <Image src="/imgs/contact/ig.svg" alt="instagram" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">kid4stro</p>
          </a>
        </li>
        <li className="p-4">
          <a href="https://dribbble.com/kidastro" className="group flex flex-col items-center">
            <Image src="/imgs/contact/dribbble.svg" alt="dribbble" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">kidastro</p>
          </a>
        </li>
        <li className="p-4">
          <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="group flex flex-col items-center">
            <Image src="/imgs/contact/email.svg" alt="email" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">email</p>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
