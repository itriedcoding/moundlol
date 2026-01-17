import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings, Upload } from "lucide-react";
import { RefObject } from "react";

interface GeneralSettingsProps {
  profileData: any;
  setProfileData: (data: any) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'pfp' | 'bg') => void;
  isUploading: boolean;
}

export function GeneralSettings({ 
  profileData, 
  setProfileData, 
  fileInputRef, 
  handleFileUpload, 
  isUploading 
}: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          Basic Info
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-muted-foreground">Display Name</Label>
            <Input
              id="title"
              value={profileData.title}
              onChange={(e) =>
                setProfileData({ ...profileData, title: e.target.value })
              }
              placeholder="Your Name"
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              placeholder="Tell people about yourself..."
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50 min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="pfp" className="text-muted-foreground">Profile Picture</Label>
            <div className="flex gap-4 mt-2 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  id="pfp"
                  value={profileData.profilePicture}
                  onChange={(e) =>
                    setProfileData({ ...profileData, profilePicture: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-black/20 border-white/10 focus:border-primary/50"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'pfp')}
                  />
                </div>
              </div>
              {profileData.profilePicture && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 ring-2 ring-primary/20">
                  <img src={profileData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}