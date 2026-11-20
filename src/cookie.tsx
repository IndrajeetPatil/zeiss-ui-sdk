import { useEffect, useState } from "react";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui-sdk/react/dialog";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { toast } from "@ui-sdk/react/toast";

type Site = "zeiss" | "shop";
type Prefs = { statistics: boolean; functional: boolean; marketing: boolean };

const OPEN_EVENT = "zeiss:open-cookie-settings";

function openCookieSettings(site: Site) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: site }));
}

function CookieDialog({ site }: { site: Site }) {
  const key = `zeiss-consent:${site}`;
  const [open, setOpen] = useState(() => localStorage.getItem(key) === null);
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : { statistics: false, functional: false, marketing: false };
  });

  useEffect(() => {
    const reopen = (event: Event) => {
      if ((event as CustomEvent<Site>).detail === site) setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, [site]);

  return (
    <Dialog
      open={open}
      dismissible={false}
      onOpenChange={(next, details) => {
        setOpen(next);
        if (next) return;
        const choice = details.returnValue;
        const all = choice === "accept";
        const saved =
          choice === "save" ? prefs : { statistics: all, functional: all, marketing: all };
        setPrefs(saved);
        localStorage.setItem(key, JSON.stringify(saved));
        toast(
          all
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
              {(["statistics", "functional", "marketing"] as const).map((category) => (
                <Field key={category}>
                  <Switch
                    name={category}
                    checked={prefs[category]}
                    onCheckedChange={(checked) =>
                      setPrefs((current) => ({ ...current, [category]: checked }))
                    }
                  >
                    <SwitchThumb />
                  </Switch>
                  <FieldLabel>{category[0].toUpperCase() + category.slice(1)} cookies</FieldLabel>
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

export { CookieDialog, openCookieSettings };
