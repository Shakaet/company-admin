import { useState } from "react";
import { Search } from "lucide-react";

import { useDeleteContact, useGetContactsForAdmin } from "@/api/contact/contact.api";
import DeleteButton from "@/components/custom/delete-button";
import Header from "@/components/custom/header";
import Pagination from "@/components/custom/pagination";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { useDebounce } from "@/hooks/use-debounce";
import { DateFormat } from "@/hooks/use-date-format";
import useSerial from "@/helper/use-serial";

export default function ContactListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const serial = useSerial(page, limit);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { can } = useAdminPermission();
  const { data, isLoading } = useGetContactsForAdmin({
    page,
    limit,
    searchTerm: debouncedSearch,
  });
  const { mutateAsync: deleteContact } = useDeleteContact();

  const contacts = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-6">
      <Header title="Contact Submissions" description="View messages submitted through the website contact form" />

      <div className="flex w-full max-w-md items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search name, email, company..."
          aria-label="Search contact submissions"
        />
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={8} rows={6} />
          ) : !contacts.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No contact submissions found</p>
                <p className="mt-1 text-sm text-muted-foreground/70">Messages will appear here after visitors submit the contact form</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Inquiry</TableHead>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Budget</TableHead>
                  <TableHead className="font-semibold">Timeline</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                  <TableHead className="text-center font-semibold">Submitted</TableHead>
                  {can("contact_delete") && <TableHead className="text-right font-semibold">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact, index) => (
                  <TableRow key={contact._id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30">
                    <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                        {contact.phone && <p className="text-xs text-muted-foreground">{contact.phone}</p>}
                        {contact.company && <p className="text-xs text-muted-foreground">{contact.company}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{contact.inquiryType}</Badge>
                    </TableCell>
                    <TableCell>{contact.service}</TableCell>
                    <TableCell>{contact.budget}</TableCell>
                    <TableCell>{contact.timeline}</TableCell>
                    <TableCell className="max-w-xs whitespace-normal">
                      <p title={contact.message} className="line-clamp-3 text-sm text-muted-foreground">
                        {contact.message}
                      </p>
                      {contact.requestNda && <Badge className="mt-2" variant="secondary">NDA requested</Badge>}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {contact.createdAt ? DateFormat(contact.createdAt) : "-"}
                    </TableCell>
                    {can("contact_delete") && (
                      <TableCell>
                        <div className="flex justify-end">
                          <DeleteButton
                            title="Delete Contact"
                            description="This contact submission will be permanently deleted."
                            onDelete={() => deleteContact(contact._id).then(() => undefined)}
                          />
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

      <Pagination
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
      />
    </div>
  );
}
