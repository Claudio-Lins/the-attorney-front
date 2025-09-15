import ImageBackground from "@/public/img-unsplash/img-01.jpg";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" >
      <Image src={ImageBackground} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      {children}
    </div>
  );
}