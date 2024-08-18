import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/models/interfaces";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface EditProfileDialogProps {
  authUser: User;
}

const EditProfileDialog = ({ authUser }: EditProfileDialogProps) => {
  const queryClinet = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname || "",
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [authUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  const { mutateAsync: updateProfile, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/user/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "something went wrong");
        }
        return data;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "Unknown error occurred";

        toast({
          variant: "destructive",
          title: `${errorMessage}`,
        });
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClinet.invalidateQueries({ queryKey: ["authUser"] }),
        queryClinet.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
      toast({
        title: "User updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"secondary"} className="rounded-full">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit you profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
            <Input
              name="fullname"
              type="text"
              placeholder="Fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="link"
              type="text"
              placeholder="Link"
              value={formData.link}
              onChange={handleChange}
            />

            <Input
              type="password"
              name="currentPassword"
              placeholder="current password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <Textarea
            name="bio"
            placeholder="bio"
            className="mt-2 max-h-36"
            value={formData.bio}
            onChange={handleChange}
          />
          <Button
            disabled={isLoading}
            className="disabled:opacity-100  mt-3 w-full bg-twitter-blue text-white hover:bg-twitter-blue/90 flex gap-1 items-center"
          >
            <p>{!isLoading ? "Update" : "Updating"}</p>
            {isLoading && (
              <img
                className="w-5"
                src="/loading-icon-white.svg"
                alt="loading"
              />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
