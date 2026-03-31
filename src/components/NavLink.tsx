import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Calendar, User, Clock, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  title: string;
  preacher: string;
  date: string;
  duration: string;
  series: string;
  image: string;
  videoId?: string;
}

interface SermonPlayerDialogProps {
  sermon: Sermon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SermonPlayerDialog = ({ sermon, open, onOpenChange }: SermonPlayerDialogProps) => {
  const { toast } = useToast();

  if (!sermon) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sermon.title,
        text: `Listen to "${sermon.title}" by ${sermon.preacher}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Sermon link has been copied to clipboard.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{sermon.title}</DialogTitle>
        </DialogHeader>
        
        {/* Video Player */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${sermon.videoId || "dQw4w9WgXcQ"}?autoplay=1`}
            title={sermon.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Sermon Info */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
            {sermon.series}
          </span>

          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{sermon.preacher}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{sermon.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{sermon.duration}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => toast({ title: "Download Started", description: "Your sermon audio is being prepared." })}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Audio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SermonPlayerDialog;
