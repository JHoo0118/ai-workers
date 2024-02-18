import Link from "next/link";

const Logo = () => {
  return (
    <Link className="w-[20rem]" href="/" aria-label="Home">
      <h1 className="text-3xl font-bold">AI Workers</h1>
    </Link>
  );
};

export default Logo;
