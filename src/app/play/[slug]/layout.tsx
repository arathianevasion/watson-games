// The play route renders its own top bar; the site header/footer from the root layout
// are hidden here so the game is the brightest thing on screen.
export default function PlayLayout({ children }: LayoutProps<"/play/[slug]">) {
  return (
    <>
      <style>{`header, footer { display: none } main { display: flex; flex-direction: column }`}</style>
      {children}
    </>
  );
}
