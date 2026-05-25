export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>Navbar</h1>
      {children}
    </div>
  );
}
