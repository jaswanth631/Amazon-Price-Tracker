"use client";
import Image from "next/image";
import Link from "next/link";

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
          <Link href="/">
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
                e.currentTarget.style.color = "#FFD700";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              Home
            </button>
          </Link>
          <Link href="/deals">
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
                e.currentTarget.style.color = "#FFD700";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              Deals
            </button>
          </Link>
          <Link href="/dashboard">
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
                e.currentTarget.style.color = "#FFD700";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              Dashboard
            </button>
          </Link>
          <Link href="/about">
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
                e.currentTarget.style.color = "#FFD700";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              About
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
