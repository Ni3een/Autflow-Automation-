const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="dot-grid flex h-full min-h-full flex-1 flex-col">{children}</div>;
};

export default Layout;
