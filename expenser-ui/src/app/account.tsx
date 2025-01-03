// use this to switch between setting different account details: https://ui.shadcn.com/docs/components/tabs

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { useUser } from "@/providers/user-provider";
import { useState } from "react";

interface AccountPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
}

export default function AccountPage({
  open,
  setOpen,
  name,
  setName,
}: AccountPageProps) {
  const { username } = useUser();
  const [accountName, setAccountName] = useState(name);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    apiRequest("/cxf/user", "PUT", {
      name: accountName,
    })
      .then(async (res: Response) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        localStorage.setItem("name", accountName);
        setOpen(false);
        setName(accountName);
        showToast("Account Updated", "Account updated successfully.");
      })
      .catch((error: Error) =>
        showToast("Account Update Failed", error.message, "destructive"),
      );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
