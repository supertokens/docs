export function getNavbarHeight(): number {
  if (typeof window === "undefined") return 140;

  const navbar = document.querySelector("nav.navbar");
  if (!navbar) return 140;

  const height = navbar.getBoundingClientRect().height;
  return height;
}

function scrollToElementWithOffset(element: Element): void {
  const navbarHeight = getNavbarHeight();
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const targetScrollTop = absoluteElementTop - navbarHeight - 16;

  window.scrollTo({
    top: targetScrollTop,
    behavior: "smooth",
  });
}

function handleHashNavigation(): void {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (!hash) return;

  const targetId = hash.substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    setTimeout(() => {
      scrollToElementWithOffset(targetElement);
    }, 100);
  }
}

function handleHashLinkClick(event: Event): void {
  const target = event.target as HTMLElement;
  const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

  if (!link || !link.hash) return;

  const targetId = link.hash.substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    event.preventDefault();
    history.pushState(null, "", link.hash);
    scrollToElementWithOffset(targetElement);
  }
}

export function initScrollOffset(): void {
  if (typeof window === "undefined") return;

  setTimeout(handleHashNavigation, 100);
  setTimeout(handleHashNavigation, 500);
  window.addEventListener("hashchange", handleHashNavigation);
  document.addEventListener("click", handleHashLinkClick);
}

