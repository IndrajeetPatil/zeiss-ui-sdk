# Evaluation tasks

Give both evaluators these tasks verbatim, in this order. Each task must stay doable on both sites; see the skill's "Apples to apples" rule before changing one.

## Homepage tasks

1. Dismiss the cookie/privacy banner, rejecting optional cookies, and confirm it's gone.
2. Using the main navigation, find the list of ZEISS divisions/business areas, then find what the homepage offers for Photography (the links or cards shown for it).
3. Use the site's search to look for "Planetariums" and report what you get.
4. Read the latest newsroom headline on the homepage, then get to older news items (the next set of news).
5. Find the upcoming events and the details (date and place) of the second upcoming event.
6. Open the way to contact ZEISS ("Find the right contact person" or similar) and fill in a contact form if one is reachable: name "Test Agent", email test@example.com, any area of interest, a short message. DO NOT submit anything.
7. In the footer, change the website/country selector to a German site (don't follow through to a real navigation if it would leave the page; just report whether the control is operable and what it is).
8. Filter the homepage stories by the "Sustainability" focus topic and list the stories shown.

## Buyer journey

The main comparison: a customer buying a ZEISS trail camera. Give this task verbatim:

> Starting from the ZEISS Group homepage, find ZEISS's trail cameras for nature observation and go to the official ZEISS online shop that sells them. In the shop, filter the trail cameras to those with a **100° wide-angle field of view**, and pick the **cheapest** one. Open its product page, set the quantity to **2**, and add it to the cart. Open the full shopping cart page, then report the product name, product number, quantity, unit price, shipping cost, and grand total. Do not click "Go to checkout" and do not enter any personal or payment data.

Ask the evaluator to break the journey into steps (homepage → … → cart) and record actions and obstacles per step, not just for the whole task.

Expected end state, for checking the evaluator's result:

| Field          | Value                              |
| -------------- | ---------------------------------- |
| Product        | ZEISS Secacam 3 Wide-Angle         |
| Product number | SC-000-130-100                     |
| Quantity       | 2                                  |
| Unit price     | €149.99 (incl. 19% VAT)            |
| Shipping       | €0.00                              |
| Grand total    | €299.98 (net €252.08 + VAT €47.90) |

The only other 100° camera is the ZEISS Secacam 5 Wide-Angle at €199.99, so picking it fails the "cheapest" criterion.

On the original, the path runs through `www.zeiss.com` (homepage, Nature Observation, Products, Trail Cameras) and then `shop.zeiss.com`. The shop is run by the licensee Valyra, opens in a new tab, and shows its own cookie banner. Live prices can change with promotions; record what the evaluator saw.

The rebuild mirrors the same steps at `/`, `/nature-observation`, `/nature-observation/products`, `/nature-observation/products/trail-cameras`, `/shop/cameras`, `/shop/cameras/secacam-3-wide-angle`, and `/checkout/cart`.

## What to record per task

- Success: yes, partial, or no.
- The number of agent actions: clicks, fills, key presses, and tool calls.
- What made it easy or hard: unnamed or duplicate controls, missing roles or states, hidden or lazy content, overlays, timing or animation, iframes, custom widgets with no ARIA, and so on.
- Any workaround, and whether the agent had to leave the starting page.
