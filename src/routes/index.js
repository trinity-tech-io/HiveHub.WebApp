import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import MainLayout from '../layouts/MainLayout';
import SettingLayout from '../layouts/SettingLayout';
// unused
import HiveHubLayout from '../layouts';

// ----------------------------------------------------------------------
const Loadable = (Component) =>
  function loadPage(props) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <HomePage /> },
        {
          path: 'dashboard',
          children: [
            { path: '', element: <Navigate to="/dashboard/node" replace /> },
            {
              path: 'node',
              children: [
                { path: '', element: <MyNodes /> },
                { path: 'envconfig', element: <EnvConfigPage /> },
                { path: 'create', element: <CreateNodePage /> },
                { path: 'detail/:nodeId', element: <NodeDetailPage /> }
              ]
            },
            {
              path: 'vault',
              children: [{ path: '', element: <MyVault /> }]
            },
            {
              path: 'explore',
              children: [{ path: '', element: <ExploreNode /> }]
            },
            {
              path: 'settings',
              element: <SettingLayout />,
              children: [
                { path: '', element: <Navigate to="/dashboard/settings/about" replace /> },
                { path: 'about', element: <AboutSettings /> },
                { path: 'language', element: <LanguageSettings /> }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <HiveHubLayout />,
      children: [
        { path: '', element: <Navigate to="/landing" replace /> },
        { path: 'landing', element: <LandingPage /> },
        {
          path: 'dashboard',
          children: [
            { path: '', element: <Navigate to="/dashboard/home" replace /> },
            { path: 'home', element: <HiveHome /> },
            { path: 'explorer', element: <HiveExplorer /> },
            { path: 'explorer/detail/:nodeId', element: <NodeDetail /> },
            { path: 'nodes', element: <HiveNodes /> },
            { path: 'nodes/detail/:nodeId', element: <MyNodeDetail /> },
            { path: 'nodes/envconfig', element: <NodeEnvConfig /> },
            { path: 'nodes/create', element: <CreateNode /> },
            { path: 'vaults', element: <HiveVaults /> }
          ]
        }
      ]
    }
  ]);
}

const HomePage = Loadable(lazy(() => import('../pages/Home')));
const MyNodes = Loadable(lazy(() => import('../pages/Dashboard/Node')));
const EnvConfigPage = Loadable(lazy(() => import('../pages/Dashboard/Node/EnvConfiguration')));
const CreateNodePage = Loadable(lazy(() => import('../pages/Dashboard/Node/CreateNode')));
const NodeDetailPage = Loadable(lazy(() => import('../pages/Dashboard/Node/NodeDetail')));
const MyVault = Loadable(lazy(() => import('../pages/Dashboard/Vault')));
const ExploreNode = Loadable(lazy(() => import('../pages/Dashboard/Explore')));
const AboutSettings = Loadable(lazy(() => import('../pages/Dashboard/Settings/About')));
const LanguageSettings = Loadable(lazy(() => import('../pages/Dashboard/Settings/Language')));

// unused
const LandingPage = Loadable(lazy(() => import('../pages/Landing')));
const HiveHome = Loadable(lazy(() => import('../pages/Dashboard/Home')));
const HiveExplorer = Loadable(lazy(() => import('../pages/Dashboard/Explorer')));
const NodeDetail = Loadable(lazy(() => import('../pages/Dashboard/Explorer/NodeDetail')));
const HiveNodes = Loadable(lazy(() => import('../pages/Dashboard/MyNodes')));
const MyNodeDetail = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/MyNodeDetail')));
const NodeEnvConfig = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/NodeEnvConfig')));
const CreateNode = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/CreateNode')));
const HiveVaults = Loadable(lazy(() => import('../pages/Dashboard/MyVaults')));
