import { useCreateTeamMember, useDeleteTeamMember, useGetTeamMembers, useUpdateTeamMember } from "@/api/about/about.api";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, Code, Link, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "@/components/custom/file-upload";

export default function OurTeamPage() {
  const { data, isLoading } = useGetTeamMembers();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteTeamMember();

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-slate-800">Our Team</h2>
        {can("about_create") && (
          <CreateButton label="Add Team Member" onClick={() => setCreateModalOpen(true)} />
        )}
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Member</TableHead>
              <TableHead className="font-semibold text-center">Socials</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Created At</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <TableSkeleton rows={3} columns={5} />
                </TableCell>
              </TableRow>
            ) : !data?.data?.data || data.data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No team members found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={item.image} />
                        <AvatarFallback>{item.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      {item.socialLinks?.linkedin && <Link className="w-4 h-4" />}
                      {item.socialLinks?.twitter && <MessageCircle className="w-4 h-4" />}
                      {item.socialLinks?.github && <Code className="w-4 h-4" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={item.status === "active"} disabled />
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{DateFormat(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {can("about_create") && (
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      {can("about_create") && (
                        <DeleteButton
                          onClick={() => handleDelete(item._id)}
                          isPending={isDeleting}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TeamMemberCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <TeamMemberUpdateModal open={updateModalOpen} onClose={setUpdateModalOpen} item={selectedItem} />
    </div>
  );
}

const TeamMemberCreateModal = ({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) => {
  const { mutateAsync: createItem, isPending } = useCreateTeamMember();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    linkedin: "",
    twitter: "",
    github: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload an image");
      return;
    }
    
    try {
      const fd = new FormData();
      fd.append("avatar", selectedFile);
      
      const payload = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
        },
        status: "active",
      };
      
      fd.append("data", JSON.stringify(payload));

      await createItem(fd);
      onClose(false);
      setFormData({ name: "", role: "", bio: "", linkedin: "", twitter: "", github: "" });
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <FileUpload
              label="Avatar Image *"
              value={selectedFile}
              onChange={(file) => setSelectedFile(file as File)}
            />
          </div>
          <div className="space-y-2">
            <Label>Bio / Description</Label>
            <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} required rows={3} />
          </div>
          
          <h4 className="font-semibold text-sm mt-4 mb-2">Social Links (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="URL" />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} placeholder="URL" />
            </div>
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="URL" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Saving..." : "Save Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TeamMemberUpdateModal = ({ open, onClose, item }: { open: boolean; onClose: (open: boolean) => void; item: any }) => {
  const { mutateAsync: updateItem, isPending } = useUpdateTeamMember();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    linkedin: "",
    twitter: "",
    github: "",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        role: item.role,
        bio: item.bio,
        linkedin: item.socialLinks?.linkedin || "",
        twitter: item.socialLinks?.twitter || "",
        github: item.socialLinks?.github || "",
        status: item.status
      });
      setPreviewUrl(item.image || "");
      setSelectedFile(null);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;
    
    try {
      const fd = new FormData();
      if (selectedFile instanceof File) {
        fd.append("avatar", selectedFile);
      }

      const payload = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
        },
        status: formData.status
      };

      fd.append("data", JSON.stringify(payload));

      await updateItem({
        id: item._id,
        payload: fd
      });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <FileUpload
              label="Avatar Image"
              value={selectedFile}
              onChange={(file) => setSelectedFile(file as File)}
              preview={previewUrl}
            />
          </div>
          <div className="space-y-2">
            <Label>Bio / Description</Label>
            <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} required rows={3} />
          </div>
          
          <h4 className="font-semibold text-sm mt-4 mb-2">Social Links (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={formData.status === "active"}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
            />
            <Label>Active Status</Label>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Updating..." : "Update Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
