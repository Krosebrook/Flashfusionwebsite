import { useRef } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Image, Video } from 'lucide-react';
import { CONTENT_TONES, TARGET_AUDIENCES } from '../../constants/creator-content-pipeline';

interface ContentInputSectionProps {
  inputContent: string;
  setInputContent: (content: string) => void;
  scheduleEnabled: boolean;
  setScheduleEnabled: (enabled: boolean) => void;
  autoPosting: boolean;
  setAutoPosting: (enabled: boolean) => void;
}

export function ContentInputSection({
  inputContent,
  setInputContent,
  scheduleEnabled,
  setScheduleEnabled,
  autoPosting,
  setAutoPosting
}: ContentInputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6"
    >
      <Card className="p-6">
        <h3 className="mb-4">Content Input</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="content-input">Enter your base content</Label>
            <Textarea
              id="content-input"
              placeholder="Enter your original content, idea, or topic that you want to transform into multiple formats..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              rows={6}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{inputContent.length} characters</span>
              <span>{inputContent.trim().split(' ').length} words</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Upload Media
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Import from URL
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Content Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="tone">Content Tone</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TONES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target-audience">Target Audience</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_AUDIENCES.map((audience) => (
                  <SelectItem key={audience.value} value={audience.value}>
                    {audience.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="seo-optimize"
              checked={scheduleEnabled}
              onCheckedChange={setScheduleEnabled}
            />
            <Label htmlFor="seo-optimize">SEO Optimization</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-posting"
              checked={autoPosting}
              onCheckedChange={setAutoPosting}
            />
            <Label htmlFor="auto-posting">Auto-Posting (Zapier)</Label>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}