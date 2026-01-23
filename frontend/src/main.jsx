import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthLayout from './components/custom/AuthLayout';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

<<<<<<< HEAD
const NotFound = lazy(() => import('./pages/NotFound')); 
=======
const NotFound = lazy(() => import('./pages/NotFound'));
>>>>>>> 4d1eafa (impoved frontend UI)
const VideoListing = lazy(() => import('./pages/VideoListing'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/Signup'));
const Video = lazy(() => import('./pages/Video'));
const UserChannel = lazy(() => import('./pages/UserChannel'));
const Setting = lazy(() => import('./pages/Setting'));
const WatchHistory = lazy(() => import('./pages/WatchHistory'));
const LikedVideos = lazy(() => import('./pages/LikedVideos'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
<<<<<<< HEAD
=======
const PlaylistView = lazy(() => import('./pages/PlaylistView'));
>>>>>>> 4d1eafa (impoved frontend UI)

const queryClient = new QueryClient();

const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
    <LoadingSpinner />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <VideoListing />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/video/:videoId/:channelId',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <Video />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
<<<<<<< HEAD
=======
        path: '/playlist/:playlistId/:videoIndex?',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <PlaylistView />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
>>>>>>> 4d1eafa (impoved frontend UI)
        path: '/channel/:channelId',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <UserChannel />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/channel/settings',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <Setting />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/user/watch-history',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <WatchHistory />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/user/liked-videos',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <LikedVideos />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/user/dashboard',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/search',
        element: (
          <AuthLayout>
            <Suspense fallback={<Loading />}>
<<<<<<< HEAD
            <SearchResults />
          </Suspense>
          </AuthLayout>
          
=======
              <SearchResults />
            </Suspense>
          </AuthLayout>

>>>>>>> 4d1eafa (impoved frontend UI)
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>
);