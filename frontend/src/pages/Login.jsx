import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import Alert from '@/components/custom/Alert';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/login`,
        data,
        { withCredentials: true }
      );

      dispatch(login(res.data.data.user));
      setLoading(false);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        setLoading(false);
      } else {
        setError('Something went wrong, please try again');
        setLoading(false);
      }
    }
    reset();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050508]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.35 0.25 285 / 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.30 0.20 320 / 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.25 0.15 250 / 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        <Card className="w-full max-w-[420px] glass-card border-white/10 shadow-2xl">
          <div className="absolute inset-0 -z-10 rounded-2xl blur-xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, oklch(0.35 0.20 285 / 0.3), oklch(0.30 0.15 320 / 0.2))',
            }}
          />

          <CardHeader className="flex flex-col items-center gap-3 pb-2 pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-zinc-400 text-sm">Sign in to continue to MyTube</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300 text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-12 px-4 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    ⚠️ {errors.email.message}
                  </motion.span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 pl-4 pr-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Enter your password',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    ⚠️ {errors.password.message}
                  </motion.span>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert message={error} type="error" />
                </motion.div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/signup"
                  className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
                >
                  Create account
                </Link>

                <Button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="small" fullScreen={false} />
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 pt-5 pb-6 px-6">
            <p className="text-zinc-500 text-xs text-center max-w-xs">
              By continuing, you acknowledge that this is a portfolio project and not the real YouTube.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}