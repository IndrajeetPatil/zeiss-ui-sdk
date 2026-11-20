import { Toast, ToastClose, ToastDescription, ToastRegion, ToastTitle } from "@ui-sdk/react/toast";
import { Home } from "./pages/home.tsx";
import { NatureHome, NatureProducts, TrailCameras } from "./pages/nature.tsx";
import { CartPage, ProductPage, ShopListing } from "./pages/shop.tsx";
import { useLocation } from "./router.tsx";

function Page() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";

  if (path === "/nature-observation") return <NatureHome />;
  if (path === "/nature-observation/products") return <NatureProducts />;
  if (path === "/nature-observation/products/trail-cameras") return <TrailCameras />;
  if (path === "/shop/cameras") return <ShopListing />;
  if (path.startsWith("/shop/cameras/")) return <ProductPage slug={path.split("/").pop()!} />;
  if (path === "/checkout/cart") return <CartPage />;
  return <Home />;
}

function App() {
  const { pathname } = useLocation();
  return (
    <>
      <Page key={pathname} />
      <ToastRegion aria-label="Notifications" data-agent-hidden>
        {() => (
          <Toast>
            <ToastTitle />
            <ToastDescription />
            <ToastClose aria-label="Dismiss notification" />
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}

export { App };
