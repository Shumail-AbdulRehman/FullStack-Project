import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Mail,
  UserCircle,
  Image as ImageIcon,
  Lock,
  Camera,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import SideBar from '@/components/custom/SideBar';

import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

export default function SettingsPage() {
  //   const userData = useSelector((state) => state.auth.userData);

  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);

  const { data: getCurrentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/current-user`,
        { withCredentials: true }
      );
      setUserData(res.data.data);
      return res.data.data;
    },
  });

  console.log('userdata from redux is :::', userData);
  const [openDialog, setOpenDialog] = useState(null);

  const fullNameForm = useForm({
    defaultValues: { fullName: userData?.fullName || '' },
  });
  const emailForm = useForm({
    defaultValues: { email: userData?.email || '' },
  });
  const usernameForm = useForm({
    defaultValues: { username: userData?.username || '' },
  });
  const passwordForm = useForm({
    defaultValues: { old: '', new: '', confirm: '' },
  });
  const avatarForm = useForm();
  const coverForm = useForm();

  //   update-fullname

  const { mutate: updateFullname } = useMutation({
    mutationFn: async (data) => {
      console.log('data in username is ::', data);
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-fullname`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      console.log('response is ::', res);
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => {
      alert(err.response.data.message);
      console.log('error while password is ::', err);
    },
  });

  const handleFullNameSave = (data) => {
    console.log('Full Name submitted:', data.fullName);
    updateFullname(data);
    setOpenDialog(null);
  };

  const { mutate: updateEmail, isPending: emailPending } = useMutation({
    mutationFn: async (data) => {
      console.log('data in username is ::', data);
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-email`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      console.log('response is ::', res);
      alert(res.message);
      // userData=res.data;
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => {
      alert(err.response.data.message);
      console.log('error while password is ::', err);
    },
  });

  const handleEmailSave = (data) => {
    console.log('Email submitted:', data.email);
    updateEmail(data);
    setOpenDialog(null);
  };

  const { mutate: updateUsername, isPending: usernamePending } = useMutation({
    mutationFn: async (data) => {
      console.log('data in username is ::', data);
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-username`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      console.log('response is ::', res);
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);

      // userData=res.data;
    },
    onError: (err) => {
      alert(err.response.data.message);
      console.log('error while password is ::', err);
    },
  });

  const handleUsernameSave = (data) => {
    console.log('Username submitted:', data.username);
    updateUsername(data);
    setOpenDialog(null);
  };

  // update-username
  const { mutate: changeUserPassword, isPending: passwordPending } =
    useMutation({
      mutationFn: async (data) => {
        const res = await axios.patch(
          `http://localhost:8000/api/v1/users/change-password`,
          { oldPassword: data.old, newPassword: data.new },
          { withCredentials: true }
        );

        return res.data;
      },
      onSuccess: (res) => {
        console.log('response is ::', res);
        alert(res.message);
        queryClient.invalidateQueries(['currentUser']);
      },
      onError: (err) => {
        alert(err.response.data.message);
        console.log('error while password is ::', err);
      },
    });

  const handlePasswordUpdate = (data) => {
    if (data.new !== data.confirm) {
      alert('New password and confirm password must match!');
      return;
    }

    console.log('Passwords submitted:', data);
    changeUserPassword(data);

    setOpenDialog(null);
  };

  const { mutate: updateAvatar, isPending: avatarPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-avatar`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      console.log('response is ::', res);
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => {
      alert(err.response.data.message);
      console.log('error while password is ::', err);
    },
  });

  const handleAvatarUpload = (data) => {
    console.log('Avatar file:', data.avatar[0]);

    const file = data.avatar[0];

    const formData = new FormData();
    formData.append('avatar', file);
    updateAvatar(formData);
    setOpenDialog(null);
  };

  //   const res=await axios.patch(`http://localhost:8000/api/v1/users/change-password`,{oldPassword:data.old,newPassword:data.new},{withCredentials:true});
  const { mutate: updateCoverImage, isPending: coverImagePending } =
    useMutation({
      mutationFn: async (data) => {
        const res = await axios.patch(
          `http://localhost:8000/api/v1/users/update-cover-image`,
          data,
          { withCredentials: true }
        );

        return res.data;
      },
      onSuccess: (res) => {
        console.log('response is ::', res);
        alert(res.message);
        queryClient.invalidateQueries(['currentUser']);
      },
      onError: (err) => {
        alert(err.response.data.message);
        console.log('error while password is ::', err);
      },
    });

  const handleCoverUpload = (data) => {
    console.log('Cover file:', data.cover[0]);

    const file = data.cover[0];
    const formData = new FormData();
    formData.append('coverImage', file);

    updateCoverImage(formData);
    setOpenDialog(null);
  };

  if (emailPending || usernamePending || avatarPending || coverImagePending) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex bg-zinc-950 min-h-screen text-white">
      <div className="hidden md:block w-60 ">
        <SideBar />
      </div>

      <div className="flex-1 px-6 md:px-10 py-10 space-y-14 bg-zinc-950">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Account Settings
        </h1>

        <section>
          <h2 className="text-2xl font-bold text-gray-200">
            Personal Information
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Manage your basic account details.
          </p>

          <div className="space-y-6">
            <div className="setting-item flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <User className="icon" />
                <div>
                  <p className="setting-label">Full Name</p>
                  <p className="setting-value">{userData?.fullName}</p>
                </div>
              </div>
              <Button onClick={() => setOpenDialog('fullName')}>Edit</Button>
            </div>

            <div className="setting-item flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Mail className="icon" />
                <div>
                  <p className="setting-label">Email</p>
                  <p className="setting-value">{userData?.email}</p>
                </div>
              </div>
              <Button onClick={() => setOpenDialog('email')}>Edit</Button>
            </div>

            <div className="setting-item flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <UserCircle className="icon" />
                <div>
                  <p className="setting-label">Username</p>
                  <p className="setting-value">{userData?.username}</p>
                </div>
              </div>
              <Button onClick={() => setOpenDialog('username')}>Edit</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-200">
            Channel Information
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Customize your public channel appearance.
          </p>

          <div className="space-y-6">
            <div className="setting-item flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Camera className="icon" />
                <div>
                  <p className="setting-label">Avatar</p>
                  <img
                    src={userData?.avatar}
                    className="w-16 h-16 rounded-full object-cover border border-gray-700 mt-2 shadow-lg"
                  />
                </div>
              </div>
              <Button onClick={() => setOpenDialog('avatar')}>Edit</Button>
            </div>

            <div className="setting-item flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <ImageIcon className="icon" />
                <div>
                  <p className="setting-label">Cover Image</p>
                  <img
                    src={userData?.coverImage}
                    className="w-60 h-28 rounded-lg object-cover border border-gray-700 mt-2 shadow-lg"
                  />
                </div>
              </div>
              <Button onClick={() => setOpenDialog('cover')}>Edit</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-200">Security</h2>
          <p className="text-gray-500 text-sm mb-6">
            Manage login and password settings.
          </p>

          <div className="setting-item flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Lock className="icon" />
              <div>
                <p className="setting-label">Password</p>
                <p className="setting-value">********</p>
              </div>
            </div>
            <Button onClick={() => setOpenDialog('password')}>Edit</Button>
          </div>
        </section>

        <Dialog
          open={openDialog === 'fullName'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                Change Full Name
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={fullNameForm.handleSubmit(handleFullNameSave)}>
              <Label>New Full Name</Label>
              <Input
                {...fullNameForm.register('fullName', {
                  required: 'Full Name is required',
                  validate: (value) =>
                    value !== userData?.fullName || 'Please enter a new value',
                })}
              />
              {fullNameForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {fullNameForm.formState.errors.fullName.message}
                </p>
              )}
              <Button type="submit" className="dialog-btn mt-4">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === 'email'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">Change Email</DialogTitle>
            </DialogHeader>
            <form onSubmit={emailForm.handleSubmit(handleEmailSave)}>
              <Label>New Email</Label>
              <Input
                type="email"
                {...emailForm.register('email', {
                  required: 'Email is required',
                  validate: (value) =>
                    value !== userData?.email || 'Please enter a new email',
                })}
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
              <Button type="submit" className="dialog-btn mt-4">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === 'username'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                Change Username
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={usernameForm.handleSubmit(handleUsernameSave)}>
              <Label>New Username</Label>
              <Input
                {...usernameForm.register('username', {
                  required: 'Username is required',
                  validate: (value) =>
                    value !== userData?.username ||
                    'Please enter a new username',
                })}
              />
              {usernameForm.formState.errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {usernameForm.formState.errors.username.message}
                </p>
              )}
              <Button type="submit" className="dialog-btn mt-4">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === 'avatar'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">Update Avatar</DialogTitle>
            </DialogHeader>
            <form onSubmit={avatarForm.handleSubmit(handleAvatarUpload)}>
              <Input
                type="file"
                accept="image/*"
                {...avatarForm.register('avatar', {
                  required: 'Avatar is required',
                })}
              />
              {avatarForm.formState.errors.avatar && (
                <p className="text-red-500 text-sm mt-1">
                  {avatarForm.formState.errors.avatar.message}
                </p>
              )}
              <Button type="submit" className="dialog-btn mt-4">
                Upload
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === 'cover'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                Update Cover Image
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={coverForm.handleSubmit(handleCoverUpload)}>
              <Input
                type="file"
                accept="image/*"
                {...coverForm.register('cover', {
                  required: 'Cover Image is required',
                })}
              />
              {coverForm.formState.errors.cover && (
                <p className="text-red-500 text-sm mt-1">
                  {coverForm.formState.errors.cover.message}
                </p>
              )}
              <Button type="submit" className="dialog-btn mt-4">
                Upload
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === 'password'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <DialogContent className="dialog-box">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                Change Password
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
              <Label>Old Password</Label>
              <Input
                type="password"
                {...passwordForm.register('old', {
                  required: 'Old password is required',
                })}
              />
              {passwordForm.formState.errors.old && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.old.message}
                </p>
              )}

              <Label className="mt-4">New Password</Label>
              <Input
                type="password"
                {...passwordForm.register('new', {
                  required: 'New password is required',
                })}
              />
              {passwordForm.formState.errors.new && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.new.message}
                </p>
              )}

              <Label className="mt-4">Confirm Password</Label>
              <Input
                type="password"
                {...passwordForm.register('confirm', {
                  required: 'Confirm password is required',
                })}
              />
              {passwordForm.formState.errors.confirm && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.confirm.message}
                </p>
              )}

              <Button type="submit" className="dialog-btn mt-4">
                Update Password
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
