import { useState } from "react";
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
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/react/command";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card";
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
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { Textarea } from "@ui-sdk/react/textarea";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  toast,
} from "@ui-sdk/react/toast";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip";
import {
  areas,
  divisionGroups,
  events,
  heroSlides,
  news,
  promos,
  stories,
  topics,
  websites,
} from "./content.ts";
import type { Topic } from "./content.ts";
import { Icon, ZeissLogo } from "./icons.tsx";
import {
  cardImages,
  eventsImage,
  heroImages,
  newsImages,
  portfolioImage,
  promoImages,
  storyImages,
} from "./images.ts";

const NEWS_PER_PAGE = 2;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const [division, setDivision] = useState<string | null>(divisionGroups[0].value);
  const [cookiesOpen, setCookiesOpen] = useState(true);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CookieDialog open={cookiesOpen} onOpenChange={setCookiesOpen} />
      <Header
        onDivision={(value) => {
          setDivision(value);
          scrollToId("divisions");
        }}
      />
      <main id="main">
        <Hero />
        <Divisions value={division} onValueChange={setDivision} />
        <Editorial />
        <Portfolio />
        <Newsroom />
        <Events />
        <ContactInfo />
      </main>
      <Footer onCookiePreferences={() => setCookiesOpen(true)} />
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

function CookieDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [prefs, setPrefs] = useState({ statistics: false, functional: false, marketing: false });

  return (
    <Dialog
      open={open}
      dismissible={false}
      onOpenChange={(next, details) => {
        onOpenChange(next);
        if (next) return;
        const choice = details.returnValue;
        if (choice === "accept") setPrefs({ statistics: true, functional: true, marketing: true });
        if (choice === "reject")
          setPrefs({ statistics: false, functional: false, marketing: false });
        toast(
          choice === "accept"
            ? "All cookies accepted"
            : choice === "reject"
              ? "Optional cookies rejected"
              : "Cookie preferences saved",
        );
      }}
    >
      <DialogBackdrop />
      <DialogContent className="cookie-dialog">
        <DialogTitle>Data privacy settings</DialogTitle>
        <DialogDescription>
          We use different tracking technologies to provide a better website experience for you.
          Technically necessary cookies are always on. You can accept all, reject the optional ones,
          or choose per category, and change your choice at any time under “Cookie Preferences” in
          the footer.
        </DialogDescription>
        <p className="muted">
          Our <a href="#privacy">Privacy notice</a> provides more details about tracking technology
          use.
        </p>
        <Collapsible className="cookie-prefs">
          <CollapsibleTrigger>Customize cookie settings</CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="switch-list">
              <Field disabled>
                <Switch name="necessary" checked>
                  <SwitchThumb />
                </Switch>
                <FieldLabel>Technically necessary</FieldLabel>
              </Field>
              {(["statistics", "functional", "marketing"] as const).map((key) => (
                <Field key={key}>
                  <Switch
                    name={key}
                    checked={prefs[key]}
                    onCheckedChange={(checked) =>
                      setPrefs((current) => ({ ...current, [key]: checked }))
                    }
                  >
                    <SwitchThumb />
                  </Switch>
                  <FieldLabel>{key[0].toUpperCase() + key.slice(1)} cookies</FieldLabel>
                </Field>
              ))}
            </div>
            <DialogClose value="save" data-variant="outline">
              Save my choices
            </DialogClose>
          </CollapsiblePanel>
        </Collapsible>
        <div className="dialog-actions">
          <DialogClose value="reject" data-variant="solid">
            Reject All
          </DialogClose>
          <DialogClose
            value="accept"
            data-variant="solid"
            data-agent-confirm="Consents to all tracking cookies, including marketing"
          >
            Accept All
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Header({ onDivision }: { onDivision: (value: string) => void }) {
  return (
    <header id="top">
      <div className="topbar">
        <div className="container">
          <strong>ZEISS Group</strong> <span>Global</span>
        </div>
      </div>
      <div className="masthead container">
        <a href="#top" className="logo" aria-label="ZEISS Group home">
          <ZeissLogo />
        </a>
        <NavigationMenu aria-label="Main" className="main-nav">
          <NavigationMenuList>
            <NavigationMenuItem value="about">
              <NavigationMenuTrigger>About us</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  {[
                    ["About ZEISS", "Company, purpose and values"],
                    ["History at a glance", "Since 1846 in Jena"],
                    ["Carl Zeiss Foundation", "Our sole owner"],
                    ["Sustainability at ZEISS", "Our responsibility"],
                    ["Innovation at ZEISS", "Shaping the future with technology"],
                    ["Newsroom", "Press releases and media"],
                  ].map(([title, text]) => (
                    <li key={title}>
                      <NavigationMenuLink href={`#${title.toLowerCase().replaceAll(" ", "-")}`}>
                        <span>{title}</span>
                        <span>{text}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="products">
              <NavigationMenuTrigger>Products and solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="mega">
                  {divisionGroups.flatMap((group) =>
                    group.divisions.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink
                          href="#divisions"
                          onClick={(event) => {
                            event.preventDefault();
                            onDivision(group.value);
                          }}
                        >
                          <span>{item.name}</span>
                        </NavigationMenuLink>
                      </li>
                    )),
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#careers">Careers</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
        <div className="masthead-tools">
          <a href="#contact" className="plain-link">
            Contact
          </a>
          <SiteSearch onDivision={onDivision} />
        </div>
      </div>
    </header>
  );
}

function SiteSearch({ onDivision }: { onDivision: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const pages = [
    { value: "news", label: "Newsroom", target: "newsroom" },
    { value: "events", label: "Events", target: "events" },
    { value: "stories", label: "Focus topics", target: "focus-topics" },
    { value: "contact", label: "Contact & information", target: "contact" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger shortcut="mod+k" aria-label="Search on site" className="icon-button">
        <Icon name="search" size={20} />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent className="search-dialog">
        <DialogTitle>Search on site</DialogTitle>
        <Command
          onAction={(value) => {
            setOpen(false);
            const [kind, id] = value.split(":");
            if (kind === "division") onDivision(id);
            else scrollToId(id);
          }}
        >
          <div className="search-row">
            <Icon name="search" size={20} />
            <CommandInput aria-label="Search ZEISS" placeholder="Search divisions, news, events…" />
          </div>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Divisions</CommandGroupLabel>
              {divisionGroups.flatMap((group) =>
                group.divisions.map((item) => (
                  <CommandItem
                    key={item.name}
                    value={`division:${group.value}:${item.name}`}
                    keywords={[group.headline]}
                  >
                    {item.name}
                  </CommandItem>
                )),
              )}
            </CommandGroup>
            <CommandGroup>
              <CommandGroupLabel>Pages</CommandGroupLabel>
              {pages.map((page) => (
                <CommandItem key={page.value} value={`page:${page.target}`}>
                  {page.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogShortcut />
      </DialogContent>
    </Dialog>
  );
}

function Hero() {
  return (
    <Carousel aria-label="Highlights" className="hero" loop defaultPlaying interval={7000}>
      <CarouselViewport>
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className={`hero-slide tone-${slide.tone}`}>
              <img className="cover" src={heroImages[slide.id]} alt="" />
              <div className="container hero-copy">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1>{slide.title}</h1>
                <Button data-variant="solid" render={<a href={`#${slide.id}`} />}>
                  {slide.cta}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className="container hero-controls">
        <CarouselPrevious aria-label="Previous highlight" />
        <CarouselIndicatorGroup aria-label="Choose a highlight">
          {heroSlides.map((slide, index) => (
            <CarouselIndicator key={slide.id} page={index + 1} aria-label={slide.title} />
          ))}
        </CarouselIndicatorGroup>
        <CarouselNext aria-label="Next highlight" />
        <CarouselPlayToggle className="play-toggle">
          {(state) => (state.playing ? "Pause highlights" : "Play highlights")}
        </CarouselPlayToggle>
      </div>
    </Carousel>
  );
}

function Divisions({
  value,
  onValueChange,
}: {
  value: string | null;
  onValueChange: (value: string | null) => void;
}) {
  return (
    <section id="divisions" className="band band-muted" aria-labelledby="divisions-title">
      <div className="container">
        <h2 id="divisions-title" className="visually-hidden">
          ZEISS divisions
        </h2>
        <Tabs value={value} onValueChange={onValueChange} className="division-tabs">
          <TabsList aria-label="ZEISS divisions">
            {divisionGroups.map((group) => (
              <TabsTab key={group.value} value={group.value}>
                <span className="tile-icon">
                  <Icon name={group.icon} size={28} />
                </span>
                <span className="tile-names">
                  {group.divisions.map((item, index) => (
                    <span key={item.name}>
                      {index > 0 && <span className="visually-hidden">and </span>}
                      {item.name}
                      {index < group.divisions.length - 1 && " "}
                    </span>
                  ))}
                </span>
              </TabsTab>
            ))}
          </TabsList>
          {divisionGroups.map((group) => (
            <TabsPanel key={group.value} value={group.value} className="division-panel">
              <h3 className="section-title">{group.headline}</h3>
              {group.divisions.map((item) => (
                <article key={item.name} className="division">
                  <div>
                    <p className="eyebrow dark">{item.name}</p>
                    <p>{item.teaser}</p>
                  </div>
                  {item.cards.length > 0 && (
                    <ul className="card-row">
                      {item.cards.map((card, index) => (
                        <li key={card}>
                          <a href={`#${group.value}`} className="link-card">
                            <img src={cardImages[item.name]?.[index]} alt="" loading="lazy" />
                            <span>{card}</span>
                            <Icon name="arrow" size={20} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </TabsPanel>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function Editorial() {
  const [selected, setSelected] = useState<Topic[]>([]);
  const shown =
    selected.length === 0 ? stories : stories.filter((story) => selected.includes(story.topic));

  return (
    <section className="band" aria-labelledby="focus-topics">
      <div className="container">
        <ul className="promo-grid">
          {promos.map((promo) => (
            <li key={promo.id}>
              <a href={`#${promo.id}`} className={`image-card tone-${promo.id}`}>
                <img className="cover" src={promoImages[promo.id]} alt="" loading="lazy" />
                <span className="kicker">{promo.kicker}</span>
                <span className="card-title">{promo.title}</span>
              </a>
            </li>
          ))}
        </ul>

        <h2 id="focus-topics" className="section-title center">
          Focus topics
        </h2>
        <ToggleGroup
          multiple
          aria-label="Filter stories by topic"
          className="chips"
          value={selected}
          onValueChange={(value) => setSelected(value as Topic[])}
        >
          {topics.map((topic) => (
            <Toggle key={topic.value} value={topic.value}>
              {topic.label}
            </Toggle>
          ))}
        </ToggleGroup>
        <p className="visually-hidden" aria-live="polite">
          {shown.length} stories shown
        </p>
        <ul className="story-grid">
          {shown.map((story) => (
            <li key={story.id}>
              <a href={`#${story.id}`} className={`image-card tone-${story.topic}`}>
                <img className="cover" src={storyImages[story.id]} alt="" loading="lazy" />
                <span className="kicker">
                  {topics.find((topic) => topic.value === story.topic)?.label}
                </span>
                <span className="card-title">{story.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="center">
          <Button data-variant="solid" render={<a href="#stories" />}>
            Discover more
          </Button>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section className="band band-muted portfolio" aria-labelledby="portfolio-title">
      <img className="portfolio-image" src={portfolioImage} alt="" loading="lazy" />
      <div className="container portfolio-inner">
        <div>
          <h2 id="portfolio-title" className="section-title">
            Our products and solutions
          </h2>
          <p className="subtitle">Discover our entire portfolio</p>
          <a href="#divisions" className="arrow-link">
            Go to overview <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Newsroom() {
  const [page, setPage] = useState(1);
  const items = news.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE);

  return (
    <section id="newsroom" className="band" aria-labelledby="newsroom-title">
      <div className="container">
        <h2 id="newsroom-title" className="section-title center">
          Newsroom
        </h2>
        <p className="center muted">Current news from the ZEISS Group</p>
        <div className="news-grid">
          {items.map((item) => (
            <article key={item.id} className="news-card">
              <img className="news-image" src={newsImages[item.id]} alt="" loading="lazy" />
              <p className="meta">{item.date}</p>
              <h3>
                <a href={`#${item.id}`}>{item.title}</a>
              </h3>
              <p className="meta">Press release</p>
            </article>
          ))}
          <aside className="news-aside">
            <h3>News from the world of ZEISS</h3>
            <p className="muted">Current news and information from the ZEISS Group.</p>
            <a href="#press" className="arrow-link">
              All press releases <Icon name="arrow" size={18} />
            </a>
          </aside>
        </div>
        <Pagination
          aria-label="Newsroom pages"
          total={news.length}
          pageSize={NEWS_PER_PAGE}
          page={page}
          onPageChange={setPage}
        >
          <PaginationList>
            {({ items: pages }) => (
              <>
                <PaginationItem>
                  <PaginationPrevious aria-label="Previous news page" />
                </PaginationItem>
                {pages.map((item) =>
                  typeof item === "number" ? (
                    <PaginationItem key={item}>
                      <PaginationLink page={item} />
                    </PaginationItem>
                  ) : null,
                )}
                <PaginationItem>
                  <PaginationNext aria-label="Next news page" />
                </PaginationItem>
              </>
            )}
          </PaginationList>
        </Pagination>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="band events" aria-labelledby="events-title">
      <div className="container events-grid">
        <div className="events-image">
          <img className="cover" src={eventsImage} alt="" loading="lazy" />
          <h2 id="events-title">Events</h2>
        </div>
        <div className="events-side">
          <div className="highlight">
            <p className="label">Recommended highlight</p>
            <h3>OB 2026</h3>
            <p>25 – 27 November 2026</p>
            <p>Brussels</p>
          </div>
          <div className="upcoming">
            <h3>Upcoming events</h3>
            <Accordion aria-label="Upcoming events" defaultValue={[events[0].id]}>
              {events.map((event) => (
                <AccordionItem key={event.id} value={event.id}>
                  <AccordionHeader render={<h4 />}>
                    <AccordionTrigger>{event.name}</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel>
                    <p className="meta">
                      {event.date} · {event.place}
                    </p>
                    <HoverCard>
                      <HoverCardTrigger href={`#event-${event.id}`} className="arrow-link">
                        Details for {event.name} <Icon name="external" size={16} />
                      </HoverCardTrigger>
                      <HoverCardContent className="event-card">
                        <strong>{event.name}</strong>
                        <p>{event.about}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
            <Button data-variant="outline" render={<a href="#all-events" />}>
              See all events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <section id="contact" className="band" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" className="section-title center">
          Contact & information
        </h2>
        <div className="contact-grid">
          <ContactDrawer />
          <a href="#locations" className="contact-tile">
            <Icon name="globe" size={36} />
            <span>ZEISS locations</span>
          </a>
          <a href="#careers" id="careers" className="contact-tile">
            <Icon name="handshake" size={36} />
            <span>
              We are hiring
              <small>Become a part of the ZEISS team</small>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer side="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="contact-tile">
        <Icon name="people" size={36} />
        <span>Find the right contact person</span>
      </DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent className="contact-drawer">
        <DrawerTitle>Contact ZEISS</DrawerTitle>
        <DrawerDescription>
          Tell us what you need and the right team will get back to you.
        </DrawerDescription>
        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setOpen(false);
            toast("Thank you for your message", {
              description: `Our ${data.get("area")} team will reply to ${data.get("email")}.`,
            });
          }}
        >
          <Field name="name">
            <FieldLabel>Full name</FieldLabel>
            <Input autoComplete="name" required />
            <FieldError />
          </Field>
          <Field name="email">
            <FieldLabel>Email address</FieldLabel>
            <Input type="email" autoComplete="email" required />
            <FieldError />
          </Field>
          <Field>
            <FieldLabel>Area of interest</FieldLabel>
            <Select name="area" defaultValue="ZEISS Group" required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field name="message">
            <FieldLabel>Your message</FieldLabel>
            <Textarea required />
            <FieldDescription>Please don't include confidential patient data.</FieldDescription>
            <FieldError />
          </Field>
          <Field className="row-field">
            <Checkbox name="privacy" required>
              <CheckboxIndicator />
            </Checkbox>
            <FieldLabel>I have read the privacy notice</FieldLabel>
          </Field>
          <div className="dialog-actions">
            <DrawerClose data-variant="outline">Cancel</DrawerClose>
            <Button type="submit" data-variant="solid">
              Send message
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function Footer({ onCookiePreferences }: { onCookiePreferences: () => void }) {
  const columns = [
    {
      title: "Frequently used",
      links: [
        "Sustainability at ZEISS",
        "Innovation at ZEISS",
        "History at a glance",
        "Carl Zeiss Foundation",
      ],
    },
    {
      title: "About ZEISS",
      links: ["About", "Career", "Newsroom", "Compliance", "Accessibility statement"],
    },
  ];
  const social = ["Facebook", "Instagram", "LinkedIn", "YouTube", "X"];

  return (
    <footer>
      <div className="container back-to-top">
        <a href="#top" className="arrow-link">
          Back to top <Icon name="up" size={18} />
        </a>
      </div>
      <div className="related">
        <div className="container">
          <strong>Related ZEISS Websites</strong>
          <a href="#annual-report">Annual Report of the ZEISS Group</a>
          <a href="#forum">ZEISS Forum</a>
        </div>
      </div>
      <div className="container footer-main">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="Social media">
          <h2>Social media</h2>
          <ul className="social">
            {social.map((name) => (
              <li key={name}>
                <Tooltip>
                  <TooltipTrigger render={<a href={`#${name.toLowerCase()}`} />}>
                    {name}
                  </TooltipTrigger>
                  <TooltipContent>Opens ZEISS on {name}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-selects">
          <div className="footer-select">
            <Select defaultValue="ZEISS Group">
              <SelectLabel>Select ZEISS Area</SelectLabel>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="footer-select">
            <Select defaultValue={websites[0]}>
              <SelectLabel>Select website</SelectLabel>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {websites.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="legal">
        <div className="container">
          {["Contact", "Publisher", "Legal Notice", "Privacy Notice", "Cookie Notice"].map(
            (link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                id={link === "Privacy Notice" ? "privacy" : undefined}
              >
                {link}
              </a>
            ),
          )}
          <Button className="legal-button" onClick={onCookiePreferences}>
            Cookie Preferences
          </Button>
        </div>
      </div>
    </footer>
  );
}

export { App };
