// @/components/sections/AwardsSection.tsx
'use client';

import { motion, useInView } from "framer-motion";
import { Award, TrendingUp, Star, Building, Users, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- Hook for Animated Numbers ---
function useCountUp(targetValue: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && startOnView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Ease-out function for smoother landing
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCount(Math.floor(easeOut * targetValue));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(targetValue); // Ensure it hits the exact target
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, targetValue, duration]);

  return { count, ref };
}

// --- Data Configuration ---
const awards = [
  { 
    id: 1, 
    title: "Best Performance", 
    subtitle: "Sales Excellence Award", 
    description: "Recognized for outstanding sales achievement in Q4 2024",
    icon: TrendingUp,
    metric: "Top 1%",
    color: "#005E60"
  },
  { 
    id: 2, 
    title: "Game Changer", 
    subtitle: "Innovation Award 2022", 
    description: "Revolutionary approach to customer service excellence",
    icon: Star,
    metric: "2022",
    color: "#F8C21C"
  },
  { 
    id: 3, 
    title: "Platinum Star", 
    subtitle: "Luxury Segment Leader", 
    description: "Premium property sales excellence recognition",
    icon: Award,
    metric: "Platinum",
    color: "#8B0000"
  },
  { 
    id: 4, 
    title: "Top Performer", 
    subtitle: "Residential Category", 
    description: "Leading residential property consultant 2024",
    icon: Building,
    metric: "#1 Rank",
    color: "#005E60"
  }
];

const stats = [
  { label: "Years of Excellence", value: 15, suffix: "+", icon: Trophy },
  { label: "Awards Won", value: 50, suffix: "+", icon: Award },
  { label: "Happy Clients", value: 5000, suffix: "+", icon: Users },
  { label: "Projects Completed", value: 200, suffix: "+", icon: Building }
];

export default function AwardsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold text-[#005E60] uppercase tracking-widest mb-3">
            Recognition & Awards
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
            Our Brick by Brick Achievements
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Industry recognition that validates our commitment to excellence 
            and customer satisfaction
          </p>
          <div className="w-16 h-0.5 bg-[#F8C21C] mx-auto mt-6"></div>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {awards.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="
                bg-white rounded-xl p-6 h-full
                border border-gray-100 
                hover:border-[#005E60]/30 hover:shadow-lg
                transition-all duration-300
              ">
                
                {/* Icon & Metric */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span 
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${item.color}10`,
                      color: item.color
                    }}
                  >
                    {item.metric}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#005E60] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm font-semibold text-gray-600">
                      {item.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom Border Accent */}
                  <div 
                    className="w-0 group-hover:w-full h-0.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Trust Indicators (Stats) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#F8FAFC] rounded-2xl p-8 md:p-12 border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// --- Helper Component for Stats with Animation ---
function StatCard({ label, value, suffix, icon: Icon, index }: any) {
  const { count, ref } = useCountUp(value, 2500);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center group cursor-default"
    >
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#005E60] transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#005E60] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
      
      <div className="text-4xl md:text-5xl font-bold text-[#005E60] mb-2 font-montserrat">
        {count}{suffix}
      </div>
      
      <div className="text-sm md:text-base font-medium text-gray-600">
        {label}
      </div>
    </motion.div>
  );
}