
import { motion } from "framer-motion";
import { StatCard } from "../components/StatCard";
import { RankingCard } from "../components/RankingCard";
import { useState } from "react";

const Index = () => {
  const [newItemName, setNewItemName] = useState("");
  const [rankings, setRankings] = useState([
    { id: 1, name: "Coffee Shops", votes: 245 },
    { id: 2, name: "Pizza Places", votes: 189 },
    { id: 3, name: "Hiking Trails", votes: 156 },
  ]);

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
              Welcome to The Bestist
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Rank Everything, <br/>Find the Best
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community in discovering and ranking the best of everything. From coffee shops to hiking trails, help us find what truly stands out.
            </p>
            <form onSubmit={handleAddItem} className="flex flex-wrap gap-4 justify-center mb-8">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="What do you want to rank?"
                className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors min-w-[250px]"
              />
              <button 
                type="submit"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
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
                  placeholder="What would you like to rank?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                ></textarea>
              </div>
              <button className="w-full px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
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
