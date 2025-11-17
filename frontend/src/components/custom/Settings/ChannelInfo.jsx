import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ChannelInfo({ userData }) {
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      username: userData?.username || "",
    },
  });

  const onSubmit = (data) => {
    console.log("FINAL FORM SUBMIT:", data);
    alert("Profile saved!");
  };

  // Submit username only from the dialog
  const handleUsernameChange = (e) => {
    e.preventDefault();
    const newUsername = e.target.newUsername.value;

    // Update the main form's username
    setValue("username", newUsername);

    setUsernameDialogOpen(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Update Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

        {/* USERNAME FIELD (READ-ONLY display + dialog trigger) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>

          <input
            type="text"
            readOnly
            {...register("username")}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
          />

          <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
            <DialogTrigger className="text-blue-600 mt-2 underline text-sm">
              Change Username
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Your Username</DialogTitle>
                <DialogDescription>
                  Enter a new username below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUsernameChange} className="space-y-4 mt-3">
                <input
                  name="newUsername"
                  type="text"
                  placeholder="New username"
                  defaultValue={userData?.username}
                  className="w-full px-3 py-2 border rounded-md"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-md"
                >
                  Save Username
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* AVATAR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar
          </label>

          {userData?.avatar && (
            <img
              src={userData.avatar}
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}

          <input type="file" accept="image/*" {...register("avatar")} />
        </div>

        {/* COVER IMAGE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>

          {userData?.coverImage && (
            <img
              src={userData.coverImage}
              className="w-full h-24 rounded-md object-cover mb-2"
            />
          )}

          <input type="file" accept="image/*" {...register("coverImage")} />
        </div>

        {/* MAIN SAVE BUTTON */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
