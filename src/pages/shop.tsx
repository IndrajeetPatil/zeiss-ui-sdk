import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion";
import { Button } from "@ui-sdk/react/button";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@ui-sdk/react/drawer";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu";
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/react/number-input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider";
import { toast } from "@ui-sdk/react/toast";
import { addToCart, removeFromCart, setQuantity, useCart } from "../cart.ts";
import { Breadcrumb } from "../chrome.tsx";
import { CookieDialog, openCookieSettings } from "../cookie.tsx";
import { Icon, ZeissLogo } from "../icons.tsx";
import { Link, navigate } from "../router.tsx";
import {
  SHIPPING,
  VAT_RATE,
  accessories,
  cameras,
  formatPrice,
  shopImages,
  wideAngleGallery,
  wideAngleSpecs,
} from "../shop-data.ts";
import type { Camera } from "../shop-data.ts";

const CART = "/checkout/cart";
const CAMERAS = "/shop/cameras";
const PRICE_MAX = 250;

type CartNotice = { open: boolean; message: string };
const ShopContext = createContext<(slug: string, quantity: number) => void>(() => {});

function cameraBySlug(slug: string) {
  return cameras.find((camera) => camera.slug === slug);
}

function ShopLayout({ children }: { children: ReactNode }) {
  const lines = useCart();
  const [notice, setNotice] = useState<CartNotice>({ open: false, message: "" });
  const itemCount = lines.length;

  const add = (slug: string, quantity: number) => {
    addToCart(slug, quantity);
    setNotice({
      open: true,
      message: `${quantity} ${quantity === 1 ? "product" : "products"} added to your shopping cart.`,
    });
  };

  return (
    <ShopContext value={add}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CookieDialog site="shop" />
      <header id="top" className="shop-header">
        <div className="topbar shop-topbar">
          <div className="container shop-topbar-inner">
            <strong>Hunting &amp; Nature</strong>
            <div className="shop-switchers">
              <Select defaultValue="en">
                <SelectLabel className="visually-hidden">Language</SelectLabel>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="eur">
                <SelectLabel className="visually-hidden">Currency</SelectLabel>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">EUR €</SelectItem>
                  <SelectItem value="gbp">GBP £</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="masthead container">
          <Link href={CAMERAS} className="logo" aria-label="ZEISS Hunting & Nature shop home">
            <ZeissLogo />
          </Link>
          <NavigationMenu aria-label="Shop" className="main-nav">
            <NavigationMenuList>
              <NavigationMenuItem value="shop">
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    <li>
                      <NavigationMenuLink render={<Link href={CAMERAS} />}>
                        <span>Cameras</span>
                        <span>All ZEISS Secacam models</span>
                      </NavigationMenuLink>
                    </li>
                    {["Deals", "Equipment", "Merchandise"].map((label) => (
                      <li key={label}>
                        <NavigationMenuLink href={`#${label.toLowerCase()}`}>
                          <span>{label}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="subscriptions">
                <NavigationMenuTrigger>Subscriptions &amp; Prepaid Credits</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    {["Overview", "Subscription Features", "Prepaid Credits"].map((label) => (
                      <li key={label}>
                        <NavigationMenuLink href={`#${label.toLowerCase().replaceAll(" ", "-")}`}>
                          <span>{label}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#help">Help &amp; Service</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
          <div className="masthead-tools">
            <a href="#account" className="plain-link">
              Account
            </a>
            <Link href={CART} className="cart-link">
              <Icon name="cart" size={22} />
              <span>Shopping cart</span>
              <span
                className="cart-badge"
                aria-label={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              >
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
      <CartDrawer
        notice={notice}
        onOpenChange={(open) => setNotice((current) => ({ ...current, open }))}
      />
      <footer className="shop-footer">
        <div className="shop-footer-band" />
        <div className="container footer-main">
          <nav aria-label="Informations">
            <h2>Informations</h2>
            <ul>
              {["Shipping & payment", "Returns", "FAQ"].map((label) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase().replaceAll(" ", "-")}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Service Information</h2>
            <p>Upon receipt of payment Mon.–Fri. before 3pm dispatched same day.</p>
          </div>
        </div>
        <div className="legal">
          <div className="container">
            <span>ZEISS Hunting &amp; Nature</span>
            {[
              "General Terms and Conditions",
              "Privacy and Data Protection",
              "Imprint",
              "Right of Withdrawal",
            ].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replaceAll(" ", "-")}`}>
                {label}
              </a>
            ))}
            <Button className="legal-button" onClick={() => openCookieSettings("shop")}>
              Tracking Preferences
            </Button>
          </div>
        </div>
      </footer>
    </ShopContext>
  );
}

function CartSummaryRows({ total }: { total: number }) {
  return (
    <>
      <dt>Subtotal</dt>
      <dd>{formatPrice(total)}</dd>
      <dt>Shipping costs</dt>
      <dd>+ {formatPrice(SHIPPING)}</dd>
    </>
  );
}

function useCartLines() {
  const lines = useCart();
  const items = lines.flatMap((line) => {
    const camera = cameraBySlug(line.slug);
    return camera ? [{ ...line, camera, subtotal: camera.price * line.quantity }] : [];
  });
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, total };
}

function QuantityStepper({ camera, quantity }: { camera: Camera; quantity: number }) {
  return (
    <NumberInput
      value={quantity}
      min={1}
      max={100}
      onValueChange={(value) => {
        if (value !== null) setQuantity(camera.slug, value);
      }}
    >
      <NumberInputGroup className="stepper">
        <NumberInputDecrement aria-label={`Decrease quantity of ${camera.name}`} />
        <NumberInputControl aria-label={`Quantity of ${camera.name}`} />
        <NumberInputIncrement aria-label={`Increase quantity of ${camera.name}`} />
      </NumberInputGroup>
    </NumberInput>
  );
}

function PromoCode() {
  return (
    <form
      className="promo"
      onSubmit={(event) => {
        event.preventDefault();
        toast("Promo code not valid", { description: "Please check the code and try again." });
      }}
    >
      <Field name="code">
        <FieldLabel>Promo code</FieldLabel>
        <div className="promo-row">
          <Input placeholder="Enter promo code…" />
          <Button type="submit" data-variant="outline">
            Apply promo code
          </Button>
        </div>
      </Field>
    </form>
  );
}

function CheckoutButton() {
  return (
    <Button
      data-variant="solid"
      className="checkout-button"
      data-agent-confirm="Starts checkout and payment for everything in the cart"
      onClick={() => toast("Checkout is not part of this demo")}
    >
      Go to checkout
    </Button>
  );
}

function CartDrawer({
  notice,
  onOpenChange,
}: {
  notice: CartNotice;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, total } = useCartLines();

  return (
    <Drawer side="right" open={notice.open} onOpenChange={onOpenChange}>
      <DrawerBackdrop />
      <DrawerContent className="cart-drawer">
        <DrawerClose data-variant="outline">Continue shopping</DrawerClose>
        <div className="cart-drawer-head">
          <DrawerTitle>Shopping cart</DrawerTitle>
          <span>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        {notice.message && (
          <p className="success" role="status">
            {notice.message}
          </p>
        )}
        <ul className="drawer-lines">
          {items.map(({ camera, quantity, subtotal }) => (
            <li key={camera.slug} className="drawer-line">
              <img src={camera.image} alt="" />
              <div>
                <Link href={`${CAMERAS}/${camera.slug}`} onClick={() => onOpenChange(false)}>
                  {camera.name}
                </Link>
                <p className="meta">Product number: {camera.number}</p>
                <QuantityStepper camera={camera} quantity={quantity} />
              </div>
              <div className="line-price">
                <strong>{formatPrice(subtotal)}</strong>
                <span className="meta">{formatPrice(camera.price)} / unit</span>
                <Button
                  className="remove-button"
                  aria-label={`Remove ${camera.name} from shopping cart`}
                  onClick={() => removeFromCart(camera.slug)}
                >
                  <Icon name="close" size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <dl className="summary">
          <CartSummaryRows total={total} />
        </dl>
        <p className="meta">* Prices incl. VAT plus shipping costs</p>
        <PromoCode />
        <CheckoutButton />
        <Link href={CART} className="arrow-link center-link" onClick={() => onOpenChange(false)}>
          Display shopping cart
        </Link>
      </DrawerContent>
    </Drawer>
  );
}

type FilterKey = "fov" | "display" | "battery";
const filterGroups: {
  key: FilterKey;
  legend: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "fov",
    legend: "Field of view",
    options: [
      { value: "60", label: "60° angle" },
      { value: "100", label: "100° angle" },
    ],
  },
  {
    key: "display",
    legend: "Front display for alignment",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    key: "battery",
    legend: "Removable battery compartment",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
];

function matches(camera: Camera, filters: Record<FilterKey, string[]>, price: number[]) {
  const yesNo = (flag: boolean) => (flag ? "yes" : "no");
  return (
    (filters.fov.length === 0 || filters.fov.includes(String(camera.fieldOfView))) &&
    (filters.display.length === 0 || filters.display.includes(yesNo(camera.frontDisplay))) &&
    (filters.battery.length === 0 || filters.battery.includes(yesNo(camera.removableBattery))) &&
    camera.price >= price[0] &&
    camera.price <= price[1]
  );
}

function ShopListingContent() {
  const add = useContext(ShopContext);
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>({
    fov: [],
    display: [],
    battery: [],
  });
  const [price, setPrice] = useState<number[]>([0, PRICE_MAX]);
  const [order, setOrder] = useState<string | null>("price-asc");

  const shown = cameras
    .filter((camera) => matches(camera, filters, price))
    .sort((a, b) => (order === "price-desc" ? b.price - a.price : a.price - b.price));
  const chips = filterGroups.flatMap((group) =>
    group.options
      .filter((option) => filters[group.key].includes(option.value))
      .map((option) => ({
        group,
        option,
        label: group.key === "fov" ? option.label : `${group.legend}: ${option.label}`,
      })),
  );
  const priceActive = price[0] > 0 || price[1] < PRICE_MAX;
  const activeCount = chips.length + (priceActive ? 1 : 0);
  const reset = () => {
    setFilters({ fov: [], display: [], battery: [] });
    setPrice([0, PRICE_MAX]);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: CAMERAS },
          { label: "Shop", href: CAMERAS },
          { label: "Cameras" },
        ]}
      />
      <div className="container">
        <section className="shop-hero" aria-labelledby="page-title">
          <img className="cover" src={cameras[2].image.replace("280x280", "800x800")} alt="" />
          <div>
            <h1 id="page-title">Trail Cameras</h1>
            <p>Discover Now</p>
          </div>
        </section>
        <img
          className="promo-banner"
          src={shopImages.promo}
          alt="Black Friday Deals: ZEISS Secacam 1 for €99.99 instead of the recommended retail price of €124.99, at participating retailers from 16 November to 6 December 2026."
        />

        <div className="filter-row">
          <Popover>
            <div className="filter-trigger">
              <span className="meta">Filter products</span>
              <PopoverTrigger data-variant="outline">
                {activeCount
                  ? `${activeCount} ${activeCount === 1 ? "filter" : "filters"} active`
                  : "Choose filter"}
              </PopoverTrigger>
            </div>
            <PopoverContent className="filter-panel">
              <PopoverTitle>Filter products</PopoverTitle>
              {filterGroups.map((group) => (
                <FieldSet key={group.key}>
                  <FieldLegend>{group.legend}</FieldLegend>
                  <CheckboxGroup
                    value={filters[group.key]}
                    onValueChange={(value) =>
                      setFilters((current) => ({ ...current, [group.key]: value as string[] }))
                    }
                  >
                    {group.options.map((option) => (
                      <label key={option.value} className="check-option">
                        <Checkbox value={option.value}>
                          <CheckboxIndicator />
                        </Checkbox>
                        {option.label}
                      </label>
                    ))}
                  </CheckboxGroup>
                </FieldSet>
              ))}
              <Field>
                <Slider
                  value={price}
                  min={0}
                  max={PRICE_MAX}
                  step={10}
                  onValueChange={(value) => setPrice(value as number[])}
                  format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
                  locale="en-GB"
                >
                  <div className="slider-head">
                    <FieldLabel>Price</FieldLabel>
                    <SliderValue />
                  </div>
                  <SliderControl>
                    <SliderTrack>
                      <SliderIndicator />
                      <SliderThumb index={0} aria-label="Minimum price" />
                      <SliderThumb index={1} aria-label="Maximum price" />
                    </SliderTrack>
                  </SliderControl>
                </Slider>
              </Field>
              <PopoverClose data-variant="solid">Show {shown.length} products</PopoverClose>
            </PopoverContent>
          </Popover>

          <div className="sort-select">
            <Select value={order} onValueChange={setOrder}>
              <SelectLabel>Sort by</SelectLabel>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price ascending</SelectItem>
                <SelectItem value="price-desc">Price descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeCount > 0 && (
          <ul className="chips-row" aria-label="Active filters">
            {priceActive && (
              <li>
                <Button className="chip" onClick={() => setPrice([0, PRICE_MAX])}>
                  Price €{price[0]}–€{price[1]}{" "}
                  <span className="visually-hidden">(remove filter)</span>
                  <Icon name="close" size={14} />
                </Button>
              </li>
            )}
            {chips.map(({ group, option, label }) => (
              <li key={`${group.key}-${option.value}`}>
                <Button
                  className="chip"
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      [group.key]: current[group.key].filter((value) => value !== option.value),
                    }))
                  }
                >
                  {label} <span className="visually-hidden">(remove filter)</span>
                  <Icon name="close" size={14} />
                </Button>
              </li>
            ))}
            <li>
              <Button className="chip reset" onClick={reset}>
                Reset all filters
              </Button>
            </li>
          </ul>
        )}

        <p className="result-count" role="status">
          {shown.length} {shown.length === 1 ? "product" : "products"}
        </p>
        <ul className="product-grid">
          {shown.map((camera) => (
            <li key={camera.slug}>
              <article className="product-card" aria-labelledby={`product-${camera.slug}`}>
                <img src={camera.image} alt="" loading="lazy" />
                <h2 id={`product-${camera.slug}`}>
                  <Link href={`${CAMERAS}/${camera.slug}`}>{camera.name}</Link>
                </h2>
                <p className="meta">{camera.subtitle}</p>
                <p className="price">{formatPrice(camera.price)}</p>
                <p className="meta">incl. 19% VAT</p>
                <Button data-variant="solid" onClick={() => add(camera.slug, 1)}>
                  <Icon name="cart" size={18} />
                  Add to shopping cart<span className="visually-hidden">: {camera.name}</span>
                </Button>
              </article>
            </li>
          ))}
        </ul>
        {shown.length === 0 && (
          <p className="empty">
            No products match these filters.{" "}
            <Button className="link-button" onClick={reset}>
              Reset all filters
            </Button>
          </p>
        )}
      </div>
    </>
  );
}

function ProductContent({ slug }: { slug: string }) {
  const add = useContext(ShopContext);
  const camera = cameraBySlug(slug);
  const [quantity, setQuantityValue] = useState<number | null>(1);

  if (!camera) return <NotFoundContent />;
  const wide = camera.fieldOfView === 100;
  const gallery =
    camera.slug === "secacam-3-wide-angle"
      ? wideAngleGallery
      : [camera.image.replace("280x280", "800x800")];
  const specs = wideAngleSpecs.map(([label, value]): [string, string] =>
    label === "Field of view"
      ? [label, `${camera.fieldOfView}° angle`]
      : label === "Front display for alignment"
        ? [label, camera.frontDisplay ? "Yes" : "No"]
        : label === "Removable battery compartment"
          ? [label, camera.removableBattery ? "Yes" : "No"]
          : [label, value],
  );

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: CAMERAS },
          { label: "Shop", href: CAMERAS },
          { label: "Cameras", href: CAMERAS },
          { label: camera.name },
        ]}
      />
      <div className="container">
        <div className="pdp">
          <Carousel aria-label={`${camera.name} images`} className="gallery" loop>
            <CarouselViewport>
              <CarouselContent>
                {gallery.map((src, index) => (
                  <CarouselItem key={src}>
                    <img
                      src={src}
                      alt={`${camera.name}, image ${index + 1} of ${gallery.length}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </CarouselViewport>
            {gallery.length > 1 && (
              <div className="gallery-controls">
                <CarouselPrevious aria-label="Previous image" />
                <CarouselIndicatorGroup aria-label="Choose an image">
                  {gallery.map((src, index) => (
                    <CarouselIndicator
                      key={src}
                      page={index + 1}
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </CarouselIndicatorGroup>
                <CarouselNext aria-label="Next image" />
              </div>
            )}
          </Carousel>

          <div className="buy-box">
            <p className="brand">ZEISS</p>
            <p className="meta">Product number: {camera.number}</p>
            <h1>{camera.name}</h1>
            <p className="pdp-price">{formatPrice(camera.price)}</p>
            <p className="meta">Prices incl. VAT plus shipping costs</p>
            <form
              className="buy-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (quantity) add(camera.slug, quantity);
              }}
            >
              <Field>
                <FieldLabel className="visually-hidden">Quantity</FieldLabel>
                <NumberInput value={quantity} onValueChange={setQuantityValue} min={1} max={100}>
                  <NumberInputGroup className="stepper">
                    <NumberInputDecrement aria-label="Decrease quantity" />
                    <NumberInputControl />
                    <NumberInputIncrement aria-label="Increase quantity" />
                  </NumberInputGroup>
                </NumberInput>
              </Field>
              <Button type="submit" data-variant="solid">
                <Icon name="cart" size={18} />
                Add to shopping cart
              </Button>
            </form>
            <p className="availability">
              <span aria-hidden="true" className="dot" /> Available, delivery time: 1-3 days
            </p>
            <Button data-variant="outline" render={<a href="#dealer" />}>
              Find a dealer
            </Button>
            <p>
              The {camera.name} combines high-quality ZEISS image quality with{" "}
              {wide ? "an exceptionally wide 100°" : "a focused 60°"} field of view. It is ideal for
              observing wildlife, birdwatching and monitoring indoor areas and properties.
              {camera.frontDisplay &&
                " The swivelling 1.9-inch colour display and the handy TEST button make set-up easy,"}{" "}
              and the built-in LTE technology streams your footage directly to your smartphone.
            </p>
          </div>
        </div>

        <Accordion
          aria-label="Product details"
          className="pdp-details"
          defaultValue={["technical"]}
        >
          <AccordionItem value="technical">
            <AccordionHeader render={<h2 />}>
              <AccordionTrigger>Technical data</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <table className="spec-table">
                <tbody>
                  {specs.map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="delivery">
            <AccordionHeader render={<h2 />}>
              <AccordionTrigger>Scope of delivery</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <p>{camera.name}, 4G antenna, mounting strap, USB-C cable, quick start guide.</p>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="manufacturer">
            <AccordionHeader render={<h2 />}>
              <AccordionTrigger>Manufacturer information</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <p>
                VALYRA Germany GmbH, exclusive licensee of the ZEISS brand for hunting and nature
                products.
              </p>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <section className="band accessories" aria-labelledby="accessories-title">
          <h2 id="accessories-title" className="section-title">
            {camera.name} Accessories
          </h2>
          <Carousel aria-label="Accessories" slidesPerPage={4} className="accessory-carousel">
            <CarouselViewport>
              <CarouselContent>
                {accessories.map((item) => (
                  <CarouselItem key={item.name}>
                    <article className="product-card small">
                      <img src={item.image} alt="" loading="lazy" />
                      <h3>{item.name}</h3>
                      <p className="price">{formatPrice(item.price)}</p>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </CarouselViewport>
            <CarouselPrevious aria-label="Previous accessories" />
            <CarouselNext aria-label="Next accessories" />
          </Carousel>
        </section>
      </div>
    </>
  );
}

function CartContent() {
  const { items, total } = useCartLines();
  const net = total / (1 + VAT_RATE);
  const count = items.length;

  return (
    <>
      <div className="container cart-page">
        <div>
          <h1>Shopping cart</h1>
          {count === 0 ? (
            <p className="empty">
              Your shopping cart is empty. <Link href={CAMERAS}>Continue shopping</Link>
            </p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Unit price</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col">
                    <span className="visually-hidden">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ camera, quantity, subtotal }) => (
                  <tr key={camera.slug}>
                    <td>
                      <div className="cart-product">
                        <img src={camera.image} alt="" />
                        <div>
                          <Link href={`${CAMERAS}/${camera.slug}`}>{camera.name}</Link>
                          <p className="meta">Product number: {camera.number}</p>
                          <p className="meta">Delivery time: 1-3 days</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <QuantityStepper camera={camera} quantity={quantity} />
                    </td>
                    <td>{formatPrice(camera.price)}</td>
                    <td>
                      <strong>{formatPrice(subtotal)}</strong>
                    </td>
                    <td>
                      <Button
                        className="remove-button"
                        aria-label={`Remove ${camera.name} from shopping cart`}
                        onClick={() => removeFromCart(camera.slug)}
                      >
                        <Icon name="close" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {count > 0 && (
          <aside className="cart-summary" aria-labelledby="summary-title">
            <h2 id="summary-title">Order summary</h2>
            <dl className="summary">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
              <dt>Shipping costs</dt>
              <dd>{formatPrice(SHIPPING)}</dd>
              <dt className="grand">Grand total</dt>
              <dd className="grand">{formatPrice(total + SHIPPING)}</dd>
              <dt>Net total</dt>
              <dd>€{net.toFixed(2)}</dd>
              <dt>plus 19% VAT</dt>
              <dd>€{(total - net).toFixed(2)}</dd>
            </dl>
            <PromoCode />
            <CheckoutButton />
            <p className="visually-hidden" role="status">
              Shopping cart contains {count} {count === 1 ? "item" : "items"}. The cart total value
              is €{(total + SHIPPING).toFixed(2)}.
            </p>
          </aside>
        )}
      </div>
    </>
  );
}

function NotFoundContent() {
  return (
    <>
      <div className="container band">
        <h1>Page not found</h1>
        <Button data-variant="solid" onClick={() => navigate(CAMERAS)}>
          Back to the cameras
        </Button>
      </div>
    </>
  );
}

function ShopListing() {
  return (
    <ShopLayout>
      <ShopListingContent />
    </ShopLayout>
  );
}

function ProductPage({ slug }: { slug: string }) {
  return (
    <ShopLayout>
      <ProductContent slug={slug} />
    </ShopLayout>
  );
}

function CartPage() {
  return (
    <ShopLayout>
      <CartContent />
    </ShopLayout>
  );
}

export { CartPage, ProductPage, ShopListing };
