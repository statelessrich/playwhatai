// imports
import Link from "next/link";

// nextjs app header function component
export default function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto flex justify-end h-full px-4 md:px-20">
        <nav>
          <ul className="flex text-gray-600 ml-auto h-full">
            <li className="ml-6 flex items-center">
              <Link href="/" className="h-full flex items-center">
                <span className="hover:text-gray-800">Home</span>
              </Link>
            </li>
            <li className="ml-6 flex items-center">
              <Link href="/about" className="h-full flex items-center">
                <span className="hover:text-gray-800">About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}