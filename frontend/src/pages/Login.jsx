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
import { Eye, EyeOff } from 'lucide-react'; 

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
        'http://localhost:8000/api/v1/users/login',
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
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-[450px] bg-zinc-900 border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex items-center justify-center p-2 mb-2 bg-white rounded-full border border-zinc-800">
            <svg height="32" viewBox="0 0 24 24" width="32" focusable="false" className="text-red-600 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-medium text-white">Sign in</h1>
          <p className="text-zinc-400 text-[15px]">to continue to MyTube</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 px-4 transition-all placeholder:text-transparent"
                    placeholder="Email" 
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {!errors.email && <Label htmlFor="email" className="text-zinc-400 text-xs ml-1">Email or phone</Label>}
                {errors.email && (
                  <span className="text-red-500 text-xs flex items-center gap-1 ml-1">
                    ⚠️ {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-black border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 h-12 pl-4 pr-12 transition-all placeholder:text-transparent"
                    placeholder="Password"
                    {...register('password', {
                      required: 'Enter your password',
                    })}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                 {!errors.password && <Label htmlFor="password" className="text-zinc-400 text-xs ml-1">Password</Label>}
                {errors.password && (
                  <span className="text-red-500 text-xs flex items-center gap-1 ml-1">
                     ⚠️ {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {error && <div className="mt-2"><Alert message={error} type="error" /></div>}

            <div className="flex items-center justify-between pt-4">
              <Link 
                to="/signup" 
                className="text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
              >
                Create account
              </Link>

              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 font-medium rounded-full transition-all"
                disabled={loading}
              >
                {loading ? <LoadingSpinner className="w-5 h-5" /> : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-zinc-800/50 pt-6 pb-6">
           <p className="text-zinc-500 text-xs text-center max-w-xs">
             By continuing, you acknowledge that this is a portfolio project and not the real YouTube.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}