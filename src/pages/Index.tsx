
import { motion } from "framer-motion";
import { StatCard } from "../components/StatCard";
import { RankingCard } from "../components/RankingCard";
import { useState, useEffect } from "react";

const Index = () => {
  const [newItemName, setNewItemName] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [rankings, setRankings] = useState([
    { id: 1, name: "Coffee Shops", votes: 245 },
    { id: 2, name: "Pizza Places", votes: 189 },
    { id: 3, name: "Hiking Trails", votes: 156 },
  ]);

  useEffect(() => {
    // Get user's location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("Location detected:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      setRankings([...rankings, {
        id: rankings.length + 1,
        name: newItemName.trim(),
        votes: 0
      }]);
      setNewItemName("");
    }
  };

  const handleVote = (id: number) => {
    setRankings(rankings.map(item => 
      item.id === id ? { ...item, votes: item.votes + 1 } : item
    ).sort((a, b) => b.votes - a.votes));
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // In a real app, you would send this to your backend
    console.log({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      location: userLocation // Include user location with the submission
    });
    
    form.reset();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 md:py-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 -z-10" />
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium rounded-full bg-secondary text-primary">
              Welcome to The Bestist
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              Rank Everything, <br/>Find the Best
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              Join our community in discovering and ranking the best of everything. From coffee shops to hiking trails, help us find what truly stands out.
            </p>
            <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4 justify-center mb-8 px-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="What do you want to rank?"
                className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors w-full md:min-w-[250px]"
              />
              <button 
                type="submit"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors w-full md:w-auto"
              >
                Start Ranking
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Top Rankings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rankings.map((item) => (
              <RankingCard
                key={item.id}
                item={item}
                onVote={() => handleVote(item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="10k+" label="Active Rankings" />
            <StatCard number="50k+" label="Community Members" />
            <StatCard number="1M+" label="Votes Cast" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Get Involved</h2>
            <form onSubmit={handleContact} className="max-w-lg mx-auto space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="What would you like to rank?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Suggestion
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
