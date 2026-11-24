import type { ReactNode } from "react";
import { Button } from "@ui-sdk/react/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu";
import { Breadcrumb, PageHero } from "../chrome.tsx";
import { CookieDialog } from "../cookie.tsx";
import { Icon, ZeissLogo } from "../icons.tsx";
import { Link } from "../router.tsx";
import { pnoImages, trailCameraModels } from "../shop-data.ts";

const NATURE = "/nature-observation";
const PRODUCTS = `${NATURE}/products`;
const TRAIL_CAMERAS = `${PRODUCTS}/trail-cameras`;

const categories = [
  {
    title: "ZEISS Binoculars",
    subtitle: "For more discoveries in nature.",
    text: "From compact binoculars for hiking to high-end models for dawn and dusk, find the binoculars that bring you closer to every detail.",
    image: pnoImages.binoculars,
    href: "#binoculars",
  },
  {
    title: "ZEISS Spotting Scopes",
    subtitle: "Detail at a distance.",
    text: "Spotting scopes reveal plumage and behaviour at distances where binoculars reach their limits.",
    image: pnoImages.spottingScopes,
    href: "#spotting-scopes",
  },
  {
    title: "ZEISS Trail Cameras",
    subtitle: "Nature is just a click away.",
    text: "Watch your favourite locations remotely: ZEISS trail cameras send photos and videos straight to your smartphone.",
    image: pnoImages.trailCameras,
    href: TRAIL_CAMERAS,
  },
  {
    title: "ZEISS Monoculars",
    subtitle: "Small but powerful.",
    text: "Lightweight monoculars that fit in any pocket for spontaneous observations.",
    image: pnoImages.monoculars,
    href: "#monoculars",
  },
];

function NatureLayout({
  crumbs,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <a
        className="skip-link"
        href="#main"
      >
        Skip to content
      </a>
      <CookieDialog site="zeiss" />
      <header id="top">
        <div className="topbar">
          <div className="container">
            <strong>Nature Observation</strong>
          </div>
        </div>
        <div className="masthead container">
          <Link
            href="/"
            className="logo"
            aria-label="ZEISS Group home"
          >
            <ZeissLogo />
          </Link>
          <NavigationMenu
            aria-label="Nature Observation"
            className="main-nav"
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href={NATURE} />}>
                  Nature Observation
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem value="products">
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    <li>
                      <NavigationMenuLink render={<Link href={PRODUCTS} />}>
                        <span>All products</span>
                        <span>
                          Binoculars, spotting scopes, trail cameras and
                          monoculars
                        </span>
                      </NavigationMenuLink>
                    </li>
                    {categories.map((category) => (
                      <li key={category.title}>
                        <NavigationMenuLink
                          render={<Link href={category.href} />}
                        >
                          <span>{category.title}</span>
                          <span>{category.subtitle}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {["Cooperations", "Service", "Blog"].map((label) => (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink href={`#${label.toLowerCase()}`}>
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
          <div className="masthead-tools">
            <a
              href="#contact"
              className="plain-link"
            >
              Contact
            </a>
          </div>
        </div>
      </header>
      <Breadcrumb items={crumbs} />
      <main id="main">{children}</main>
      <footer>
        <div className="licence container">
          <p>
            Valyra is an independent company that, as an exclusive licensee,
            develops, manufactures, and distributes outdoor products under the
            ZEISS brand.
          </p>
        </div>
        <div className="legal">
          <div className="container">
            {[
              "Contact",
              "Publisher",
              "Legal Notice",
              "Privacy Notice",
              "Cookie Notice",
            ].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

function NatureHome() {
  return (
    <NatureLayout
      crumbs={[{ label: "Home", href: "/" }, { label: "Nature Observation" }]}
    >
      <PageHero
        image={pnoImages.natureHero}
        title="ZEISS Nature Observation"
        subtitle="More discoveries."
        align="end"
        tone="light"
      />
      <section className="band">
        <div className="container narrow">
          <p className="lead">
            Lovers of nature go out to escape from the habitual things of
            everyday life. Whether it's a kingfisher at the river or a stag at
            dawn, when you see it up close with the right optics, it is a unique
            and unforgettable moment in life.
          </p>
        </div>
        <div className="container tile-grid">
          <Link
            href={PRODUCTS}
            className="image-card tile-large"
          >
            <img
              className="cover"
              src={pnoImages.productsTile}
              alt=""
            />
            <span className="kicker">ZEISS Nature Observation</span>
            <span className="card-title">Products</span>
          </Link>
          <a
            href="#cooperations"
            className="image-card"
          >
            <img
              className="cover"
              src={pnoImages.cooperationsTile}
              alt=""
            />
            <span className="card-title">Cooperations</span>
          </a>
          <a
            href="#service"
            className="blue-tile"
          >
            <span className="card-title">Service</span>
            <Icon name="arrow" />
          </a>
        </div>
      </section>
    </NatureLayout>
  );
}

function NatureProducts() {
  return (
    <NatureLayout
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Nature Observation", href: NATURE },
        { label: "Products" },
      ]}
    >
      <PageHero
        image={pnoImages.productsHero}
        eyebrow="ZEISS Nature Observation"
        title="Products"
        subtitle="Unlock the wonders of nature with ZEISS cutting-edge optics."
      />
      <section className="band">
        <div className="container narrow">
          <p className="lead">
            Whether you're observing songbirds in your garden, scanning the
            horizon for raptors, or keeping an eye on wildlife remotely,
            discover how ZEISS helps you experience more in every moment.
          </p>
        </div>
      </section>
      {categories.map((category, index) => (
        <section
          key={category.title}
          className={`category-row ${index % 2 ? "band" : "band band-muted"}`}
          aria-labelledby={`category-${index}`}
        >
          <div className={`container split ${index % 2 ? "reverse" : ""}`}>
            <img
              src={category.image}
              alt=""
              loading="lazy"
            />
            <div>
              <h2
                id={`category-${index}`}
                className="section-title"
              >
                {category.title}
              </h2>
              <p className="subtitle-small">{category.subtitle}</p>
              <p>{category.text}</p>
              <Link
                href={category.href}
                className="arrow-link"
              >
                {category.title}{" "}
                <Icon
                  name="arrow"
                  size={18}
                />
              </Link>
            </div>
          </div>
        </section>
      ))}
    </NatureLayout>
  );
}

function TrailCameras() {
  return (
    <NatureLayout
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Nature Observation", href: NATURE },
        { label: "Products", href: PRODUCTS },
        { label: "Trail Cameras" },
      ]}
    >
      <PageHero
        image={pnoImages.trailHero}
        eyebrow="ZEISS Nature Observation"
        title="ZEISS Trail Cameras"
        subtitle="Nature is just a click away."
      />
      <section className="band">
        <div className="container narrow">
          <p className="lead">
            Birdwatching doesn't stop when you go home. ZEISS trailcams allow
            you to monitor your favorite locations remotely, and send photos and
            videos of every visitor straight to your smartphone.
          </p>
        </div>
      </section>
      <section
        className="band band-muted"
        aria-labelledby="compare-title"
      >
        <div className="container">
          <h2
            id="compare-title"
            className="section-title center"
          >
            Compare the models
          </h2>
          <Carousel
            aria-label="Trail camera models"
            className="model-carousel"
            slidesPerPage={3}
          >
            <CarouselViewport>
              <CarouselContent>
                {trailCameraModels.map((model) => (
                  <CarouselItem key={model.name}>
                    <article
                      className="model-card"
                      aria-labelledby={`model-${model.name}`}
                    >
                      <p className="eyebrow dark">ZEISS Trail Cameras</p>
                      <h3 id={`model-${model.name}`}>
                        {model.name}
                        {model.isNew && <span className="badge">New!</span>}
                      </h3>
                      <p className="muted">{model.tagline}</p>
                      <img
                        src={model.image}
                        alt=""
                        loading="lazy"
                      />
                      <dl className="spec-list">
                        <dt>Field of View</dt>
                        <dd>{model.fov}</dd>
                        <dt>Detection Range</dt>
                        <dd>{model.range}</dd>
                        <dt>Sensor Resolution</dt>
                        <dd>{model.sensor}</dd>
                      </dl>
                      <ul className="check-list">
                        {model.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </CarouselViewport>
            <CarouselPrevious aria-label="Previous models" />
            <CarouselNext aria-label="Next models" />
          </Carousel>
          <p className="footnote">* depends on model</p>
          <div className="center">
            <Button
              data-variant="solid"
              render={<Link href="/shop/cameras" />}
            >
              ZEISS Online Shop
            </Button>
          </div>
        </div>
      </section>
      <section
        className="band"
        aria-labelledby="accessories-title"
      >
        <div className="container split">
          <img
            src={pnoImages.accessories}
            alt=""
            loading="lazy"
          />
          <div>
            <h2
              id="accessories-title"
              className="section-title"
            >
              ZEISS Trail Cameras Accessories
            </h2>
            <p>Practical and versatile accessories for your trail camera.</p>
          </div>
        </div>
      </section>
    </NatureLayout>
  );
}

export { NatureHome, NatureProducts, TrailCameras };
