
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_mobile_ui():
    async with async_playwright() as p:
        # Launch browser (headless by default, but useful to keep in mind)
        browser = await p.chromium.launch()

        # Create a mobile context (iPhone 13 dimensions)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        try:
            # 1. Navigate to the app (basePath is /map)
            await page.goto("http://localhost:3000/map/", timeout=60000)

            # Wait for map or initial UI to load
            # Check for the Mobile Header. Use a more specific locator to avoid title tag
            # Text is split into spans: Tomokichi Globe.
            # We have two elements because PC UI is hidden but present in DOM?
            # Yes, standard hidden/block usage keeps elements in DOM.
            # We should check for the visible one.
            await expect(page.locator("a", has_text="Tomokichi").last).to_be_visible()

            # 2. Check initial state (Map visible, "Select Region" button visible)
            # The map canvas should be there (maybe hard to assert content, but element exists)
            await expect(page.locator(".mapboxgl-canvas")).to_be_visible()

            # Check for the toggle button at the bottom
            # It might be "Select Region" or "Select Trip" depending on default mode.
            # Default is region mode probably?
            # Let's check for either.
            # It has 'animate-bounce', so it might be unstable.
            # We can force click or wait for it to be ready?
            # Playwright checks for stability (no animation) by default.
            await expect(page.locator("button", has_text="Select ").last).to_be_visible()

            # Take screenshot of initial state
            await page.screenshot(path="verification/mobile_initial.png")
            print("Initial mobile state screenshot taken.")

            # 3. Open Region Selector
            # Find the main action button at bottom
            main_button = page.locator("button", has_text="Select ").last

            # Force click to bypass animation check if needed, but let's try standard click with trial
            await main_button.click(force=True)

            # Verify Bottom Sheet opens
            await expect(page.get_by_text("Explore Regions").or_(page.get_by_text("All Trips")).last).to_be_visible()

            # Take screenshot of open sheet
            await page.screenshot(path="verification/mobile_sheet_open.png")
            print("Mobile sheet open screenshot taken.")

            # 4. Switch to Trip Mode via toggle in header
            # The buttons have no text, just icons. They are in a flex gap-2 container.
            # We need to find the visible one.
            # MobileOverlay is in .md:hidden
            # Header has buttons too.
            # Let's target the MobileOverlay specific buttons.
            # MobileOverlay -> div.flex.gap-2 -> button

            # Let's use the visible filter
            buttons = page.locator("div.flex.gap-2 > button").locator("visible=true")
            # First is Region, Second is Trip
            await buttons.nth(1).click()

            # Wait for "Select Trip" or trips list.
            # Code: onClick={() => { setViewMode("trip"); setIsSheetOpen(true); }}
            # Sheet should be open.
            await expect(page.get_by_text("All Trips").last).to_be_visible()

            await page.screenshot(path="verification/mobile_trip_mode.png")
            print("Mobile trip mode screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_mobile_ui())
