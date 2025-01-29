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
import { useUpdateUserMutation } from "@/hooks/use-user-query";
import { generateAvatarName } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";

interface AccountPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  username: string;
  profileImage: string;
}

export default function AccountPage({
  open,
  setOpen,
  name,
  username,
  profileImage,
}: AccountPageProps) {
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

  const editAccountMutation = useUpdateUserMutation();

  const onClick = () => {
    editAccountMutation.mutate(
      { name: accountName, image: avatarSrc },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
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
          <Button onClick={onClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
