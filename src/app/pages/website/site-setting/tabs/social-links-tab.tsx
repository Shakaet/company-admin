import {
  useGetSiteSettingAdmin,
  useUpsertSiteSetting,
  type ISocialLink,
} from "@/api/site-setting/site-setting.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Inline SVG icons (lucide-react does not export branded social icons)
const SvgFacebook = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>);
const SvgTwitter = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>);
const SvgLinkedin = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
const SvgWhatsApp = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>);
const SvgInstagram = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>);
const SvgYoutube = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /></svg>);

const PLATFORM_OPTIONS: {
  value: ISocialLink["platform"];
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { value: "facebook",  label: "Facebook",    icon: SvgFacebook,  color: "text-blue-600"  },
  { value: "twitter",   label: "Twitter / X",  icon: SvgTwitter,   color: "text-sky-500"   },
  { value: "linkedin",  label: "LinkedIn",     icon: SvgLinkedin,  color: "text-blue-700"  },
  { value: "whatsapp",  label: "WhatsApp",     icon: SvgWhatsApp,  color: "text-green-500" },
  { value: "instagram", label: "Instagram",    icon: SvgInstagram, color: "text-pink-500"  },
  { value: "youtube",   label: "YouTube",      icon: SvgYoutube,   color: "text-red-500"   },
];

const emptyLink = (): ISocialLink => ({
  platform: "facebook",
  url: "",
  isActive: true,
});

export default function SocialLinksTab() {
  const { data, isLoading } = useGetSiteSettingAdmin();
  const { mutateAsync: upsert, isPending } = useUpsertSiteSetting();
  const { can } = useAdminPermission();

  const setting = data?.data;
  const [links, setLinks] = useState<ISocialLink[]>([emptyLink()]);

  useEffect(() => {
    if (setting?.socialLinks?.length) {
      setLinks(setting.socialLinks);
    }
  }, [setting]);

  const updateLink = (index: number, field: keyof ISocialLink, value: any) => {
    const updated = [...links];
    (updated[index] as any)[field] = value;
    setLinks(updated);
  };

  const addLink = () => setLinks([...links, emptyLink()]);

  const removeLink = (index: number) =>
    setLinks(links.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    const payload = {
      socialLinks: links.filter((l) => l.url.trim()),
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
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_3fr_auto_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-sm font-semibold text-muted-foreground">
          <span>Platform</span>
          <span>URL</span>
          <span className="text-center">Active</span>
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {links.map((link, index) => {
            const opt = PLATFORM_OPTIONS.find((p) => p.value === link.platform);
            const Icon = opt?.icon;
            return (
              <div
                key={index}
                className="grid grid-cols-[2fr_3fr_auto_auto] gap-4 items-center px-5 py-3"
              >
                {/* Platform select */}
                <Select
                  value={link.platform}
                  onValueChange={(val) =>
                    updateLink(index, "platform", val as ISocialLink["platform"])
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className={`w-4 h-4 ${opt?.color}`} />}
                        <span>{opt?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          <p.icon className={`w-4 h-4 ${p.color}`} />
                          <span>{p.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* URL */}
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  placeholder={`https://${link.platform}.com/yourpage`}
                  className="h-9"
                />

                {/* Active toggle */}
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    checked={link.isActive}
                    onCheckedChange={(val) => updateLink(index, "isActive", val)}
                  />
                  <Badge
                    variant={link.isActive ? "default" : "secondary"}
                    className="hidden sm:inline-flex"
                  >
                    {link.isActive ? "Active" : "Off"}
                  </Badge>
                </div>

                {/* Remove */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  disabled={links.length === 1}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Add row */}
        <div className="px-5 py-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="w-4 h-4 mr-2" /> Add Social Link
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {PLATFORM_OPTIONS.map((p) => (
          <div key={p.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Save */}
      {can("site_setting_create") && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="min-w-40">
            {isPending ? "Saving..." : "Save Social Links"}
          </Button>
        </div>
      )}
    </form>
  );
}
