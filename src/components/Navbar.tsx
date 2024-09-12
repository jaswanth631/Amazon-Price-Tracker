import Image from "next/image";
import Link from "next/link"; // Import the User Icon from heroicons

const navIcons = [
  // { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/user.svg", alt: "user" },
  // { src: "/assets/icons/user.svg", alt: "user" },
];

const Navbar = () => {
  return (
    <header className="w-full py-4">
      {" "}
      {/* Added padding to the top and bottom */}
      <nav className="nav flex items-center justify-between">
        <Image src="/assets/icons/logo.svg" width={27} height={27} alt="logo" />
        <p className="nav-logo">
          Smart<span className="text-primary">Shopper</span>
        </p>

        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Link href="/sign-up" className="flex items-center gap-1">
              <Image
                src={icon.src}
                alt={icon.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
