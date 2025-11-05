import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Volume2, VolumeX, Sparkles, Brain, Users, BookOpen, Award } from "lucide-react";
import { getSupabaseData } from "@/lib/supabaseHelpers";

/**
 * Redesigned Hero - Umbraxis style
 * - Uses Supabase content if available (falls back to defaults)
 * - Interactive cursor glow, Lottie accents, video card with mute toggle
 * - Stats pulled from homepageData
 */

type HomepageData = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  bannerImages: string[];
  autoRotate: boolean;
  rotationInterval: number;
  stats: {
    students: { number: string; label: string };
    programs: { number: string; label: string };
    awards: { number: string; label: string };
  };
  fonts: {
    heading: string;
    body: string;
  };
};

const defaultData: HomepageData = {
  heroTitle: "Royal Academy",
  heroSubtitle:
    "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
  heroButtonPrimary: "Apply for Admission",
  heroButtonSecondary: "Discover Our Legacy",
  bannerImages: [],
  autoRotate: true,
  rotationInterval: 5,
  stats: {
    students: { number: "2,500+", label: "Students" },
    programs: { number: "150+", label: "Programs" },
    awards: { number: "25+", label: "Awards" },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
};

const spiralAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Spiral",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle1",
      sr: 1,
      ks: {
        o: { a: 0, k: 80 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120 }] },
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [50, 0] },
              s: { a: 0, k: [20, 20] },
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0.42, 0.33, 1] },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

const Hero: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData>(defaultData);
  const [branding, setBranding] = useState({ schoolName: "Royal Academy", logoUrl: "" });
  const [isMuted, setIsMuted] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", handleMouse);
      return () => window.removeEventListener("mousemove", handleMouse);
    }
  }, []);

  // load homepage content (supabase)
  useEffect(() => {
    getSupabaseData("royal-academy-homepage", defaultData).then((data: any) => {
      if (!data) return;
      setHomepageData({
        ...defaultData,
        heroTitle: data.heroTitle || defaultData.heroTitle,
        heroSubtitle: data.heroSubtitle || defaultData.heroSubtitle,
        heroButtonPrimary: data.heroButtonPrimary || defaultData.heroButtonPrimary,
        heroButtonSecondary: data.heroButtonSecondary || defaultData.heroButtonSecondary,
        bannerImages: Array.isArray(data.bannerImages) ? data.bannerImages : defaultData.bannerImages,
        autoRotate: data.autoRotate ?? defaultData.autoRotate,
        rotationInterval: data.rotationInterval || defaultData.rotationInterval,
        stats: {
          students: data.stats?.students || defaultData.stats.students,
          programs: data.stats?.programs || defaultData.stats.programs,
          awards: data.stats?.awards || defaultData.stats.awards,
        },
        fonts: data.fonts || defaultData.fonts,
      });
    });

    getSupabaseData("royal-academy-branding", { schoolName: "Royal Academy", logoUrl: "" }).then((d: any) => {
      if (!d) return;
      setBranding({ schoolName: d.schoolName || "Royal Academy", logoUrl: d.logoUrl || "" });
    });
  }, []);

  // banner rotate
  useEffect(() => {
    if (homepageData.autoRotate && homepageData.bannerImages.length > 1) {
      const id = setInterval(() => {
        setCurrentImageIndex((p) => (p + 1) % homepageData.bannerImages.length);
      }, Math.max(2000, homepageData.rotationInterval * 1000));
      return () => clearInterval(id);
    }
  }, [homepageData.bannerImages, homepageData.autoRotate, homepageData.rotationInterval]);

  const currentBanner =
    homepageData.bannerImages && homepageData.bannerImages.length
      ? homepageData.bannerImages[currentImageIndex]
      : branding.logoUrl || "/placeholder.svg";

  const stats = [
    { icon: Users, value: homepageData.stats.students.number, label: homepageData.stats.students.label },
    { icon: BookOpen, value: homepageData.stats.programs.number, label: homepageData.stats.programs.label },
    { icon: Award, value: homepageData.stats.awards.number, label: homepageData.stats.awards.label },
  ];

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted((s) => !s);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      {/* Cursor glow */}
      <div
        className="fixed w-96 h-96 rounded-full bg-primary/6 blur-3xl pointer-events-none transition-all duration-300 ease-out -z-10"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />

      {/* Subtle Lottie accents */}
      <div className="absolute top-24 left-12 w-40 h-40 opacity-30 pointer-events-none animate-pulse">
        <Lottie animationData={spiralAnimation} loop />
      </div>
      <div className="absolute bottom-24 right-20 w-48 h-48 opacity-20 pointer-events-none">
        <Lottie animationData={spiralAnimation} loop />
      </div>

      {/* Background banner + dim */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${currentBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline */}
          <div className="space-y-8">
            <Badge variant="orange" className="gap-2">
              <Sparkles className="w-4 h-4" />
              {branding.schoolName}
            </Badge>

            <div className="space-y-6">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white"
                style={{ fontFamily: homepageData.fonts.heading }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  {homepageData.heroTitle.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="block mt-2">{homepageData.heroTitle.split(" ").slice(2).join(" ")}</span>
              </h1>

              <p
                className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed"
                style={{ fontFamily: homepageData.fonts.body }}
              >
                {homepageData.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admissions" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-8 py-4 rounded-full bg-primary hover:bg-primary/90 shadow-lg">
                  {homepageData.heroButtonPrimary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full px-8 py-4 rounded-full">
                  {homepageData.heroButtonSecondary}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {stats.map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white/6 backdrop-blur-md border border-white/6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <s.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                      <div className="text-sm text-white/80">{s.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video + AI CTA card */}
          <div className="relative space-y-6">
            <Link to="/diagnostic-quiz">
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 hover:scale-[1.02] transition-transform shadow-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-xl">
                    <Brain className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xl font-bold text-white">Take Free AI Quiz</div>
                    <div className="text-sm text-white/80">Know your level in 5 minutes</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary">AI-Powered</Badge>
                  <Badge variant="secondary">Personalized Roadmap</Badge>
                </div>
              </div>
            </Link>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                src="/videos/tution-intro.mp4"
              />

              <div className="absolute bottom-6 right-6 flex gap-3">
                <Button
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full w-12 h-12 bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
            </div>

            <div className="absolute -top-4 -left-4 animate-bounce">
              <Badge className="bg-primary text-primary-foreground px-4 py-2 shadow-xl">Learn Smarter. Achieve Faster.</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/6 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
