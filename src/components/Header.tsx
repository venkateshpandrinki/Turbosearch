
import Link from "next/link";

const Header = () => {
  return (
    <div className=" h-[60px] px-4 lg:h-[80px] lg:px-0 ">
      <div className=" py-3 px-3">

       <a href="/">
          <svg fill="currentColor" viewBox="0 0 256 256" role="img" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"><circle cx="128" cy="128" r="128" fill="#222"></circle><circle cx="102" cy="128" r="18" fill="white"></circle><circle cx="154" cy="128" r="18" fill="white"></circle></svg>
          </a>
      </div>
    </div>
  );
};

export default Header;
