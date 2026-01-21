import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle, 
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import Alert from '@/components/custom/Alert';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';

export default function SignUp() {
  const [error, setError] = useState(null);
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
      
      console.log('form data is: ', formData);
      const res = await axios.post(
        'http://localhost:8000/api/v1/users/register',
        formData
      );

      console.log('Success', res.data.message);

      reset();
      setLoading(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        console.log(error.response.data.message);
        setLoading(false);
      } else {
        console.error(
          'else case on register maybe network error',
          error.message
        );
        setError('something went wrong, please try again');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-[500px] bg-zinc-900 border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
           <div className="flex items-center justify-center p-2 mb-2 bg-white rounded-full border border-zinc-800">
            <svg height="32" viewBox="0 0 24 24" width="32" focusable="false" className="text-red-600 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
          </div>

          <CardTitle className="text-2xl font-medium text-white">Create your account</CardTitle>
          <p className="text-zinc-400 text-[15px]">Fill out the details below</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  {...register('fullName', { required: 'Fullname is required' })}
                  id="fullname"
                  placeholder="Full Name"
                  className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 px-4 placeholder:text-zinc-500"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs ml-1">⚠️ {errors.fullName.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  {...register('username', { required: 'Username is required' })}
                  id="username"
                  placeholder="Username"
                  className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 px-4 placeholder:text-zinc-500"
                />
                {errors.username && (
                  <span className="text-red-500 text-xs ml-1">⚠️ {errors.username.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                id="email"
                placeholder="Email address"
                className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 px-4 placeholder:text-zinc-500"
              />
              {errors.email && (
                <span className="text-red-500 text-xs ml-1">⚠️ {errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Input
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                      message:
                        'Must contain 8+ chars, uppercase & lowercase',
                    },
                  })}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 px-4 pr-12 placeholder:text-zinc-500"
                />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs ml-1">⚠️ {errors.password.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className={`
                  flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${errors.avatar ? 'border-red-900 bg-red-950/10' : 'border-zinc-700 bg-zinc-950 hover:bg-zinc-800 hover:border-zinc-500'}
                `}>
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                    <p className="text-xs text-zinc-400">
                      {avatarFile && avatarFile.length > 0 ? (
                        <span className="text-green-500 font-medium truncate max-w-[120px] block">{avatarFile[0].name}</span>
                      ) : (
                        "Upload Avatar"
                      )}
                    </p>
                  </div>
                  <input
                    {...register('avatar', { required: 'Avatar is required' })}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {errors.avatar && (
                  <span className="text-red-500 text-xs ml-1 text-center block">⚠️ Required</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-800 hover:border-zinc-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <ImageIcon className="w-6 h-6 text-zinc-400 mb-1" />
                    <p className="text-xs text-zinc-400">
                      {coverFile && coverFile.length > 0 ? (
                        <span className="text-blue-400 font-medium truncate max-w-[120px] block">{coverFile[0].name}</span>
                      ) : (
                        "Cover Image (Opt)"
                      )}
                    </p>
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

            {error && <Alert message={error} type="error" />}

            <div className="flex items-center justify-between pt-4 mt-2">
               <Link 
                to="/login" 
                className="text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
              >
                Already have an account?
              </Link>

              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 font-medium rounded-full transition-all"
                disabled={loading}
              >
                {loading ? <LoadingSpinner className="w-5 h-5" /> : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}