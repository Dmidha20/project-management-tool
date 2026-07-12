import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Loader } from "./components/ui/loader";
import { router } from '@app/routes';


const RouteFallback = () => (
  <div className="h-screen w-full">
    <Loader loading>
      <></>
    </Loader>
  </div>
);

function App() {
  return (

        <Suspense fallback={<RouteFallback />}>
          <RouterProvider router={router} />
        </Suspense>
  );
}

export { App };
