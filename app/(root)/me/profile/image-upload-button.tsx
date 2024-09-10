"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CameraIcon } from "lucide-react";
import supabase from "@/lib/supabase/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/app/(root)/me/profile/profile-action";

interface ImageUploadButtonProps {
  image: string;
}

const ImageUploadButton = ({ image }: ImageUploadButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const session = useSession();

  if (!session) return null;

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setUploading(true);

      const isAvatar = image.split("/").includes("avatars");
      const url = image.split("/").pop();
      let res;
      if (isAvatar) {
        res = await supabase.storage
          .from("images")
          .update(`avatars/${url}`, file);
      } else {
        res = await supabase.storage
          .from("images")
          .upload(`avatars/${uuid()}`, file);
      }
      if (!res) {
        return;
      }
      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(res?.data?.path!);
      await updateProfile(session.data?.user?.id, {
        image: data.publicUrl,
      });
      await session.update();
      setUploading(false);
      toast.success("Avatar updated successfully");
    }
  };

  return (
    <>
      <Button
        variant={uploading ? "destructive" : "outline"}
        disabled={uploading}
        onClick={handleButtonClick}
      >
        <CameraIcon className="mr-2 h-4 w-4" />
        Change Avatar
      </Button>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={uploading}
      />
    </>
  );
};

export default ImageUploadButton;
