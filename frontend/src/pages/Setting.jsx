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
<<<<<<< HEAD

=======
>>>>>>> 4d1eafa (impoved frontend UI)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Mail,
  UserCircle,
  Image as ImageIcon,
  Lock,
  Camera,
<<<<<<< HEAD
} from 'lucide-react';
import { useSelector } from 'react-redux';
import SideBar from '@/components/custom/SideBar';

import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

export default function SettingsPage() {
  //   const userData = useSelector((state) => state.auth.userData);

=======
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

export default function SettingsPage() {
>>>>>>> 4d1eafa (impoved frontend UI)
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

<<<<<<< HEAD
  console.log('userdata from redux is :::', userData);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
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

<<<<<<< HEAD
  //   update-fullname

  const { mutate: updateFullname } = useMutation({
    mutationFn: async (data) => {
      console.log('data in username is ::', data);
=======
  const { mutate: updateFullname } = useMutation({
    mutationFn: async (data) => {
>>>>>>> 4d1eafa (impoved frontend UI)
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-fullname`,
        data,
        { withCredentials: true }
      );
<<<<<<< HEAD

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
=======
      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleFullNameSave = (data) => {
>>>>>>> 4d1eafa (impoved frontend UI)
    updateFullname(data);
    setOpenDialog(null);
  };

  const { mutate: updateEmail, isPending: emailPending } = useMutation({
    mutationFn: async (data) => {
<<<<<<< HEAD
      console.log('data in username is ::', data);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-email`,
        data,
        { withCredentials: true }
      );
<<<<<<< HEAD

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
=======
      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleEmailSave = (data) => {
>>>>>>> 4d1eafa (impoved frontend UI)
    updateEmail(data);
    setOpenDialog(null);
  };

  const { mutate: updateUsername, isPending: usernamePending } = useMutation({
    mutationFn: async (data) => {
<<<<<<< HEAD
      console.log('data in username is ::', data);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-username`,
        data,
        { withCredentials: true }
      );
<<<<<<< HEAD

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
=======
      return res.data;
    },
    onSuccess: (res) => {
      alert(res.message);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (err) => alert(err.response.data.message),
  });

  const handleUsernameSave = (data) => {
>>>>>>> 4d1eafa (impoved frontend UI)
    updateUsername(data);
    setOpenDialog(null);
  };

<<<<<<< HEAD
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
=======
  const { mutate: changeUserPassword, isPending: passwordPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/change-password`,
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
>>>>>>> 4d1eafa (impoved frontend UI)

  const handlePasswordUpdate = (data) => {
    if (data.new !== data.confirm) {
      alert('New password and confirm password must match!');
      return;
    }
<<<<<<< HEAD

    console.log('Passwords submitted:', data);
    changeUserPassword(data);

=======
    changeUserPassword(data);
>>>>>>> 4d1eafa (impoved frontend UI)
    setOpenDialog(null);
  };

  const { mutate: updateAvatar, isPending: avatarPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-avatar`,
        data,
        { withCredentials: true }
      );
<<<<<<< HEAD

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

=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
    const formData = new FormData();
    formData.append('avatar', file);
    updateAvatar(formData);
    setOpenDialog(null);
  };

<<<<<<< HEAD
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

=======
  const { mutate: updateCoverImage, isPending: coverImagePending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-cover-image`,
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
>>>>>>> 4d1eafa (impoved frontend UI)
    updateCoverImage(formData);
    setOpenDialog(null);
  };

  if (emailPending || usernamePending || avatarPending || coverImagePending) {
    return <LoadingSpinner />;
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            </form>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            </form>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            </form>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            </form>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            </form>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
    </div>
  );
}
