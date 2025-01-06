// use this to switch between setting different account details: https://ui.shadcn.com/docs/components/tabs

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { generateAvatarName } from "@/lib/utils";
import { useUser } from "@/providers/user-provider";
import { User } from "@/types/user";
import { ChangeEvent, useRef, useState } from "react";

interface AccountPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  profileImage: string;
  setProfileImage: (profileImage: string) => void;
}

export default function AccountPage({
  open,
  setOpen,
  name,
  setName,
  profileImage,
  setProfileImage,
}: AccountPageProps) {
  const { username } = useUser();
  const [accountName, setAccountName] = useState(name);
  const [avatarSrc, setAvatarSrc] = useState(profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setAvatarSrc(base64);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    apiRequest("/cxf/user", "PUT", {
      name: accountName,
      image: avatarSrc,
    })
      .then(async (res: Response) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        setOpen(false);
        const data: User = await res.json();
        setName(data.name);
        setProfileImage(data.image);
        localStorage.setItem("name", data.name);
        localStorage.setItem("profileImage", data.image);
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
        <div className="flex justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarSrc} alt="User Avatar" />
            <AvatarFallback>{generateAvatarName(name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button onClick={handleButtonClick} variant="outline">
            Upload New Image
          </Button>
        </div>
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
