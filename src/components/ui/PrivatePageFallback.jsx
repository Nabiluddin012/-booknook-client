export default function PrivatePageFallback() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="borrow-empty" aria-live="polite">
          <div className="loading-ring" />
          <p>Checking your account...</p>
        </div>
      </div>
    </main>
  );
}
