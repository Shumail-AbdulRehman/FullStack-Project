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

  Settings,
  Shield,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import SideBar from '@/components/custom/SideBar';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);

  const { data: getCurrentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/v1/users/current-user`,
        { withCredentials: true }
      );
      setUserData(res.data.data);
      return res.data.data;
    },
  });


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


  const { mutate: updateFullname } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-fullname`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleFullNameSave = (data) => {
    updateFullname(data);
    setOpenDialog(null);
  };

  const { mutate: updateEmail, isPending: emailPending } = useMutation({
    mutationFn: async (data) => {

      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-email`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleEmailSave = (data) => {
    updateEmail(data);
    setOpenDialog(null);
  };

  const { mutate: updateUsername, isPending: usernamePending } = useMutation({
    mutationFn: async (data) => {

      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-username`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleUsernameSave = (data) => {
    updateUsername(data);
    setOpenDialog(null);
  };


  const { mutate: changeUserPassword, isPending: passwordPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/change-password`,
        { oldPassword: data.old, newPassword: data.new },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handlePasswordUpdate = (data) => {
    if (data.new !== data.confirm) {
      alert('New password and confirm password must match!');
      return;
    }

    changeUserPassword(data);
    setOpenDialog(null);
  };

  const { mutate: updateAvatar, isPending: avatarPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-avatar`,
        data,
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleAvatarUpload = (data) => {
    const file = data.avatar[0];
    const formData = new FormData();
    formData.append('avatar', file);
    updateAvatar(formData);
    setOpenDialog(null);
  };


  const { mutate: updateCoverImage, isPending: coverImagePending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-cover-image`,
        data,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleCoverUpload = (data) => {
    const file = data.cover[0];
    const formData = new FormData();
    formData.append('coverImage', file);
    updateCoverImage(formData);
    setOpenDialog(null);
  };

  if (emailPending || usernamePending || avatarPending || coverImagePending) {
    return <LoadingSpinner />;
  }


  const SettingItem = ({ icon: Icon, label, value, children, onClick, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 }}
      className="group glass-card rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
            {children || <p className="text-white font-medium">{value}</p>}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-[#050508] text-white">
      <aside className="hidden md:block w-64">
        <SideBar />
      </aside>

      <main className="flex-1 px-4 lg:px-10 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-zinc-400 ml-13">Manage your account and preferences</p>
        </motion.div>

        {/* Personal Information Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-violet-400" />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>

          <div className="space-y-3">
            <SettingItem
              icon={User}
              label="Full Name"
              value={userData?.fullName}
              onClick={() => setOpenDialog('fullName')}
              delay={0}
            />
            <SettingItem
              icon={Mail}
              label="Email"
              value={userData?.email}
              onClick={() => setOpenDialog('email')}
              delay={1}
            />
            <SettingItem
              icon={UserCircle}
              label="Username"
              value={`@${userData?.username}`}
              onClick={() => setOpenDialog('username')}
              delay={2}
            />
          </div>
        </section>

        {/* Channel Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-violet-400" />
            <h2 className="text-lg font-semibold">Channel Appearance</h2>
          </div>

          <div className="space-y-3">
            <SettingItem
              icon={Camera}
              label="Avatar"
              onClick={() => setOpenDialog('avatar')}
              delay={3}
            >
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={userData?.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/30"
                />
                <span className="text-sm text-zinc-400">Click to change</span>
              </div>
            </SettingItem>

            <SettingItem
              icon={ImageIcon}
              label="Cover Image"
              onClick={() => setOpenDialog('cover')}
              delay={4}
            >
              <div className="mt-2">
                <img
                  src={userData?.coverImage}
                  alt="Cover"
                  className="w-48 h-20 rounded-lg object-cover ring-1 ring-white/10"
                />
              </div>
            </SettingItem>
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-violet-400" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="space-y-3">
            <SettingItem
              icon={Lock}
              label="Password"
              value="••••••••"
              onClick={() => setOpenDialog('password')}
              delay={5}
            />
          </div>
        </section>

        {/* Dialogs */}
        <Dialog open={openDialog === 'fullName'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Full Name</DialogTitle>
            </DialogHeader>
            <form onSubmit={fullNameForm.handleSubmit(handleFullNameSave)} className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">New Full Name</Label>
                <Input
                  className="mt-2"
                  {...fullNameForm.register('fullName', { required: 'Required' })}
                />
                {fullNameForm.formState.errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{fullNameForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <Button type="submit" variant="gradient" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openDialog === 'email'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Email</DialogTitle>
            </DialogHeader>
            <form onSubmit={emailForm.handleSubmit(handleEmailSave)} className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">New Email</Label>
                <Input className="mt-2" type="email" {...emailForm.register('email', { required: 'Required' })} />
                {emailForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" variant="gradient" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openDialog === 'username'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Username</DialogTitle>
            </DialogHeader>
            <form onSubmit={usernameForm.handleSubmit(handleUsernameSave)} className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">New Username</Label>
                <Input className="mt-2" {...usernameForm.register('username', { required: 'Required' })} />
                {usernameForm.formState.errors.username && (
                  <p className="text-red-400 text-xs mt-1">{usernameForm.formState.errors.username.message}</p>
                )}
              </div>
              <Button type="submit" variant="gradient" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openDialog === 'avatar'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Avatar</DialogTitle>
            </DialogHeader>
            <form onSubmit={avatarForm.handleSubmit(handleAvatarUpload)} className="space-y-4 mt-4">
              <Input type="file" accept="image/*" {...avatarForm.register('avatar', { required: 'Required' })} />
              {avatarForm.formState.errors.avatar && (
                <p className="text-red-400 text-xs mt-1">{avatarForm.formState.errors.avatar.message}</p>
              )}
              <Button type="submit" variant="gradient" className="w-full">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openDialog === 'cover'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Cover Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={coverForm.handleSubmit(handleCoverUpload)} className="space-y-4 mt-4">
              <Input type="file" accept="image/*" {...coverForm.register('cover', { required: 'Required' })} />
              {coverForm.formState.errors.cover && (
                <p className="text-red-400 text-xs mt-1">{coverForm.formState.errors.cover.message}</p>
              )}
              <Button type="submit" variant="gradient" className="w-full">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openDialog === 'password'} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">Current Password</Label>
                <Input className="mt-2" type="password" {...passwordForm.register('old', { required: 'Required' })} />
              </div>
              <div>
                <Label className="text-zinc-300">New Password</Label>
                <Input className="mt-2" type="password" {...passwordForm.register('new', { required: 'Required' })} />
              </div>
              <div>
                <Label className="text-zinc-300">Confirm Password</Label>
                <Input className="mt-2" type="password" {...passwordForm.register('confirm', { required: 'Required' })} />
              </div>
              <Button type="submit" variant="gradient" className="w-full">Update Password</Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
