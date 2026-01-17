import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Upload } from "lucide-react";
import { RefObject } from "react";

interface AppearanceSettingsProps {
  profileData: any;
  setProfileData: (data: any) => void;
  bgFileInputRef: RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'pfp' | 'bg') => void;
  isUploading: boolean;
}

export function AppearanceSettings({
  profileData,
  setProfileData,
  bgFileInputRef,
  handleFileUpload,
  isUploading
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          Appearance
        </h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Background Type</Label>
              <Select
                value={profileData.backgroundType}
                onValueChange={(value) => setProfileData({ ...profileData, backgroundType: value })}
              >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Button Style</Label>
              <Select
                value={profileData.buttonStyle}
                onValueChange={(value) => setProfileData({ ...profileData, buttonStyle: value })}
              >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                  <SelectItem value="neumorphic">Neumorphic</SelectItem>
                  <SelectItem value="glass">Glassmorphism</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Font Family</Label>
            <Select
                value={profileData.font}
                onValueChange={(value) => setProfileData({ ...profileData, font: value })}
            >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sans">Sans Serif (Inter)</SelectItem>
                    <SelectItem value="serif">Serif (Merriweather)</SelectItem>
                    <SelectItem value="mono">Monospace (JetBrains Mono)</SelectItem>
                    <SelectItem value="display">Display (Oswald)</SelectItem>
                    <SelectItem value="handwriting">Handwriting (Caveat)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-muted-foreground">Animation Effect</Label>
            <Select
                value={profileData.animationEffect}
                onValueChange={(value) => setProfileData({ ...profileData, animationEffect: value })}
            >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="snow">Snow</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="sparkles">Sparkles</SelectItem>
                    <SelectItem value="stars">Stars</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bgValue" className="text-muted-foreground">
              {profileData.backgroundType === "image" ? "Image Source" : "Color / Gradient"}
            </Label>
            <div className="space-y-2 mt-2">
              <Input
                id="bgValue"
                value={profileData.backgroundValue}
                onChange={(e) =>
                  setProfileData({ ...profileData, backgroundValue: e.target.value })
                }
                placeholder={profileData.backgroundType === "image" ? "https://..." : "#000000 or linear-gradient(...)"}
                className="bg-black/20 border-white/10 focus:border-primary/50"
              />
              {profileData.backgroundType === "image" && (
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => bgFileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Background"}
                  </Button>
                  <input 
                    type="file" 
                    ref={bgFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'bg')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}