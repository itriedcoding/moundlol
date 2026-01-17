import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Globe, Mail, Code } from "lucide-react";

interface AdvancedSettingsProps {
  profileData: any;
  setProfileData: (data: any) => void;
}

export function AdvancedSettings({ profileData, setProfileData }: AdvancedSettingsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          Advanced Features
        </h2>
        <div className="space-y-6">
          <div className="space-y-4 border border-white/5 p-4 rounded-xl bg-black/20">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" /> SEO Settings
            </h3>
            <div className="grid gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Meta Title</Label>
                <Input 
                  value={profileData.seoTitle}
                  onChange={(e) => setProfileData({ ...profileData, seoTitle: e.target.value })}
                  placeholder="My Awesome Profile"
                  className="mt-1 bg-black/20 border-white/10"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Meta Description</Label>
                <Textarea 
                  value={profileData.seoDescription}
                  onChange={(e) => setProfileData({ ...profileData, seoDescription: e.target.value })}
                  placeholder="Check out my links..."
                  className="mt-1 bg-black/20 border-white/10 h-20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border border-white/5 p-4 rounded-xl bg-black/20">
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4" /> Newsletter
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter">Enable Newsletter Subscription</Label>
              <Switch
                id="newsletter"
                checked={profileData.newsletterActive}
                onCheckedChange={(checked) => setProfileData({ ...profileData, newsletterActive: checked })}
              />
            </div>
            {profileData.newsletterActive && (
              <div className="grid gap-4 pt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Heading</Label>
                  <Input 
                    value={profileData.newsletterHeading}
                    onChange={(e) => setProfileData({ ...profileData, newsletterHeading: e.target.value })}
                    className="mt-1 bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input 
                    value={profileData.newsletterDescription}
                    onChange={(e) => setProfileData({ ...profileData, newsletterDescription: e.target.value })}
                    className="mt-1 bg-black/20 border-white/10"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 border border-white/5 p-4 rounded-xl bg-black/20">
            <h3 className="font-semibold flex items-center gap-2">
              <Code className="w-4 h-4" /> Custom CSS
            </h3>
            <Textarea 
              value={profileData.customCss}
              onChange={(e) => setProfileData({ ...profileData, customCss: e.target.value })}
              placeholder=".profile-card { border: 1px solid red; }"
              className="font-mono text-xs bg-black/20 border-white/10 h-32"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="space-y-1">
              <Label>Social Proof</Label>
              <p className="text-xs text-muted-foreground">Show view counts on your profile</p>
            </div>
            <Switch
              checked={profileData.showSocialProof}
              onCheckedChange={(checked) => setProfileData({ ...profileData, showSocialProof: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="space-y-1">
              <Label>Sensitive Content</Label>
              <p className="text-xs text-muted-foreground">Show 18+ warning before entering</p>
            </div>
            <Switch
              checked={profileData.sensitiveContent}
              onCheckedChange={(checked) => setProfileData({ ...profileData, sensitiveContent: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
