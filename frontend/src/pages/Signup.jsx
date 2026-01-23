import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import axios from 'axios';
import Alert from '@/components/custom/Alert';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const avatarFile = watch('avatar');
  const coverFile = watch('coverImage');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);

      if (data.avatar) formData.append('avatar', data.avatar[0]);
      if (data.coverImage?.length)
        formData.append('coverImage', data.coverImage[0]);


      const res = await axios.post(
        'http://localhost:8000/api/v1/users/register',
        formData
      );


      setSuccess(true);
      reset();
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        setLoading(false);
      } else {
        setError('Something went wrong, please try again');
        setLoading(false);
      }
    }
  };

  return (

    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050508]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.35 0.25 285 / 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-15%] left-[-5%] w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.30 0.20 320 / 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[50%] left-[30%] w-[250px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.25 0.18 250 / 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-[480px]"
      >
        <Card className="glass-card border-white/10 shadow-2xl">
          <div className="absolute inset-0 -z-10 rounded-2xl blur-xl opacity-40"
            style={{
              background: 'linear-gradient(135deg, oklch(0.30 0.18 285 / 0.25), oklch(0.25 0.12 320 / 0.15))',
            }}
          />

          <CardHeader className="flex flex-col items-center gap-3 pb-2 pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            <div className="text-center space-y-1">
              <CardTitle className="text-xl font-bold text-white">Create your account</CardTitle>
              <p className="text-zinc-400 text-sm">Join MyTube today</p>
            </div>
          </CardHeader>

          <CardContent className="pt-4 px-6 pb-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">Account created!</h3>
                  <p className="text-zinc-400 text-sm mt-1">Redirecting to login...</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname" className="text-zinc-300 text-xs font-medium">Full Name</Label>
                    <Input
                      {...register('fullName', { required: 'Required' })}
                      id="fullname"
                      placeholder="John Doe"
                      className="h-10 px-3 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 text-sm"
                    />
                    {errors.fullName && (
                      <span className="text-red-400 text-xs">⚠️ {errors.fullName.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-zinc-300 text-xs font-medium">Username</Label>
                    <Input
                      {...register('username', { required: 'Required' })}
                      id="username"
                      placeholder="johndoe"
                      className="h-10 px-3 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 text-sm"
                    />
                    {errors.username && (
                      <span className="text-red-400 text-xs">⚠️ {errors.username.message}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-zinc-300 text-xs font-medium">Email address</Label>
                  <Input
                    {...register('email', {
                      required: 'Required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email',
                      },
                    })}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-10 px-3 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 text-sm"
                  />
                  {errors.email && (
                    <span className="text-red-400 text-xs">⚠️ {errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-zinc-300 text-xs font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      {...register('password', {
                        required: 'Required',
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                          message: '8+ chars, upper & lowercase',
                        },
                      })}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 pl-3 pr-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-400 text-xs">⚠️ {errors.password.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 text-xs font-medium">Avatar *</Label>
                    <label className={`
                      flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                      ${errors.avatar
                        ? 'border-red-500/50 bg-red-500/5'
                        : avatarFile?.length > 0
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/30'
                      }
                    `}>
                      <div className="flex flex-col items-center gap-1">
                        {avatarFile?.length > 0 ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Upload className="w-5 h-5 text-zinc-400" />
                        )}
                        <span className="text-xs text-zinc-400 truncate max-w-[100px]">
                          {avatarFile?.length > 0 ? avatarFile[0].name : 'Upload avatar'}
                        </span>
                      </div>
                      <input
                        {...register('avatar', { required: 'Required' })}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 text-xs font-medium">Cover (optional)</Label>
                    <label className={`
                      flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                      ${coverFile?.length > 0
                        ? 'border-violet-500/50 bg-violet-500/5'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/30'
                      }
                    `}>
                      <div className="flex flex-col items-center gap-1">
                        {coverFile?.length > 0 ? (
                          <Check className="w-5 h-5 text-violet-400" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-zinc-400" />
                        )}
                        <span className="text-xs text-zinc-400 truncate max-w-[100px]">
                          {coverFile?.length > 0 ? coverFile[0].name : 'Cover image'}
                        </span>
                      </div>
                      <input
                        {...register('coverImage')}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert message={error} type="error" />
                  </motion.div>
                )}

                <div className="flex items-center justify-between pt-3">
                  <Link
                    to="/login"
                    className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
                  >
                    Already have an account?
                  </Link>

                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="small" fullScreen={false} /> : 'Sign up'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}