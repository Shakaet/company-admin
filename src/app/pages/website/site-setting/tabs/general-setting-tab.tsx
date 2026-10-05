import { useGetSiteSettingAdmin, useUpsertSiteSetting } from "@/api/site-setting/site-setting.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface QuickLink {
  label: string;
  href: string;
}

export default function GeneralSettingTab() {
  const { data, isLoading } = useGetSiteSettingAdmin();
  const { mutateAsync: upsert, isPending } = useUpsertSiteSetting();
  const { can } = useAdminPermission();

  const setting = data?.data;

  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    footerTagline: "",
    copyrightText: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([{ label: "", href: "" }]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form from API data
  useEffect(() => {
    if (setting) {
      setForm({
        companyName: setting.companyName || "",
        tagline: setting.tagline || "",
        email: setting.email || "",
        phone: setting.phone || "",
        whatsappNumber: setting.whatsappNumber || "",
        address: setting.address || "",
        footerTagline: setting.footerTagline || "",
        copyrightText: setting.copyrightText || "",
        metaTitle: setting.metaTitle || "",
        metaDescription: setting.metaDescription || "",
      });
      setQuickLinks(
        setting.footerQuickLinks?.length
          ? setting.footerQuickLinks
          : [{ label: "", href: "" }]
      );
      setLogoPreview(setting.logo || "");
    }
  }, [setting]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleQuickLinkChange = (index: number, field: "label" | "href", value: string) => {
    const updated = [...quickLinks];
    updated[index][field] = value;
    setQuickLinks(updated);
  };

  const addQuickLink = () => setQuickLinks([...quickLinks, { label: "", href: "" }]);
  const removeQuickLink = (index: number) =>
    setQuickLinks(quickLinks.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    // Append logo file if selected
    if (logoFile) fd.append("logo", logoFile);

    // Build JSON payload and send as "data" field (consistent with other modules)
    const payload = {
      ...form,
      footerQuickLinks: quickLinks.filter((l) => l.label.trim() && l.href.trim()),
    };
    fd.append("data", JSON.stringify(payload));

    try {
      await upsert(fd);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Company Identity ─────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold">Company Identity</h3>

        {/* Logo upload */}
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="object-contain w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {logoPreview ? "Change Logo" : "Upload Logo"}
              </Button>
              <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="ITStartup"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Building the future, one app at a time"
            />
          </div>
        </div>
      </div>

      {/* ── Contact Info ─────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hello@itstartup.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone *</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 1700-000000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="8801700000000"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Dhaka, Bangladesh"
            />
          </div>
        </div>
      </div>

      {/* ── Footer Content ────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold">Footer Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Footer Tagline</Label>
            <Input
              value={form.footerTagline}
              onChange={(e) => setForm({ ...form, footerTagline: e.target.value })}
              placeholder="Building digital products that matter."
            />
          </div>
          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Input
              value={form.copyrightText}
              onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
              placeholder="© 2025 ITStartup. All rights reserved."
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <Label>Footer Quick Links</Label>
          {quickLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={link.label}
                onChange={(e) => handleQuickLinkChange(index, "label", e.target.value)}
                placeholder="Label (e.g. About)"
                className="flex-1"
              />
              <Input
                value={link.href}
                onChange={(e) => handleQuickLinkChange(index, "href", e.target.value)}
                placeholder="Href (e.g. /about)"
                className="flex-1"
              />
              {quickLinks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuickLink(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addQuickLink}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        </div>
      </div>

      {/* ── SEO ──────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold">SEO</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              placeholder="ITStartup — Custom Software Development"
            />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              placeholder="We build high-quality web and mobile apps..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      {can("site_setting_create") && (
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      )}
    </form>
  );
}
