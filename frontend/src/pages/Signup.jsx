import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
    <div className="flex flex-col h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Fill out the details to create your account
          </CardDescription>
          <CardAction>
            <Link to={'/login'}>Login</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4">
              <Label htmlFor="fullName">Fullname</Label>
              <Input
                {...register('fullName', { required: 'Fullname is required' })}
                id="fullname"
                placeholder="Fullname"
              />
              {errors.fullname && (
                <span className="text-red-600">{errors.fullname.message}</span>
              )}

              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                id="email"
                placeholder="m@example.com"
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}

              <Label htmlFor="username">Username</Label>
              <Input
                {...register('username', { required: 'Username is required' })}
                id="username"
                placeholder="username123"
              />
              {errors.username && (
                <span className="text-red-600">{errors.username.message}</span>
              )}

              <label className="inline-block px-4 py-2 text-white rounded cursor-pointer bg-gray-700 hover:bg-gray-800">
                Upload Avatar
                <input
                  {...register('avatar', { required: 'Avatar is required' })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {errors.avatar && (
                <span className="text-red-600">{errors.avatar.message}</span>
              )}

              <label className="inline-block px-4 py-2 text-white rounded cursor-pointer bg-gray-700 hover:bg-gray-800">
                Upload Cover Image (Optional)
                <input
                  {...register('coverImage')}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>

              <Label htmlFor="password">Password</Label>
              <Input
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      'Password must be at least 8 characters, include uppercase, lowercase',
                  },
                })}
                id="password"
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>

            <CardFooter className="flex-col gap-2">
              {error && <Alert message={error} />}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <LoadingSpinner /> : <h1>SignUp</h1>}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
