import {
  useCreateOrUpdateFounderMessage,
  useGetFounderMessage,
} from "@/api/about/about.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FileUpload from "@/components/custom/file-upload";
import Header from "@/components/custom/header";
import { Plus, Trash2 } from "lucide-react";

export default function FounderMessagePage() {
  const { data, isLoading } = useGetFounderMessage();
  const { can } = useAdminPermission();
  const { mutateAsync: updateMessage, isPending } =
    useCreateOrUpdateFounderMessage();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    shortDesc: "",
    highlightQuote: "",
    stats: [] as { value: string; label: string }[],
    paragraphs: [] as string[],
    commitments: [] as string[],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        role: data.data.role || "",
        message: data.data.message || "",
        shortDesc: data.data.shortDesc || "",
        highlightQuote: data.data.highlightQuote || "",
        stats: data.data.stats || [],
        paragraphs: data.data.paragraphs || [],
        commitments: data.data.commitments || [],
      });
      setPreviewUrl(data.data.image || "");
      setSelectedFile(null);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (selectedFile instanceof File) {
        fd.append("image", selectedFile);
      }

      const payload = {
        name: formData.name,
        role: formData.role,
        message: formData.message,
        shortDesc: formData.shortDesc,
        highlightQuote: formData.highlightQuote,
        stats: formData.stats.filter((s) => s.value || s.label),
        paragraphs: formData.paragraphs.filter((p) => p.trim() !== ""),
        commitments: formData.commitments.filter((c) => c.trim() !== ""),
      };
      fd.append("data", JSON.stringify(payload));

      await updateMessage(fd);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleStringArrayChange = (
    field: "paragraphs" | "commitments",
    index: number,
    val: string
  ) => {
    const arr = [...formData[field]];
    arr[index] = val;
    setFormData({ ...formData, [field]: arr });
  };
  const addStringArrayItem = (field: "paragraphs" | "commitments") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };
  const removeStringArrayItem = (
    field: "paragraphs" | "commitments",
    index: number
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Header
        title="Founder Message Settings"
        description="Manage the founder's message, vision, and commitments"
      />

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="space-y-2">
              <FileUpload
                label="Founder Image"
                value={selectedFile}
                onChange={(file) => setSelectedFile(file as File)}
                preview={previewUrl}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Founder Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                value={formData.shortDesc}
                onChange={(e) =>
                  setFormData({ ...formData, shortDesc: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Highlight Quote</Label>
              <Textarea
                value={formData.highlightQuote}
                onChange={(e) =>
                  setFormData({ ...formData, highlightQuote: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Direct Message</Label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
              />
            </div>

            {/* Stats section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">Stats</Label>
              {formData.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Value (e.g. 10+)"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(index, "value", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Label (e.g. Years Exp)"
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

            {/* Paragraphs section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">Paragraphs</Label>
              {formData.paragraphs.map((p, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={p}
                    onChange={(e) =>
                      handleStringArrayChange("paragraphs", index, e.target.value)
                    }
                    rows={3}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStringArrayItem("paragraphs", index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addStringArrayItem("paragraphs")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Paragraph
              </Button>
            </div>

            {/* Commitments section */}
            <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
              <Label className="text-base font-semibold">Commitments</Label>
              {formData.commitments.map((c, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={c}
                    onChange={(e) =>
                      handleStringArrayChange(
                        "commitments",
                        index,
                        e.target.value
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStringArrayItem("commitments", index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addStringArrayItem("commitments")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Commitment
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
