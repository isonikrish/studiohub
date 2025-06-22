import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-lora text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Book Professional Studios
            <span className="text-blue-600"> with Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with professional photographers and book stunning studio spaces for your next photoshoot. From
            portraits to product photography, find the perfect space for your creative vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="btn-primary text-lg px-8 py-3">
                Browse Packages
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Join as Photographer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
