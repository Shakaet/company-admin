import { useEffect, useState } from "react";
import {
  useCreateBlog,
  useDeleteBlog,
  useGetBlogsForAdmin,
  useGetBlogCategories,
  useUpdateBlog,
} from "@/api/blog/blog.api";
import type { IBlogPost } from "@/api/blog/blog.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/custom/header";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import SearchInput from "@/components/custom/search-input";
import Pagination from "@/components/custom/pagination";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import useSerial from "@/helper/use-serial";
import { Edit2 } from "lucide-react";
import { useTiptapEditor, TiptapEditor } from "@/components/editor/tip-tap/tip-tap";
import type { Editor } from "@tiptap/react";
import FileUpload from "@/components/custom/file-upload";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FolderOpen } from "lucide-react";
import BlogCategoriesTab from "./blog-categories-tab";

function BlogPostsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<IBlogPost>();
  const { data, isLoading } = useGetBlogsForAdmin({
    page,
    limit: 10,
    searchTerm: search,
  });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteBlog } = useDeleteBlog();
  const serial = useSerial(page, 10);
  const items = data?.data ?? [];
  const total = data?.totalData ?? 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4 pt-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <SearchInput placeholder="Search blog posts..." onSearch={(value) => {
            setPage(1);
            setSearch(value);
          }} />
          {can("blog_create") && (
            <CreateButton label="Add Blog Post" onClick={() => setCreateOpen(true)} />
          )}
        </div>

        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
          <div className="overflow-x-auto">
            {isLoading ? (
              <TableSkeleton columns={6} rows={5} />
            ) : !items.length ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground">No blog posts found</p>
                  <p className="mt-1 text-sm text-muted-foreground/70">Add a blog post to get started</p>
                </div>
              </div>
            ) : (
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-16 text-center font-semibold">#</TableHead>
                    <TableHead className="font-semibold">Post</TableHead>
                    <TableHead className="text-center font-semibold">Category</TableHead>
                    <TableHead className="text-center font-semibold">Featured</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-center font-semibold">Created</TableHead>
                    {(can("blog_update") || can("blog_delete")) && (
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item._id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30">
                      <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                      <TableCell>
                        <p className="font-medium">{item.title}</p>
                        <p className="max-w-md truncate text-xs text-muted-foreground">{item.slug}</p>
                      </TableCell>
                      <TableCell className="text-center"><Badge variant="outline">{typeof item.category === "string" ? item.category : item.category?.name}</Badge></TableCell>
                      <TableCell className="text-center">{item.featured ? <Badge>Yes</Badge> : <span className="text-muted-foreground">No</span>}</TableCell>
                      <TableCell className="text-center"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                      <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt || "")}</TableCell>
                      {(can("blog_update") || can("blog_delete")) && (
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {can("blog_update") && (
                              <Button size="icon" variant="outline" onClick={() => { setSelected(item); setUpdateOpen(true); }}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            {can("blog_delete") && (
                              <DeleteButton
                                title="Delete Blog Post"
                                description="This blog post will be permanently deleted."
                                onDelete={async () => { if (item._id) await deleteBlog(item._id); }}
                              />
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        <Pagination page={page} setPage={setPage} limit={10} setLimit={() => {}} total={total} />
      </div>

      {createOpen && <BlogFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && selected && <BlogFormModal open={updateOpen} onClose={setUpdateOpen} item={selected} />}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <Header title="Blog Management" description="Manage blog posts and categories" />
      <Tabs defaultValue="posts">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Blog Posts
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" /> Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts"><BlogPostsTab /></TabsContent>
        <TabsContent value="categories"><BlogCategoriesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

const BlogFormModal = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  item?: IBlogPost;
}) => {
  const { mutateAsync: create, isPending: creating } = useCreateBlog();
  const { mutateAsync: update, isPending: updating } = useUpdateBlog();
  const { data: categoriesData } = useGetBlogCategories();
  const categories = categoriesData?.data || [];
  const [form, setForm] = useState<Partial<IBlogPost>>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "",
    authorBio: "",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    readTime: 5,
    featured: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const editor = useTiptapEditor({
    content: form.content,
    placeholder: "Write the complete blog article...",
    onUpdate: ({ editor: currentEditor }: { editor: Editor }) =>
      setForm((current) => ({ ...current, content: currentEditor.getHTML() })),
  });

  useEffect(() => {
    if (item) {
      setForm({
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        authorBio: item.authorBio || "",
        date: item.date,
        category: typeof item.category === "string" ? item.category : item.category?._id,
        readTime: item.readTime || 5,
        featured: item.featured || false,
        status: item.status,
      });
      setCoverPreview(item.cover || "");
      editor?.commands.setContent(item.content || "");
    }
  }, [item, editor]);

  const setField = <K extends keyof IBlogPost>(key: K, value: IBlogPost[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.content?.replace(/<[^>]+>/g, "").trim()) return;
    const formData = new FormData();
    const payload = { ...form };
    payload.slug = (form.title || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    delete payload.cover;
    if (!item?._id) delete payload.status;
    formData.append("data", JSON.stringify(payload));
    if (coverFile) formData.append("cover", coverFile);
    if (item?._id) await update({ id: item._id, payload: formData });
    else await create(formData);
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Blog Post" : "Add Blog Post"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title" value={form.title} onChange={(value) => setField("title", value)} required />
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={typeof form.category === "string" ? form.category : form.category?._id}
                onValueChange={(value) => setField("category", value)}
                required
              >
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id || ""}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field label="Author" value={form.author} onChange={(value) => setField("author", value)} required />
            <Field label="Author Bio" value={form.authorBio} onChange={(value) => setField("authorBio", value)} />
            <div className="space-y-2">
              <Label>Published Date</Label>
              <DatePicker value={form.date || ""} onChange={(value) => setField("date", value)} />
            </div>
            <Field label="Read Time (minutes)" type="number" value={String(form.readTime ?? 5)} onChange={(value) => setField("readTime", Number(value))} min={1} required />
          </div>
          <div className="space-y-2">
            <FileUpload
              label={item ? "Cover Image (Leave empty to keep current)" : "Cover Image *"}
              value={coverFile}
              preview={!coverFile ? coverPreview : undefined}
              onChange={(file) => setCoverFile(file as File)}
            />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt || ""} onChange={(event) => setField("excerpt", event.target.value)} required rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <TiptapEditor editor={editor} minHeight="min-h-[280px]" maxHeight="max-h-[520px]" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {item && (
              <SelectField label="Status" value={form.status || "active"} onChange={(value) => setField("status", value as IBlogPost["status"])} options={["active", "inactive"]} />
            )}
            <SelectField label="Featured" value={form.featured ? "yes" : "no"} onChange={(value) => setField("featured", value === "yes")} options={["yes", "no"]} />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>{creating || updating ? "Saving..." : "Save Blog Post"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, value, onChange, type = "text", required, min }: { label: string; value?: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: number }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input type={type} value={value || ""} min={min} onChange={(event) => onChange(event.target.value)} required={required} />
  </div>
);

const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const DatePicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const selected = value ? parseISO(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}>
          <CalendarDays className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
