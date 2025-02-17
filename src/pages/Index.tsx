
import { motion } from "framer-motion";
import { StatCard } from "../components/StatCard";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 -z-10" />
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium rounded-full bg-secondary text-primary">
              Welcome to Bestist
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Transform Your Digital Presence
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We help ambitious businesses reach their full potential through innovative technology solutions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="98%" label="Client Satisfaction Rate" />
            <StatCard number="250+" label="Projects Completed" />
            <StatCard number="15+" label="Years of Experience" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
            <form className="max-w-lg mx-auto space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                ></textarea>
              </div>
              <button className="w-full px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
