import {
  useCreateOrUpdateCompany,
  useGetCompany,
} from "@/api/about/about.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/custom/header";
import { Plus, Trash2 } from "lucide-react";

export default function OurCompanyPage() {
  const { data, isLoading } = useGetCompany();
  const { can } = useAdminPermission();
  const { mutateAsync: updateCompany, isPending } = useCreateOrUpdateCompany();

  const [formData, setFormData] = useState({
    stats: [] as { value: string; label: string }[],
    story: [] as string[],
    values: [] as { icon: string; title: string; desc: string }[],
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        stats: data.data.stats || [],
        story: data.data.story || [],
        values: data.data.values || [],
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany({
        stats: formData.stats.filter((s) => s.value || s.label),
        story: formData.story.filter((s) => s.trim() !== ""),
        values: formData.values.filter((v) => v.title || v.desc),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Handlers for Stats
  const handleStatChange = (
    index: number,
    field: "value" | "label",
    val: string
  ) => {
    const newStats = [...formData.stats];
    newStats[index][field] = val;
    setFormData({ ...formData, stats: newStats });
  };
  const addStat = () =>
    setFormData({
      ...formData,
      stats: [...formData.stats, { value: "", label: "" }],
    });
  const removeStat = (index: number) =>
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });

  // Handlers for Story (paragraphs)
  const handleStoryChange = (index: number, val: string) => {
    const newStory = [...formData.story];
    newStory[index] = val;
    setFormData({ ...formData, story: newStory });
  };
  const addStory = () =>
    setFormData({ ...formData, story: [...formData.story, ""] });
  const removeStory = (index: number) =>
    setFormData({
      ...formData,
      story: formData.story.filter((_, i) => i !== index),
    });

  // Handlers for Values
  const handleValueChange = (
    index: number,
    field: "icon" | "title" | "desc",
    val: string
  ) => {
    const newValues = [...formData.values];
    newValues[index][field] = val;
    setFormData({ ...formData, values: newValues });
  };
  const addValue = () =>
    setFormData({
      ...formData,
      values: [...formData.values, { icon: "Star", title: "", desc: "" }],
    });
  const removeValue = (index: number) =>
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index),
    });

  return (
    <div className="space-y-6">
      <Header
        title="Our Company Settings"
        description="Manage company statistics, story, and core values"
      />

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Stats section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">Company Stats</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Key metrics or achievements.
              </p>
              {formData.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Value (e.g. 50+)"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(index, "value", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Label (e.g. Awards Won)"
                    value={stat.label}
                    onChange={(e) =>
                      handleStatChange(index, "label", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStat(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStat}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Stat
              </Button>
            </div>

            {/* Story section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">
                Our Story (Paragraphs)
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add paragraphs to describe the company history.
              </p>
              {formData.story.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => handleStoryChange(index, e.target.value)}
                    rows={3}
                    placeholder={`Paragraph ${index + 1}...`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStory(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStory}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Paragraph
              </Button>
            </div>

            {/* Values section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">Core Values</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Define your company's core values.
              </p>
              {formData.values.map((val, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-3 bg-card border border-border rounded-md relative shadow-xs"
                >
                  <div className="w-full pr-8">
                    <Label className="text-xs">Title</Label>
                    <Input
                      placeholder="Value Title"
                      value={val.title}
                      onChange={(e) =>
                        handleValueChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      placeholder="Value description"
                      value={val.desc}
                      onChange={(e) =>
                        handleValueChange(index, "desc", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeValue(index)}
                    className="absolute top-2 right-2 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addValue}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Value
              </Button>
            </div>

            {(can("about_create") || can("about_update")) && (
              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
