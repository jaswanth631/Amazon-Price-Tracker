"use client";
import Image from "next/image";
import Link from "next/link";

const navIcons = [{ src: "/assets/icons/user.svg", alt: "User" }];

const Navbar = () => {
  return (
    <header
      style={{
        backgroundColor: "#FBBF24",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="w-full py-2"
    >
      <nav className="nav flex items-center justify-between px-5">
        <Image src="/assets/icons/logo.svg" width={27} height={27} alt="logo" />
        <p className="nav-logo text-2xl font-bold">
          Amazon<span className="text-primary"> Price Alert</span>
        </p>

        <div className="flex items-center gap-5">
          <Link href="#trending-products">
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                transition: "background-color 0.3s, transform 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3B82F6";
                e.currentTarget.style.color = "#FFD700"; // Gold color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white"; // Reset to original color
              }}
              onClick={() => console.log("Trending clicked")}
            >
              Trending
            </button>
          </Link>

          <Link href="#about-us">
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                transition: "background-color 0.3s, transform 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3B82F6";
                e.currentTarget.style.color = "#FFD700"; // Gold color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white"; // Reset to original color
              }}
              onClick={() => console.log("About Us clicked")}
            >
              About Us
            </button>
          </Link>

          <Link
            href="/amazonPriceAlert/sign-up"
            className="flex items-center gap-1"
          >
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                transition: "background-color 0.3s, transform 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3B82F6";
                e.currentTarget.style.color = "#FFD700"; // Gold color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white"; // Reset to original color
              }}
              onClick={() => console.log("User clicked")}
            >
              User
            </button>
          </Link>

          {navIcons.map((icon) => (
            <Link
              href="/amazonPriceAlert/sign-up"
              key={icon.alt}
              className="flex items-center gap-1"
            >
              {/* Uncomment if you want to show icons */}
              {/* <Image src={icon.src} alt={icon.alt} width={28} height={28} className="object-contain" /> */}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
