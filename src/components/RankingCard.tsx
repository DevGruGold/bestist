
import { FC } from 'react';
import { ThumbsUp } from 'lucide-react';

interface RankingItem {
  id: number;
  name: string;
  votes: number;
}

interface RankingCardProps {
  item: RankingItem;
  onVote: () => void;
}

export const RankingCard: FC<RankingCardProps> = ({ item, onVote }) => {
  return (
    <div className="glass-card p-6 animate-hover">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <span className="text-sm text-gray-600">{item.votes} votes</span>
      </div>
      <button 
        onClick={onVote}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <ThumbsUp className="w-4 h-4" />
        Vote
      </button>
    </div>
  );
};
