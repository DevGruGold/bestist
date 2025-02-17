
import { motion } from "framer-motion";
import { StatCard } from "../components/StatCard";
import { RankingCard } from "../components/RankingCard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Place, Location } from "../types/database";
import { toast } from "sonner";

const Index = () => {
  const [newItemName, setNewItemName] = useState("");
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          await fetchNearbyPlaces(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Showing all places instead.");
          fetchAllPlaces();
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      fetchAllPlaces();
    }
  }, []);

  const fetchNearbyPlaces = async (location: Location) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_nearby_places', {
          latitude: location.lat,
          longitude: location.lng,
          distance_km: 10 // Search within 10km radius
        });

      if (error) throw error;

      const placesWithVotes = await Promise.all(
        data.map(async (place: any) => {
          const { data: rankingData } = await supabase
            .from('rankings')
            .select('votes')
            .eq('place_id', place.id)
            .single();
          
          return {
            ...place,
            votes: rankingData?.votes || 0
          };
        })
      );

      setPlaces(placesWithVotes.sort((a, b) => b.votes - a.votes));
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error('Failed to load nearby places');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlaces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('places')
        .select(`
          id,
          name,
          category,
          address,
          description
        `);

      if (error) throw error;

      const placesWithVotes = await Promise.all(
        data.map(async (place) => {
          const { data: rankingData } = await supabase
            .from('rankings')
            .select('votes')
            .eq('place_id', place.id)
            .single();
          
          return {
            ...place,
            votes: rankingData?.votes || 0
          };
        })
      );

      setPlaces(placesWithVotes.sort((a, b) => b.votes - a.votes));
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !userLocation) return;

    try {
      // Insert new place
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .insert({
          name: newItemName.trim(),
          category: 'General', // You might want to add category selection
          location: `POINT(${userLocation.lng} ${userLocation.lat})`,
          address: 'Nearby' // You might want to add address input
        })
        .select()
        .single();

      if (placeError) throw placeError;

      // Create initial ranking
      const { error: rankingError } = await supabase
        .from('rankings')
        .insert({
          place_id: placeData.id,
          votes: 0
        });

      if (rankingError) throw rankingError;

      // Refresh places
      if (userLocation) {
        await fetchNearbyPlaces(userLocation);
      } else {
        await fetchAllPlaces();
      }

      setNewItemName("");
      toast.success('New place added successfully!');
    } catch (error) {
      console.error('Error adding new place:', error);
      toast.error('Failed to add new place');
    }
  };

  const handleVote = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_votes', {
        place_id: id
      });

      if (error) throw error;

      // Update local state
      setPlaces(places.map(place => 
        place.id === id 
          ? { ...place, votes: place.votes + 1 } 
          : place
      ).sort((a, b) => b.votes - a.votes));

      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    console.log({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      location: userLocation
    });
    
    form.reset();
    toast.success('Thank you for your message! We will get back to you soon.');
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
              {userLocation ? '📍 Using your location' : 'Welcome to The Bestist'}
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              Rank Everything, <br/>Find the Best
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              Join our community in discovering and ranking the best of everything nearby. From coffee shops to hiking trails, help us find what truly stands out.
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
          <h2 className="text-3xl font-bold mb-12 text-center">
            {userLocation ? 'Top Rankings Nearby' : 'Top Rankings'}
          </h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading places...</div>
          ) : places.length === 0 ? (
            <div className="text-center text-gray-600">No places found. Be the first to add one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {places.map((place) => (
                <RankingCard
                  key={place.id}
                  item={{
                    id: place.id,
                    name: place.name,
                    votes: place.votes
                  }}
                  onVote={() => handleVote(place.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number={`${places.length}`} label="Places Ranked" />
            <StatCard number={`${places.reduce((sum, place) => sum + place.votes, 0)}`} label="Total Votes" />
            <StatCard number={userLocation ? "10km" : "∞"} label="Search Radius" />
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
