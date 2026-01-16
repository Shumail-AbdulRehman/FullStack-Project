import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store/store';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import VideoListing from './pages/VideoListing';
import AuthLayout from './components/custom/AuthLayout';
// import VideoUploadPage from './pages/VideoUploadPage';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Video from './pages/Video';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserChannel from './pages/UserChannel';
import Setting from './pages/Setting';
import WatchHistory from './pages/WatchHistory';
import LikedVideos from './pages/LikedVideos';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <AuthLayout>
            <VideoListing />
          </AuthLayout>
        ),
      },
      // {
      //   path: '/video/upload-video',
      //   element: (
      //     <AuthLayout>
      //       <VideoUploadPage />
      //     </AuthLayout>
      //   ),
      // },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: '/video/:videoId/:channelId',
        element: (
          <AuthLayout>
            <Video />
          </AuthLayout>
        ),
      },
      {
        path: '/channel/:channelId',
        element: (
          <AuthLayout>
            <UserChannel />
          </AuthLayout>
        ),
      },
      {
        path: '/channel/settings',
        element: (
          <AuthLayout>
            <Setting />
          </AuthLayout>
        ),
      },
      {
        path: '/user/watch-history',
        element: (
          <AuthLayout>
            <WatchHistory />
          </AuthLayout>
        ),
      },
      {
        path: '/user/liked-videos',
        element: (
          <AuthLayout>
            <LikedVideos />
          </AuthLayout>
        ),
      },
      {
        path: '/user/dashboard',
        element: (
          <AuthLayout>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: '/get-notifications',
        element: (
          <AuthLayout>
            <Notification />
          </AuthLayout>
        ),
      },
      {
        path: '/search',
        element: <SearchResults />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>
);
